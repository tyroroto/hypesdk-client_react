// ** React Imports
import {useEffect, useMemo, useState} from 'react'
import useBoundStore from "../../../../../../stores";
import {useForm, Controller} from "react-hook-form";
import toast from "react-hot-toast";
import {Button, Form, Offcanvas} from "react-bootstrap";
import {Info, X} from "react-feather";
import Select , { createFilter } from "react-select";
import {Input, Label} from "reactstrap";
import {addFormRelation, createFormField, removeFormField, updateFormField} from "../../../../../../libs/axios";
import {useQueryClient} from "react-query";
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";

interface FieldTypeOption {
    value: string;
    label: string;
    fieldType: string;
}

const fieldTypeOptions: Array<FieldTypeOption> = [
    // {value: 'row', label: 'Row'},
    {
        value: 'text-input',
        label: 'Input Text',
        fieldType: 'string'
    }, {
        value: 'number-input',
        label: 'Input Number',
        fieldType: 'int'
    }, {
        value: 'float-input',
        label: 'Input Float',
        fieldType: 'float'
    },
    {
        value: 'text-area',
        label: 'Text Area',
        fieldType: 'mediumtext'
    },
    {
        value: 'radio',
        label: 'Radio (TEXT)',
        fieldType: 'string'
    },
    {
        value: 'datetime',
        label: 'Date & Time',
        fieldType: 'datetime'
    }, {
        value: 'date',
        label: 'Date',
        fieldType: 'date'
    },
    {
        value: 'time',
        label: 'Time',
        fieldType: 'time'
    },
    {
        value: 'checkbox',
        label: 'Checkbox',
        fieldType: 'boolean'
    },
    {
        value: 'select',
        label: 'Select (TEXT)',
        fieldType: 'string'
    },
]

