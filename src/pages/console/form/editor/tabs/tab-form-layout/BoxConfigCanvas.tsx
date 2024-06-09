// ** React Imports
import {useCallback, useEffect, useRef, useState} from 'react'
import useBoundStore from "../../../../../../stores";
import {useForm, Controller} from "react-hook-form";
import toast from "react-hot-toast";
import {Button, Col, Form, Offcanvas, Row} from "react-bootstrap";
import {Info, X} from "react-feather";
import Select from "react-select";
import InputConfig from "./configs/InputConfig";
import {Input, Label, NavItem, Nav, NavLink, TabContent, TabPane} from "reactstrap";
import TextConfig from "../../../../../../hype/share-components/TextConfig";
import {LayoutComponentInterface, LayoutComponentType} from "../../../../../../hype/classes/generate-input.interface";
import RadioConfig from "./configs/RadioConfig";

interface IComponentSelectOption {
    layoutType: string;
    type: string;
    slug: string;
    value: string;
    label: string;
}

interface IBoxConfigComponent {
    layoutType: string
    type: string
    slug: string
    value: string
    label: string
}

interface IFormBoxConfig {
    htmlId: string;
    elemId: string;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    label: string;
    component?: IBoxConfigComponent;
    options: any;
    targetForm: any;
    description: string
    grow: boolean;
}

