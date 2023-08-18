// ** React Imports
import {useCallback, useEffect, useRef, useState} from 'react'
import {useForm, Controller} from "react-hook-form";
import toast from "react-hot-toast";
import {Button, Col, Form, Offcanvas, Row} from "react-bootstrap";
import {Info, X} from "react-feather";
import Select from "react-select";
// import InputConfig from "./configs/InputConfig";
import {Input, Label, NavItem, Nav, NavLink, TabContent, TabPane} from "reactstrap";
import TextConfig, {ITextConfig} from "../../../../../../hype/share-components/TextConfig";
import useBoundStore from "../../../../../../stores";
import {LayoutComponentInterface} from "../../../../../../hype/classes/generate-input.interface";
import InputConfig, {IInputConfigOption} from "../../../../form/editor/tabs/tab-form-layout/configs/InputConfig";
import RadioConfig, {IRadioConfigOption} from "../../../../form/editor/tabs/tab-form-layout/configs/RadioConfig";
import DatatableFormConfig from "./configs/DatatableFormConfig";

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

interface IAppBoxConfig {
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
    const closeBoxConfig = useBoundStore(state => state.appEditor.closeBoxConfig);
    const updateBox = useBoundStore(state => state.appEditor.updateBox);
    const createBox = useBoundStore(state => state.appEditor.createBox);
    const removeBox = useBoundStore(state => state.appEditor.removeBox);
    const layoutItemList = useBoundStore(state =>
        state.appEditor.layoutItemList
    );
    const currentSelectedBox = useBoundStore(state =>
        state.appEditor.currentSelectedBox
    );
    const boxConfigFormAction = useBoundStore(state =>
        state.appEditor.boxConfigFormAction
    );
    const [enableActiveCode, setEnableActiveCode] = useState(false);
    const [activeCode, setActiveCode] = useState('');
    const [enableAllowCode, setEnableAllowCode] = useState(false);
    const [allowCode, setAllowCode] = useState('');
    const activeCodeRef = useRef<Input>(null);
    const allowCodeRef = useRef<Input>(null);
    const {
        // setError,
        watch,
        setValue,
        control,
        setError,
        handleSubmit,
        formState: {errors}
    } = useForm<IAppBoxConfig>()
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

    const [options, setOption] = useState<any>(null);

    function onSubmit(data: any) {
        data.options = {...options};
        if (data.component === null && currentSelectedBox != null
            && currentSelectedBox.type !== 'row'
            && currentSelectedBox.type !== 'col'
            && currentSelectedBox.type !== 'container'
        ) {
            setError('component', {type: 'custom', message: 'Please select component'})
            return;
        }

        switch (boxConfigFormAction) {
            case 'edit':
                if(currentSelectedBox != null){
                    updateBox(
                        currentSelectedBox.id,
                        {
                            config: {
                                ...data,
                                activeCode,
                                enableActiveCode
                            },
                        });
                }

                break;
            case 'new':
                if(currentSelectedBox == null) {
                    alert('[Unknown Error] currentSelectedBox is null')
                    return;
                }
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
        toast.success('Save Active options Success.')
    };
    const onSaveAllowConfig = () => {
        toast.success('Save allowCode options Success.')
    };

    function generateOptions() {
        const options: LayoutComponentInterface[] = [
            {
                layoutType: 'decorator',
                type: 'label',
                slug: '',
                value: 'label',
                label: 'Label'
            },
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
            }, {
                layoutType: 'utility',
                type: 'datatable-form',
                slug: '',
                value: 'utility',
                label: 'DataTable (Form)'
            },
        ];
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
                    {currentSelectedBox?.id}
                    <div className={'d-flex'}>
                        <a href={"https://hype-docs-e0110.web.app/form#%E0%B8%AA%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B8%AD%E0%B8%A1%E0%B9%82%E0%B8%9E%E0%B9%80%E0%B8%99%E0%B9%89%E0%B8%99%E0%B9%83%E0%B8%99-layout"}
                           style={{}} target={"_blank"} rel="noreferrer"><Info/>
                        </a>
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
                                                                        options={generateOptions()}
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
                                                                            placeholder={'slug this input'}
                                                                        />
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
                                                                    <TextConfig change={(value: ITextConfig) => {
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
                                            <InputConfig options={options} onChange={(e: IInputConfigOption) => {
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
                                                <RadioConfig options={options} onChange={(updatedOption: IRadioConfigOption) => {
                                                    console.log('RadioConfig', updatedOption);
                                                    setOption(updatedOption)
                                                }}/>
                                            ) : null
                                    }


                                    {
                                        watchComponentSelect && (watchComponentSelect.type === 'datatable-form') ? (
                                            <DatatableFormConfig options={options}
                                                                 onChange={(e: any) => {
                                                                     console.log('DatatableFormConfig', e);
                                                                     setOption({...options, ...e})
                                                                 }}/>
                                        ) : null
                                    }

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
                                    <Button className='me-1' variant='primary' onClick={() => {
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
                                    <Button className='me-1' variant='primary' onClick={() => {
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
