import {Button, Col, Input, InputGroup, Label, Row} from "reactstrap";
import {Controller, useForm} from "react-hook-form";
import {useCallback, useEffect, useState} from "react";
import {Trash2} from "react-feather";

export interface IRadioConfigOption {
    placeholder?: string;
    defaultValue?: string;
    description?: string;
    required?: boolean;
    hide?: boolean;
    inline?: 'vertical' | 'horizontal';
    readonly?: boolean;
    radioOptions?: Array<{
        label: string,
        value: string
    }>,
}
const RadioConfig = (props: {
    options: IRadioConfigOption, onChange: (updatedOption: IRadioConfigOption) => void
}) => {

    const [radioOptions, setRadioOptions] = useState(props.options?.radioOptions ?? [])
    const {
        control,
    } = useForm({
        defaultValues: {
            placeholder: props.options?.placeholder,
            defaultValue: props.options?.defaultValue,
            description: props.options?.description
        }
    })

    useEffect(() => {
        console.log(props.options)
    }, [])

    const addRadioOption = useCallback(() => {
        const tmpOptions = {...props.options};
        const tmpRadioOption = [...radioOptions];
        tmpRadioOption.push({
            label: `Text${tmpRadioOption.length + 1}`,
            value: (tmpRadioOption.length + 1).toString()
        });
        tmpOptions.radioOptions = tmpRadioOption;
        setRadioOptions(tmpRadioOption);
        props.onChange({...tmpOptions})
    }, [props.options, props.onChange])

    const updateRadioOption = useCallback((index: number, label: string, value: string) => {
        const tmpOptions = {...props.options};
        const tmpRadioOption = [...radioOptions];
        tmpRadioOption[index] = {label, value};
        tmpOptions.radioOptions = tmpRadioOption;
        props.onChange({...tmpOptions})
    }, [props.options, props.onChange])

    const removeSelectOption = useCallback((index: number) => {
        const tmpOptions = {...props.options};
        const temp = [...radioOptions];
        if (index > -1) {
            temp.splice(index, 1);
        }
        tmpOptions.radioOptions = temp
        props.onChange({...tmpOptions})
        setRadioOptions(temp)
    }, [radioOptions, props.onChange])

    return (
        <Row>
            <Col sm={12} lg={12}>
                <h5 className='form-label'>
                    Options Input
                </h5>
            </Col>
            <Col>
                {radioOptions ? (
                        radioOptions.map((option: { label: string, value: string }, i) => (
                            <Row key={i} i={i}>
                                <Col className='mb-1' md='12' sm='12'>
                                    <InputGroup>
                                        <Input type='text' placeholder='Label'
                                               defaultValue={option.label}
                                               onChange={(e) => updateRadioOption(i, e.target.value, option.value)}
                                        />
                                        <Input
                                            type={'text'} placeholder='Value'
                                            defaultValue={option.value}
                                            onChange={(e) => updateRadioOption(i, option.label, e.target.value)}
                                        />
                                        <Button color='danger' outline onClick={() => {
                                            removeSelectOption(i);
                                        }}>
                                            <Trash2 size={20}/>
                                        </Button>
                                    </InputGroup>
                                </Col>
                            </Row>
                        ))
                    )
                    : null
                }
                <Row>
                    <Col md='12' sm='12'>
                        <Button onClick={() => {
                            addRadioOption();
                        }} size={'sm'} type='button' className='ms-auto mb-2 float-end'
                                color='primary'>
                            Add
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col md='8' sm='12'>
                        <div className='demo-inline-spacing'>
                            <div className='form-check mt-0 mb-0'>
                                <Input type='radio' name='option_line'
                                       onClick={() => {
                                           props.onChange({...props.options, inline: 'horizontal'});
                                       }} value={'horizontal'}
                                       id='radio-horizontal-config'
                                       defaultChecked={props.options && props.options.inline && props.options.inline === 'horizontal'}/>
                                <Label className='form-check-label'
                                       for={'radio-horizontal-config'}>
                                    Horizontal
                                </Label>
                            </div>
                            <div className='form-check mt-0 mb-0'>
                                <Input type='radio' name='option_line'
                                       onClick={() => {
                                           props.onChange({...props.options, inline: 'vertical'});
                                       }} value={'vertical'}
                                       id='radio-vertical-config'
                                       defaultChecked={props.options && props.options.inline && props.options.inline === 'vertical'}/>
                                <Label className='form-check-label'
                                       for={'radio-vertical-config'}>
                                    Vertical
                                </Label>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Col>
            <Col sm={12} lg={12}>
                <Label className='form-label' for='config-placeholder'>
                    Placeholder (only for select)
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

export default RadioConfig;