const BoxConfigCanvas = (props: { show: boolean }) => {
    const closeBoxConfig = useBoundStore(state => state.formEditor.closeBoxConfig);
    const formData = useBoundStore(state => state.formEditor.formData);
    const updateBox = useBoundStore(state => state.formEditor.updateBox);
    const createBox = useBoundStore(state => state.formEditor.createBox);
    const removeBox = useBoundStore(state => state.formEditor.removeBox);
    const layoutItemList = useBoundStore(state =>
        state.formEditor.layoutItemList
    );
    const currentSelectedBox = useBoundStore(state =>
        state.formEditor.currentSelectedBox
    );
    const boxConfigFormAction = useBoundStore(state =>
        state.formEditor.boxConfigFormAction
    );
    const [fieldRelation, setFieldRelation] = useState([]);
    const [selectFieldRelation, setSelectFieldRelation] = useState([]);
    const [componentOptions, setComponentOptions] = useState<Array<IComponentSelectOption>>([]);
    const [enableActiveCode, setEnableActiveCode] = useState(false);
    const [activeCode, setActiveCode] = useState('');
    const [enableAllowCode, setEnableAllowCode] = useState(false);
    const [allowCode, setAllowCode] = useState('');
    const activeCodeRef = useRef<Input>(null);
    const allowCodeRef = useRef<Input>(null);
    const {
        reset,
        // setError,
        watch,
        setValue,
        control,
        setError,
        handleSubmit,
        formState: {errors}
    } = useForm<IFormBoxConfig>()
    const watchComponentSelect = watch('component');
    const watchTargetFormSelect = watch('targetForm');
    useEffect(() => {
        if (currentSelectedBox != null) {
            console.log(currentSelectedBox.config)
            setValue('component', currentSelectedBox.config.component)
            setValue('label', currentSelectedBox.config.label)
            setValue('description', currentSelectedBox.config.description)
            setValue('htmlId', currentSelectedBox.config.htmlId)
            setOption(currentSelectedBox.config.options)
        }

    }, [currentSelectedBox?.id])

    useEffect(() => {
        if (formData?.fields != null) {
            const options = generateOptions(formData.fields);
            setComponentOptions(options)
        }
    }, [formData?.fields])

    const [options, setOption] = useState<any>(null);

    // useEffect(() => {
    //     // console.log('currentSelectedBox', currentSelectedBox);
    //     if (currentSelectedBox != null && currentBoxId !== currentSelectedBox?.id) {
    //         setCurrentBoxId(currentSelectedBox.id);
    //         reset();
    //         console.log('config', currentSelectedBox.config)
    //         setValue('id', currentSelectedBox.config?.id ?? '')
    //         setValue('xs', currentSelectedBox.config?.xs ?? 12)
    //         setValue('sm', currentSelectedBox.config?.sm ?? 12)
    //         setValue('md', currentSelectedBox.config?.md ?? 12)
    //         setValue('lg', currentSelectedBox.config?.lg ?? 12)
    //         setValue('label', currentSelectedBox.config?.label);
    //         setValue('placeholder', currentSelectedBox.config?.placeholder);
    //         setValue('targetForm', currentSelectedBox.config?.targetForm);
    //         setValue('component', currentSelectedBox.config?.component);
    //         setActiveCode(currentSelectedBox.config?.activeCode);
    //         setEnableActiveCode(currentSelectedBox.config?.enableActiveCode != null ? currentSelectedBox.config?.enableActiveCode : false);
    //         setOption(currentSelectedBox.config?.options ?? null);
    //         setEnableAllowCode(currentSelectedBox.config?.options?.enableAllowCode ?? false);
    //         setAllowCode(currentSelectedBox.config?.options?.allowCode ?? '');
    //     }
    // }, [boxConfigFormAction, currentSelectedBox])

    function onSubmit(data: any) {
        data.options = {...options};
        if (data.component === null
            && currentSelectedBox.type !== 'row'
            && currentSelectedBox.type !== 'col'
            && currentSelectedBox.type !== 'container'
        ) {
            setError('component', {type: 'custom', message: 'Please select component'})
            return;
        }

        switch (boxConfigFormAction) {
            case 'edit':
                updateBox(
                    currentSelectedBox.id,
                    {
                        config: {
                            ...data,
                            activeCode,
                            enableActiveCode
                        },
                    });
                break;
            case 'new':
                createBox(currentSelectedBox.id, {
                    type: data.component.layoutType,
                    config: {
                        ...data,
                        activeCode,
                        enableActiveCode
                    },
                    component: {
                        slug: data.component.slug,
                        type: data.component.type,
                        id: data.component.value
                    }
                });
                break;
            default:
                console.log('formAction not match ', boxConfigFormAction)
        }
        toast.success('Save Options Success.')
    }

    const onSaveActiveConfig = () => {
        // dispatch(updateConfig({
        //     id: currentSelectedBox.id,
        //     config: {
        //         ...currentSelectedBox.config,
        //         activeCode,
        //         enableActiveCode
        //     },
        // }))
        toast.success('Save Active options Success.')
    };
    const onSaveAllowConfig = () => {
        // const tmpInput = {...options};
        // tmpInput.enableAllowCode = enableAllowCode;
        // tmpInput.allowCode = allowCode;
        // setOption({...tmpInput})
        //
        // dispatch(updateConfig({
        //     id: currentSelectedBox.id,
        //     config: {
        //         ...currentSelectedBox.config,
        //         options: {
        //             ...currentSelectedBox.config.options,
        //             allowCode,
        //             enableAllowCode,
        //         }
        //     },
        // }));

        toast.success('Save allowCode options Success.')
    };

    function generateOptions(components: Array<{
        slug: string,
        id: string,
        componentTemplate: LayoutComponentType,
        name: string,
    }>) {
        const options: LayoutComponentInterface[] = [
            {
                layoutType: 'decorator',
                type: 'label',
                slug: '',
                value: 'label',
                label: 'Label'
            },
            // {
            //     layoutType: 'utility',
            //     type: 'datatable',
            //     slug: '',
            //     value: 'datatable',
            //     label: 'Datatable'
            // },
            // {
            //     layoutType: 'utility',
            //     type: 'record-repeater',
            //     slug: '',
            //     value: 'record-repeater',
            //     label: 'Record Repeater'
            // },
            // {
            //     layoutType: 'utility',
            //     type: 'fileupload',
            //     slug: '',
            //     value: 'fileupload',
            //     label: 'File Upload'
            // },
            {
                layoutType: 'decorator',
                type: 'divider',
                slug: '',
                value: 'divider',
                label: 'Divider'
            },
            {
                layoutType: 'decorator',
                type: 'button',
                slug: '',
                value: 'button',
                label: 'Button'
            },
            // {
            //     layoutType: 'decorator',
            //     type: 'button-dropdown',
            //     slug: '',
            //     value: 'button-dropdown',
            //     label: 'Dropdown Button'
            // },
        ];
        for (const c of components) {
            const compBoxData = layoutItemList.find(box => box.component?.slug == c.slug)
            if (compBoxData == null) {
                options.push({
                    slug: c.slug,
                    value: c.id,
                    layoutType: 'input',
                    type: c.componentTemplate,
                    label: `${c.name}-${c.slug} (${c.componentTemplate})`
                })
            }

        }
        return options;
    }

    const addDefaultInputOption = useCallback((type: string) => {
        switch (type) {
            case 'radio':
                setOption({inline: "horizontal", input: [{label: 'Text1', value: '1'}]});
                break;
            case 'select':
                setOption({input: [{label: 'Text1', value: '1'}]});
                break;
            case 'relation':
            case 'select-mapping':
                setOption({input: []});
                break;
            case 'button':
                setOption({color: 'primary'});
                break;
            case 'button-dropdown':
                setOption({color: 'primary', input: [{label: 'Button1', value: 'btn1'}]});
                break;
            case 'user-select':
            case 'role-select':
            case 'permission-select':
            case 'user-approved':
                setOption({type: "single"});
                break;
            default:
                setOption(null);
                break;
        }
    }, [setOption])

    useEffect(() => {
        // console.log('watchTargetFormSelect', watchTargetFormSelect);
        if (watchTargetFormSelect) {
            // TODO REFACTOR
            // dispatch(getFormData(watchTargetFormSelect.meta.formId)).then(e => {
            //     const tmpField = [];
            //     // console.log('e.payload', e.payload);
            //     for (const val of e.payload.fields) {
            //         tmpField.push({
            //             slug: val.slug,
            //             value: val.id,
            //             type: val.componentTemplate,
            //             label: `${val.name}: ${val.slug} (${val.componentTemplate})`,
            //             headerText: val.slug,
            //             style: null
            //         })
            //     }
            //     // console.log('FieldRelation', tmpField);
            //     setFieldRelation(tmpField);
            // });
            setSelectFieldRelation(options?.field ?? []);
        }
    }, [watchTargetFormSelect]);

    const [activeTab, setActiveTab] = useState('boxConfig');
    const toggleTab = useCallback((t: string) => {
        setActiveTab(t)
    }, [])

    return (
        <Offcanvas
            style={{width: 560}}
            backdrop="static" onHide={() => {
            closeBoxConfig()
        }} show={props.show} scroll={true}
            placement={"end"}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>{boxConfigFormAction == 'edit' ? 'Update Component' : 'New Component'}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <>
                    <div className={'d-flex'}>
                        <a href={"https://hype-docs-e0110.web.app/form#%E0%B8%AA%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B8%AD%E0%B8%A1%E0%B9%82%E0%B8%9E%E0%B9%80%E0%B8%99%E0%B9%89%E0%B8%99%E0%B9%83%E0%B8%99-layout"}
                           style={{}} target={"_blank"} rel="noreferrer"><Info/>
                        </a> {currentSelectedBox?.id}
                        {
                            currentSelectedBox != null && boxConfigFormAction === 'edit' ?

                                <div className='ms-auto d-flex flex-wrap mb-0'>
                                    <Button onClick={() => {
                                        removeBox(currentSelectedBox.id)
                                    }} size={'sm'} type='submit' className='ms-auto mb-2' variant='danger'>
                                        remove
                                        <X size={12}/>
                                    </Button>
                                </div> : null
                        }
                    </div>

                    <div>

                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    active={activeTab === 'boxConfig'}
                                    onClick={() => {
                                        toggleTab('boxConfig')
                                    }}
                                >
                                    Box Config
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    active={activeTab === 'activeConfig'}
                                    onClick={() => {
                                        toggleTab('activeConfig')
                                    }}
                                >
                                    Render Active Config
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    active={activeTab === 'allowConfig'}
                                    onClick={() => {
                                        toggleTab('allowConfig')
                                    }}
                                >
                                    Allow Input Config
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId='boxConfig'>
                                <Form onSubmit={handleSubmit(onSubmit)} className={'pt-3'}>
                                    <Row>
                                        <Col sm={12} lg={12}>
                                            <Form.Group className="mb-3" controlId="config-id">
                                                <Form.Label>id</Form.Label>
                                                <Controller
                                                    control={control}
                                                    name='htmlId'
                                                    render={({field}) => (
                                                        <Form.Control
                                                            type='text'
                                                            placeholder={'ID for html'}
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </Form.Group>
                                        </Col>
                                        {
                                            boxConfigFormAction === 'new' ||
                                            (
                                                boxConfigFormAction === 'edit' &&
                                                (
                                                    currentSelectedBox?.type === 'decorator' ||
                                                    currentSelectedBox?.type === 'input'
                                                )
                                            )
                                                ?
                                                <>
                                                    <Col sm={12} lg={12}>
                                                        <Form.Group className="mb-3" controlId="config-component">
                                                            <Form.Label>Component</Form.Label>
                                                            {/*<CreatableSelect on options={componentOptions} className='react-select' classNamePrefix='select' />*/}
                                                            <Controller
                                                                name='component'
                                                                control={control}
                                                                render={({
                                                                             field
                                                                         }) => (
                                                                    <Select
                                                                        {...field}
                                                                        isDisabled={boxConfigFormAction === 'edit'}
                                                                        isClearable={false}
                                                                        options={generateOptions(formData.fields)}
                                                                        className='react-select'
                                                                        classNamePrefix='select'
                                                                        // invalid={errors.component && true}
                                                                        onChange={e => {
                                                                            // console.log(e);
                                                                            if (e != null) {
                                                                                addDefaultInputOption(e.type);
                                                                            }
                                                                            field.onChange(e)
                                                                        }}
                                                                    />
                                                                )}
                                                            />

                                                            {errors.component &&
                                                                <Form.Text className="text-danger">
                                                                    {errors.component.message} !
                                                                </Form.Text>
                                                            }
                                                        </Form.Group>
                                                    </Col>

                                                    {
                                                        watchComponentSelect ?
                                                            <>
                                                                <Col sm={12} lg={12}>
                                                                    <Form.Group className="mb-3"
                                                                                controlId="config-slug">
                                                                        <Form.Label>Slug</Form.Label>
                                                                        <Form.Control
                                                                            type='text'
                                                                            disabled={true}
                                                                            placeholder={'name this input'}
                                                                            value={watchComponentSelect?.slug}/>
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col sm={12} lg={12}>
                                                                    <Form.Group className="mb-3"
                                                                                controlId="config-label">
                                                                        <Form.Label>Label</Form.Label>
                                                                        <Controller
                                                                            name='label'
                                                                            control={control}
                                                                            render={({field}) => (
                                                                                <Form.Control
                                                                                    {...field}
                                                                                    type='label'
                                                                                    placeholder={'name this input'}
                                                                                    // invalid={errors.label && true}
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col sm={12} lg={12} className={'zindex-0'}>
                                                                    <Label className='form-label'>
                                                                        Options Label
                                                                    </Label>
                                                                    <TextConfig change={(value: any) => {
                                                                        const tmpInput = {...options};
                                                                        tmpInput.configLabel = {...value};
                                                                        setOption({...tmpInput});
                                                                    }} value={options?.configLabel}/>
                                                                </Col>

                                                                <Col sm={12} lg={12}>
                                                                    <Label className='form-label'
                                                                           for='config-description'>
                                                                        Description
                                                                    </Label>
                                                                    <Controller
                                                                        name='description'
                                                                        control={control}
                                                                        render={({field}) => (
                                                                            <Input {...field} id='config-description'
                                                                                   type='textarea'
                                                                                   placeholder={'Description under input'}
                                                                            />
                                                                        )}
                                                                    />
                                                                </Col>
                                                            </>
                                                            : null
                                                    }
                                                </>
                                                : null
                                        }
                                    </Row>
                                    {
                                        watchComponentSelect && (
                                            watchComponentSelect.type === 'number-input' ||
                                            watchComponentSelect.type === 'float-input' ||
                                            watchComponentSelect.type === 'text-area' ||
                                            watchComponentSelect.type === 'text-input'
                                        ) ? (
                                            <InputConfig options={options} onChange={(e: any) => {
                                                setOption(e)
                                            }}/>
                                        ) : null
                                    }
                                    {
                                        watchComponentSelect &&
                                        (
                                            watchComponentSelect.type === 'radio' ||
                                            watchComponentSelect.type === 'radio-string' ||
                                            watchComponentSelect.type === 'select'
                                        )
                                            ? (
                                                <RadioConfig options={options} onChange={(updatedOption: any) => {
                                                    console.log('RadioConfig', updatedOption);
                                                    setOption(updatedOption)
                                                }}/>
                                            ) : null
                                    }

                                    {/*{*/}
                                    {/*    watchComponentSelect && (watchComponentSelect.type === 'editor') ? (*/}
                                    {/*        <EditorConfig options={options} onChange={(e) => {*/}
                                    {/*            console.log('EditorConfig', e);*/}
                                    {/*            setOption(e)*/}
                                    {/*        }}/>*/}
                                    {/*    ) : null*/}
                                    {/*}*/}
                                    {/*{*/}
                                    {/*    watchComponentSelect && (watchComponentSelect.type === 'checkbox') ? (*/}
                                    {/*        <CheckboxConfig options={options} onChange={(e) => {*/}
                                    {/*            console.log('CheckboxConfig', e);*/}
                                    {/*            setOption(e)*/}
                                    {/*        }}/>*/}
                                    {/*    ) : null*/}
                                    {/*}*/}
                                    {/*{*/}

                                    {/*}*/}
                                    {/*{*/}
                                    {/*    watchComponentSelect && (watchComponentSelect.type === 'select' || watchComponentSelect.type === 'select-varchar-30') ? (*/}
                                    {/*        <SelectConfig options={options} onChange={(e) => {*/}
                                    {/*            console.log('SelectConfig', e);*/}
                                    {/*            setOption(e)*/}
                                    {/*        }}/>*/}
                                    {/*    ) : null*/}
                                    {/*}*/}
                                    {/*{watchComponentSelect && (*/}
                                    {/*    watchComponentSelect.type === 'user-list') ?*/}
                                    {/*    <Col sm={12} lg={12} className={'mt-1 mb-1'}>*/}
                                    {/*        <Label className='form-label' for='config-defaultValue'>*/}
                                    {/*            Default Value*/}
                                    {/*        </Label>*/}
                                    {/*        <Input*/}
                                    {/*            id='config-defaultValue'*/}
                                    {/*            type='text'*/}
                                    {/*            placeholder={'Default Value'}*/}
                                    {/*            defaultValue={options.defaultValue}*/}
                                    {/*            onChange={(e) => {*/}
                                    {/*                const tmpInput = {...options};*/}
                                    {/*                tmpInput.defaultValue = e.target.value;*/}
                                    {/*                setOption({...tmpInput})*/}
                                    {/*            }}*/}
                                    {/*        />*/}
                                    {/*    </Col> : null*/}
                                    {/*}*/}
                                    {/*{*/}
                                    {/*    watchComponentSelect && (*/}
                                    {/*        watchComponentSelect.type === 'user-approved' ||*/}
                                    {/*        watchComponentSelect.type === 'role-list' ||*/}
                                    {/*        watchComponentSelect.type === 'permission-list'*/}
                                    {/*    ) ? (*/}
                                    {/*        <SelectMultipleConfig options={options} onChange={(e) => {*/}
                                    {/*            console.log('SelectMultipleConfig', e);*/}
                                    {/*            setOption(e)*/}
                                    {/*        }}/>*/}
                                    {/*    ) : null*/}
                                    {/*}*/}
                                    {/*{*/}
                                    {/*    watchComponentSelect && (watchComponentSelect.type === 'datatable') ? (*/}
                                    {/*        <DatatableFormConfig options={options} formId={store.formData.id}*/}
                                    {/*                             onChange={(e) => {*/}
                                    {/*                                 console.log('DatatableFormConfig', e);*/}
                                    {/*                                 setOption(e)*/}
                                    {/*                             }}/>*/}
                                    {/*    ) : null*/}
                                    {/*}*/}
                                    {/*{*/}
                                    {/*    watchComponentSelect && (watchComponentSelect.type === 'relation' || watchComponentSelect.type === 'relation-multiple') ? (*/}
                                    {/*        <SelectRelationConfig options={options} componentId={watchComponentSelect.value}*/}
                                    {/*                              onChange={(e) => {*/}
                                    {/*                                  console.log('SelectRelationConfig', e);*/}
                                    {/*                                  setOption(e)*/}
                                    {/*                              }}/>*/}
                                    {/*    ) : null*/}
                                    {/*}*/}
                                    {/*{*/}
                                    {/*    watchComponentSelect && (watchComponentSelect.type === 'select-mapping' || watchComponentSelect.type === 'select-mapping-multiple') ? (*/}
                                    {/*        <SelectMappingConfig options={options} componentId={watchComponentSelect.value}*/}
                                    {/*                             onChange={(e) => {*/}
                                    {/*                                 console.log('SelectMappingConfig', e);*/}
                                    {/*                                 setOption(e)*/}
                                    {/*                             }}/>*/}
                                    {/*    ) : null*/}
                                    {/*}*/}
                                    {/*{*/}
                                    {/*    watchComponentSelect && (watchComponentSelect.type === 'button') ? (*/}
                                    {/*        <ButtonConfig options={options} onChange={(e) => {*/}
                                    {/*            console.log('ButtonConfig', e);*/}
                                    {/*            setOption(e)*/}
                                    {/*        }}/>*/}
                                    {/*    ) : null*/}
                                    {/*}*/}
                                    {/*{*/}
                                    {/*    watchComponentSelect && (watchComponentSelect.type === 'button-dropdown') ? (*/}
                                    {/*        <ButtonDropdownConfig options={options} onChange={(e) => {*/}
                                    {/*            console.log('ButtonDropdownConfig', e);*/}
                                    {/*            setOption(e)*/}
                                    {/*        }}/>*/}
                                    {/*    ) : null*/}
                                    {/*}*/}
                                    {
                                        !watchComponentSelect && currentSelectedBox
                                        && (
                                            currentSelectedBox.type === 'col'
                                        ) ? (
                                            <>
                                                <Row className={'mt-3'}>
                                                    <h4>Responsive</h4>
                                                    <Col sm={6} lg={6}>
                                                        <Label className='form-label' for='config-xs-size'>
                                                            XS Size
                                                        </Label>
                                                        <Controller
                                                            name='xs'
                                                            control={control}
                                                            render={({field}) => (
                                                                <Input {...field} id='config-xs-size'
                                                                       type='number'
                                                                       invalid={errors.xs && true}/>
                                                            )}
                                                        />
                                                    </Col>

                                                    <Col sm={6} lg={6}>
                                                        <Label className='form-label' for='config-sm-size'>
                                                            SM Size
                                                        </Label>
                                                        <Controller
                                                            name='sm'
                                                            control={control}
                                                            render={({field}) => (
                                                                <Input {...field} id='config-sm-size'
                                                                       type='number'
                                                                       invalid={errors.sm && true}/>
                                                            )}
                                                        />
                                                    </Col>

                                                    <Col sm={6} lg={6}>
                                                        <Label className='form-label' for='config-md-size'>
                                                            MD Size
                                                        </Label>
                                                        <Controller
                                                            name='md'
                                                            control={control}
                                                            render={({field}) => (
                                                                <Input {...field} id='config-md-size'
                                                                       type='number'
                                                                       invalid={errors.md && true}/>
                                                            )}
                                                        />
                                                    </Col>

                                                    <Col sm={6} lg={6}>
                                                        <Label className='form-label' for='lg-size'>
                                                            LG Size
                                                        </Label>
                                                        <Controller
                                                            name='lg'
                                                            control={control}
                                                            render={({field}) => (
                                                                <Input {...field} id='config-lg-size'
                                                                       type='number'
                                                                       invalid={errors.lg && true}/>
                                                            )}
                                                        />
                                                    </Col>
                                                    <Col sm={6} lg={6} className={'mt-1'}>
                                                        <div className='form-check form-check-inline'>
                                                            <Controller
                                                                name='grow'
                                                                control={control}
                                                                render={({
                                                                             field: {
                                                                                 onChange,
                                                                                 onBlur,
                                                                                 value,
                                                                                 name,
                                                                             },
                                                                         }) => (
                                                                    <input
                                                                        onChange={onChange}
                                                                        onBlur={onBlur}
                                                                        checked={value}
                                                                        name={name}
                                                                        id='config-grow'
                                                                        type='checkbox'
                                                                    />
                                                                )}
                                                            />
                                                            <Label for='config-grow' className='form-check-label'>
                                                                Span out
                                                            </Label>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </>
                                        ) : null
                                    }
                                    {
                                        !watchComponentSelect && currentSelectedBox
                                        && (
                                            currentSelectedBox.type === 'container'
                                        ) ? (
                                            <>
                                                <Col sm={12} lg={12}>
                                                    <Label className='form-label' for='config-label'>
                                                        Label
                                                    </Label>
                                                    <Controller
                                                        name='label'
                                                        control={control}
                                                        render={({field}) => (
                                                            <Input {...field} id='config-label'
                                                                   type='text'
                                                                   placeholder={'title'}
                                                                   invalid={errors.label && true}/>
                                                        )}
                                                    />
                                                </Col>
                                            </>
                                        ) : null
                                    }

                                    {
                                        !watchComponentSelect && currentSelectedBox
                                        && (
                                            currentSelectedBox.type === 'container' || currentSelectedBox.type === 'row'
                                        ) ? (
                                            <>
                                                <Col sm={12} lg={12}>
                                                    <div className='form-check form-check-inline'>
                                                        <Input
                                                            checked={options?.hide}
                                                            id={'config-input-hide-container'}
                                                            onChange={(e) => {
                                                                const tmpInput = {...options};
                                                                tmpInput.hide = e.target.checked;
                                                                setOption({...tmpInput})
                                                            }}
                                                            type='checkbox'
                                                        />
                                                        <Label className='form-check-label' for='config-input-hide'>
                                                            Hide
                                                        </Label>
                                                    </div>
                                                </Col>
                                            </>
                                        ) : null
                                    }
                                    <div className='d-flex flex-wrap mb-5 mt-4 justify-content-end'>
                                        <Button type='submit' className='me-1' variant='primary'>
                                            Save
                                        </Button>
                                        <Button variant='outline-secondary' onClick={() => closeBoxConfig()}>
                                            Cancel
                                        </Button>
                                    </div>
                                </Form>
                            </TabPane>
                            <TabPane tabId='activeConfig'>
                                <div className={'pt-3'}>
                                    <Input type='checkbox'
                                           id={`enableActiveCode`}
                                           checked={enableActiveCode}
                                           onChange={(e) => {
                                               setEnableActiveCode(e.target.checked);
                                           }}
                                    />
                                    <Label className={'ms-1'} for={'enableActiveCode'}> Enable</Label>

                                    <Input type='textarea'
                                           name='activeCode'
                                           disabled={!enableActiveCode}
                                           id='activeCode'
                                           onChange={(e) => setActiveCode(e.target.value)}
                                           value={activeCode}
                                           ref={activeCodeRef}
                                           rows='10'
                                           placeholder='JS Expression'/>
                                </div>
                                <div className='d-flex flex-wrap mb-5 mt-4 justify-content-end'>
                                    <Button className='me-1' variant='primary' onClick={(e) => {
                                        onSaveActiveConfig();
                                    }}>
                                        Save
                                    </Button>
                                    <Button variant='outline-secondary' onClick={() => closeBoxConfig()}>
                                        Cancel
                                    </Button>
                                </div>
                            </TabPane>
                            <TabPane tabId='allowConfig'>
                                <div className={'pt-3'}>
                                    <Input type='checkbox'
                                           id={`enableAllowConfig`}
                                           checked={enableAllowCode}

                                           onChange={(e) => {
                                               setEnableAllowCode(e.target.checked);
                                           }}
                                    />
                                    <Label className={'ms-1'} for={'enableAllowConfig'}> Enable</Label>

                                    <Input type='textarea'
                                           name='allowCode'
                                           disabled={!enableAllowCode}
                                           id='allowCode'
                                           onChange={(e) => setAllowCode(e.target.value)}
                                           value={allowCode}
                                           ref={allowCodeRef}
                                           rows='10'
                                           placeholder='JS Expression'/>
                                </div>
                                <div className='d-flex flex-wrap mb-5 mt-4 justify-content-end'>
                                    <Button className='me-1' variant='primary' onClick={(e) => {
                                        onSaveAllowConfig();
                                    }}>
                                        Save
                                    </Button>
                                    <Button variant='outline-secondary' onClick={() => closeBoxConfig()}>
                                        Cancel
                                    </Button>
                                </div>
                            </TabPane>
                        </TabContent>

                    </div>


                </>


            </Offcanvas.Body>
        </Offcanvas>
    )
}

export default BoxConfigCanvas