const FieldConfigCanvas = (props: { show: boolean }) => {
    const swalController = withReactContent(Swal)
    const closeBoxConfig = useBoundStore(state => state.formEditor.closeFieldConfig);
    const formData = useBoundStore(state => state.formEditor.formData);
    const currentSelectedField = useBoundStore(state => state.formEditor.currentSelectedField);
    const removeField = removeFormField;
    const fieldConfigFormAction = useBoundStore(state => state.formEditor.fieldConfigFormAction);
    // Get QueryClient from the context
    const queryClient = useQueryClient()
    const [slugInit, setSlugInit] = useState('');
    const defaultValues = useMemo(() => {
        return {name: currentSelectedField?.name ?? '', slug: currentSelectedField?.slug ?? '', selectedFieldType: fieldTypeOptions.find( ft => ft.value == currentSelectedField?.componentTemplate ) ?? undefined};
    }, [currentSelectedField]);
    const {
        reset, control, setError, watch, handleSubmit, formState: {errors}
    } = useForm<{
        name: string,
        slug: string,
        targetForm?: {value: number},
        connectFromField?: number,
        connectToField?: number,
        selectedFieldType?: FieldTypeOption
    }>(
        {
            defaultValues: defaultValues
        })


    const watchFieldTypeSelect = watch('selectedFieldType');
    const [listFormData, setListFormData] = useState([])

    useEffect(() => {
        reset(defaultValues)
    }, [currentSelectedField, defaultValues])
    function onSubmit(data: any) {
        if (data.slug == null || data.slug === '') {
            data.slug = slugInit;
        }

        if (data.selectedFieldType === null) {
            setError('selectedFieldType', {type: 'custom', message: 'Please select fieldType'})
            return;
        }

        if (fieldConfigFormAction == 'new') {
            switch (data.selectedFieldType.value) {
                case 'relation':
                case 'relation-multiple':
                    addFormRelation(formData.id, {
                        formId: formData.id,
                        targetFormId: data.targetForm.value,
                        ...data,
                    }).then( r => console.log(r))
                    break;
                default:
                    toast.promise(
                        createFormField(formData.id, {
                            slug: data.slug,
                            name: data.name,
                            componentTemplate: data.selectedFieldType.value,
                            fieldType: data.selectedFieldType.fieldType,
                        }),
                        {
                            loading: 'Updating component',
                            success: 'Update component success',
                            error: 'Update component fail'
                        }
                    ).then(action => {
                        console.log(`/forms/${formData.id}`)
                        queryClient.invalidateQueries({ queryKey:[`forms`, formData.id.toString()] }).then(() => {})
                        reset();
                        setSlugInit('');
                    }).catch(e => {
                        console.error('createField fail', e)
                    })
                    break;
            }
        } else {
            toast.promise(
                updateFormField(formData.id, currentSelectedField.id, {
                    name: data.name,
                }), {
                    loading: 'Updating component',
                    success: 'Update component success',
                    error: 'Update component fail'
                }).then(action => {
                reset();
                setSlugInit('');
            }).catch(e => {
                console.error('createComponent fail', e)
            })
        }
    }


    return (
        <Offcanvas
            style={{width: 560}}
            backdrop="static" onHide={() => {
            closeBoxConfig()
        }} show={props.show} scroll={true}
            placement={"end"}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>{fieldConfigFormAction == 'edit' ? 'Update Field' : 'New Field'}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <div className='d-flex flex-wrap mb-0'>
                    <div className={'me-auto'}>
                        {currentSelectedField?.slug}
                    </div>
                    {(currentSelectedField != null) ? <Button variant={'outline-danger'} onClick={() => {
                        removeField(formData.id, currentSelectedField.id).then( r => console.log(r))
                    }} size={'sm'} type='submit' className='ms-auto mb-2' >
                        {/*TODO formData must valid*/}
                        remove {formData.id}
                        <X size={12}/>
                    </Button> : null}
                </div>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Label className='form-label' for='comp-name'>
                            Field Name
                        </Label>
                        <a href={"https://docs.hypesdk.com/form#field"} style={{position: 'absolute', right: 20}}
                           target={"_blank"} rel="noreferrer"><Info/></a>
                        <Controller
                            name='name'
                            control={control}
                            render={({field}) => (<Input {...field} id='comp-name'
                                                         type='text'
                                                         onChange={(e) => {
                                                             setSlugInit(e.target.value.trim().toLowerCase().replace(/ /g, "_"));
                                                             field.onChange(e)
                                                         }}
                                                         invalid={errors.name && true}/>)}
                        />
                    </div>
                    <div>
                        <Label className='form-label' for='comp-slug'>
                            Field Slug
                        </Label>
                        <Controller
                            name='slug'
                            control={control}
                            render={({field}) => (<Input {...field}
                                                         id='comp-slug'
                                                         type='text'
                                                         disabled={fieldConfigFormAction === 'edit'}
                                                         placeholder={slugInit}
                                                         invalid={errors.slug && true}/>)}
                        />
                    </div>

                    <div>
                        <Label className='form-label' for='component'>Field for Component</Label>
                        <Controller
                            name='selectedFieldType'
                            control={control}
                            render={({field}) => (<Input
                                {...field}
                                type='select'
                                value={watchFieldTypeSelect?.value}
                                onChange={(e) => {
                                    field.onChange(fieldTypeOptions.find(c => c.value === e.target.value))
                                }
                                }
                                disabled={fieldConfigFormAction === 'edit'}
                            >
                                <option value={''}>None</option>
                                {fieldTypeOptions.map((o, i) => {
                                    return <option key={o.value} value={o.value}>{o.label}</option>
                                })}
                            </Input>)}
                        />
                        {errors.selectedFieldType && <p className={'text-danger'}>{errors.selectedFieldType.message} !</p>}
                    </div>

                    {watchFieldTypeSelect != null && (watchFieldTypeSelect.value === 'relation' || watchFieldTypeSelect.value === 'relation-multiple') ?
                        <>
                            <div>
                                <Label className='form-label' for='targetForm'>Target Form</Label>
                                <Controller
                                    name='targetForm'
                                    control={control}
                                    render={({field}) => (
                                        <Select
                                            {...field}
                                            value={listFormData.length > 0 ? listFormData.filter((item: {value: number}) => item.value === (field.value ?? -1))[0] : field.value}
                                            options={listFormData}
                                            isClearable={false}
                                            filterOption={createFilter({trim: true})}
                                            className='react-select'
                                            classNamePrefix='select'
                                        />)}
                                />
                            </div>

                            <div>
                                <Label className='form-label' for='connectFromComponent'>Migrate relation</Label>
                                <Controller
                                    name='connectFromField'
                                    control={control}
                                    render={({field}) => (
                                        <Input {...field}
                                               type='text'
                                               placeholder={'this form component slug'}
                                               invalid={errors.slug && true}/>
                                    )}
                                />
                                <Controller
                                    name='connectToField'
                                    control={control}
                                    render={({field}) => (
                                        <Input {...field}
                                               type='text'
                                               placeholder={'target form component slug'}
                                               invalid={errors.slug && true}/>
                                    )}
                                />
                            </div>
                        </> : null
                    }

                    <Button type={'submit'} className='ms-auto mt-2' color='primary'>
                        Save
                    </Button>
                </Form>

            </Offcanvas.Body>
        </Offcanvas>
    )
}

export default FieldConfigCanvas
