import { Col, Input, Label, Row} from "reactstrap";
import {Controller, useForm} from "react-hook-form";
import Select from "react-select";
import {useEffect} from "react";

export interface IInputConfigOption {
    placeholder: string;
    defaultValue: string;
    description: string;
    required: boolean;
    masking?: string;
    hide?: boolean;
    readonly?: boolean;
}
const InputConfig = (props: {options: IInputConfigOption, onChange: (arg: IInputConfigOption) => void}) => {
    const {
        control,
    } = useForm({
        defaultValues: {
            placeholder: props.options?.placeholder,
            defaultValue: props.options?.defaultValue,
            description: props.options?.description
        }
    })

    useEffect(()=>{
        console.log(props.options)
    }, [])

    return (
        <Row>
            <Col sm={12} lg={12}>
                <Label className='form-label' for='config-placeholder'>
                    Placeholder
                </Label>
                <Controller
                    name='placeholder'
                    control={control}
                    render={({field}) => (
                        <Input {...field}
                               id='config-placeholder'
                               placeholder={'Placeholder'}
                               onChange={(e) => {
                                   props.onChange({...props.options, placeholder: e.target.value});
                                   field.onChange(e)
                               }}

                        />
                    )}
                />
            </Col>
            <Col sm={12} lg={12} className={'zindex-0'}>
                <Label className='form-label'>
                    Options Input
                </Label>
                {/*<TextConfig change={(e) => {*/}
                {/*    const tempOption = {...options};*/}
                {/*    tempOption.configInput = e;*/}
                {/*    onChange(tempOption);*/}
                {/*}} value={options?.configInput}/>*/}
            </Col>
            <Col sm={12} lg={12}>
                <Label className='form-label' for='config-defaultValue'>
                    Default Value
                </Label>
                <Controller
                    name='defaultValue'
                    control={control}
                    render={({field}) => (
                        <Input {...field}
                               id='config-defaultValue'
                               type='text'
                               placeholder={'Default Value'}
                               onChange={(e) => {
                                   props.onChange({...props.options, defaultValue: e.target.value});
                                   field.onChange(e)
                                }
                               }
                        />
                    )}
                />
            </Col>

            <Col sm={12} lg={12} className={'mt-1'}>
                <Row className={'mb-1'}>
                    <Col sm={6} lg={6}>
                        <Label className='form-label' for='config-input-masking'>
                            Masking
                        </Label>
                        <Select
                            isClearable={true}
                            onChange={(e) => {
                                const tmpInput = {...props.options};
                                if (e == null) {
                                    tmpInput.masking = undefined;
                                }else{
                                    tmpInput.masking = e.value;
                                }
                                props.onChange({...tmpInput})
                            }}
                            options={[
                                {
                                    label: 'currency',
                                    value: 'currency',
                                }, {
                                    label: 'tel',
                                    value: 'tel',
                                }
                            ]}
                            className='react-select'
                            classNamePrefix='select'
                            placeholder={'none mask'}
                        />

                    </Col>
                </Row>
                <Row>
                    <Col sm={6} lg={6}>
                        <div className='form-check form-check-inline'>
                            <Input
                                checked={props.options?.required}
                                id={'config-input-required'}
                                onChange={(e) => {
                                    const tmpInput = {...props.options};
                                    tmpInput.required = e.target.checked;
                                    props.onChange({...tmpInput})
                                }}
                                type='checkbox'
                            />
                            <Label className='form-check-label' for='config-input-required'>
                                Required
                            </Label>
                        </div>
                    </Col>

                    <Col sm={6} lg={6}>
                        <div className='form-check form-check-inline'>
                            <Input
                                checked={props.options?.hide}
                                id={'config-input-hide'}
                                onChange={(e) => {
                                    const tmpInput = {...props.options};
                                    tmpInput.hide = e.target.checked;
                                    props.onChange({...tmpInput})
                                }}
                                type='checkbox'
                            />
                            <Label className='form-check-label' for='config-input-hide'>
                                Hide
                            </Label>
                        </div>
                    </Col>
                    <Col sm={6} lg={6}>
                        <div className='form-check form-check-inline'>
                            <Input
                                checked={props.options?.readonly}
                                id={'config-input-readonly'}
                                onChange={(e) => {
                                    const tmpInput = {...props.options};
                                    tmpInput.readonly = e.target.checked;
                                    props.onChange({...tmpInput})
                                }}
                                type='checkbox'
                            />
                            <Label className='form-check-label' for='config-input-readonly'>
                                Readonly
                            </Label>
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default InputConfig;
