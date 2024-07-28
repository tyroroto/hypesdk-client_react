import {Input, Label} from "reactstrap";
import {Thai} from "flatpickr/dist/l10n/th.js"
import Flatpickr from "react-flatpickr";
import {ChangeEvent, Fragment, useCallback} from "react";
import {DateTime} from "luxon";
import {FORM_MODE} from "../../libs/util";
import InputNumber from "../share-components/InputNumber";
import Select from "react-select";
import InputText from "../share-components/InputText";
import {LayoutComponentInterface} from "../classes/generate-input.interface";
import FileUploader from "../share-components/FileUploader";

const GenerateFormComponentElem = (props: {
    mode: string,
    recordId?: number,
    formSlug: string,
    formComponent: any,
    layoutComponent: LayoutComponentInterface,
    config: any,
    inputValue?: any,
    defaultValue?: any,
    forceSave?: (arg: any)=>void,
    expression?: {[key: string] : string},
    requireInput?: string,
    onChange: (event: any, value: any) => any,
    onAction: (event: string, value: any) => any
}) => {

    const {
        layoutComponent, mode, config, recordId, formSlug, formComponent, inputValue, requireInput,
        onChange
    } = props
    const parseWithExpression = useCallback((text: string) => {
        if(text == null){
            return ''
        }
        let tempText = text;
        const scriptListKey = text.match(/({)([A-Za-z0-9]{0,300})(})/g);
        const scriptListFunc = scriptListKey ? [...scriptListKey] : [];
        for (const i in scriptListFunc) {
            scriptListFunc[i] = scriptListFunc[i].replace('{', '');
            scriptListFunc[i] = scriptListFunc[i].replace('}', '');
        }

        for (const expKey of scriptListFunc) {
            if (props.expression != null && props.expression[expKey] != null) {
                tempText = tempText.replace(`{${expKey}}`, props.expression[expKey]);
            }
        }
        return tempText;
    }, [props.expression, props.config])

    const mapCss = useCallback((option: any, css?: any, type = '', ignore: Array<string> = []) => {
        const style = css ? css : {};
        if (option?.align && (option?.align === 'center' || option?.align === 'right')) {
            if (type !== 'button') {
                style.width = '100%';
            }
            style.textAlign = option.align;
        }
        if(ignore.indexOf('fontSize') == -1){
            if (option?.fontSize) {
                style.fontSize = parseInt(option.fontSize);
            } else {
                style.fontSize = 16;
            }
        }

        if (option?.bold) {
            style.fontWeight = 'bold';
        }
        if (option?.italic) {
            style.fontStyle = 'italic';
        }
        if (option?.underline) {
            style.textDecoration = 'underline';
        }
        return style;
    }, [])

    const renderFunc = useCallback(() => {
        switch (layoutComponent.type) {
            case 'label':
                return (
                    <div className={(mode === 'NORMAL' || mode === 'READONLY') && config.options?.hide ? 'd-none' : ''}
                         id={`div-${formSlug}-${layoutComponent.slug}`}>
                        {
                            config.options.configLabel?.tag == 'h1' ?
                                <h1 id={config.id}
                                    style={mapCss(config.options?.configLabel, {}, '', ['fontSize'])}
                                >
                                    {parseWithExpression(config.label)}
                                </h1>
                                :null
                        }
                        {
                            config.options.configLabel?.tag == 'h2' ?
                                <h2 id={config.id}
                                    style={mapCss(config.options?.configLabel, {}, '', ['fontSize'])}
                                >
                                    {parseWithExpression(config.label)}
                                </h2>
                                :null
                        }
                        {
                            config.options.configLabel?.tag == 'h3' ?
                                <h3 id={config.id}
                                    style={mapCss(config.options?.configLabel, {}, '', ['fontSize'])}
                                >
                                    {parseWithExpression(config.label)}
                                </h3>
                                :null
                        }
                        {
                            config.options.configLabel?.tag == 'h4' ?
                                <h4 id={config.id}
                                    style={mapCss(config.options?.configLabel, {}, '', ['fontSize'])}
                                >
                                    {parseWithExpression(config.label)}
                                </h4>
                                :null
                        }
                        {
                            config.options.configLabel?.tag == 'h5' ?
                                <h5 id={config.id}
                                    style={mapCss(config.options?.configLabel, {}, '', ['fontSize'])}
                                >
                                    {parseWithExpression(config.label)}
                                </h5>
                                :null
                        }
                        {
                            config.options.configLabel?.tag == 'h6' ?
                                <h6 id={config.id}
                                    style={mapCss(config.options?.configLabel, {}, '', ['fontSize'])}
                                >
                                    {parseWithExpression(config.label)}
                                </h6>
                                :null
                        }
                        {
                          config.options.configLabel?.tag == 'div' ?
                                <label id={config.id}
                                       style={mapCss(config.options?.configLabel)}>{parseWithExpression(config.label)}</label>
                                :null
                        }

                        {
                            config.options.configLabel == null ?
                                <label id={config.id}
                                      >{parseWithExpression(config.label)}
                                </label>
                                :null
                        }
                    </div>
                )
            case 'divider':
                return (
                    <div className='divider '>
                        {config.label ? (<div className='divider-text'>{config.label}</div>) : (<hr/>)}
                    </div>
                )
            case 'text-input':
                return (
                    <>
                        <InputText inputValue={inputValue} requireInput={requireInput} onChange={
                            onChange
                        } customStyle={mapCss(config.options?.configInput)} formSlug={formSlug}
                                   mode={mode} config={config} layoutComponent={layoutComponent}
                        />

                    </>
                )
            case 'text-area':
                return (
                    <>
                        <div className='form-label mb-0'>
                            <Input
                                className={'shadow-hover'}
                                name='text'
                                type='textarea'
                                id={`${formSlug}-${layoutComponent.slug}`}
                                placeholder={config.placeholder}
                                readOnly={config.options?.readonly || mode === FORM_MODE.READONLY}
                                invalid={requireInput != null && requireInput !== ''}
                                defaultValue={inputValue}
                                onChange={(e) => {
                                    onChange('onChange', e.target.value)
                                }}
                            />
                        </div>
                    </>
                )
            case 'float-input':
            case 'number-input':
                return (
                    <>
                        <InputNumber
                            formSlug={formSlug}
                            onChange={onChange}
                            requireInput={requireInput}
                            inputValue={inputValue}
                            mode={mode}
                            layoutComponent={layoutComponent}
                            config={config}
                            customStyle={mapCss(config.options?.configLabel)}
                        />
                    </>
                )
            case 'radio':
                return (
                    <>
                        <div
                            className='shadow-hover'>
                            {config.options && config.options.input ? (
                                    config.options.radioOptions.map((r: { label: string, value: any }, i: number) => {
                                            return (
                                                <div
                                                    className={`${config.options.inline === 'horizontal' ? 'form-check-inline' : ''} form-check  mt-0 mb-0`}
                                                    key={i}>
                                                    <Input type='radio'
                                                           id={`${formSlug}-${layoutComponent.slug}-${i}`}
                                                           name={`name-${layoutComponent.slug}`}
                                                           disabled={config.options?.readonly || mode === FORM_MODE.READONLY}
                                                           invalid={ requireInput != null && requireInput !== ''}
                                                           onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                               onChange(e, e.target.value)
                                                           }}
                                                           value={r.value}
                                                           defaultChecked={r.value == inputValue}
                                                    />
                                                    <Label className='form-check-label'
                                                           for={`${formSlug}-${layoutComponent.slug}-${i}`}>
                                                        {r.label}
                                                    </Label>

                                                </div>
                                            )
                                        }
                                    )
                                )
                                : null
                            }
                        </div>
                    </>
                )
            case 'select':
                return (
                    <>
                        <Select
                            id={`${formSlug}-${layoutComponent.slug}`}
                            isClearable={false}
                            options={config.options.radioOptions}
                            className={requireInput !== '' ? 'react-select is-invalid shadow-hover' : 'react-select shadow-hover'}
                            classNamePrefix='select_form'
                            isDisabled={config.options?.readonly || mode === FORM_MODE.READONLY}
                            defaultValue={config.options.radioOptions?.filter((item: { value: string }) => parseInt(item.value) === parseInt(inputValue))}
                            onChange={e => {
                                onChange(e, e.value);
                            }}
                        />
                    </>
                )
            case 'file-upload':
                return (
                    <>
                        <FileUploader
                            inputValue={inputValue}
                            onChange={(e, val) => {
                                onChange(e, val);
                            }}
                        />
                    </>
                )
            case 'checkbox':
                return (
                    <>
                        <div className='form-label mb-0 mt-2'>
                            <Input type='checkbox'
                                   className={'shadow-hover'}
                                   onChange={(e) => {
                                       onChange(e, e.target.checked)
                                   }}
                                   disabled={config.options?.readonly || mode === FORM_MODE.READONLY}
                                   invalid={requireInput != null && requireInput !== ''}
                                   id={`${formSlug}-${layoutComponent.slug}`}
                                   checked={inputValue == 1 || inputValue}
                            />
                            <Label className='form-label ms-1' for={`${formSlug}-${layoutComponent.slug}`}
                                   style={mapCss(config.options?.configLabel)}>
                                {config.options?.required ? (<label className={'text-danger'}>*</label>) : null}
                                <label style={{marginRight: 5}}>{config.label ?? 'No Title'}</label>
                                {layoutComponent.slug && mode === 'EDITOR' ?
                                    <code style={{marginRight: 5}}>[{layoutComponent.slug}]</code> : null}
                                {
                                    mode === 'EDITOR' && config.options?.hide ? (
                                        <label className='text-danger ml-2'>(This Component is Hide)</label>
                                    ) : null
                                }
                            </Label>
                        </div>
                    </>
                )
            case 'date':
                return (
                    <>
                        <div className={(requireInput !== '' ? 'border-danger' : '')}
                        >
                            <Flatpickr
                                className={(config.options?.readonly || mode === FORM_MODE.READONLY ? 'disable-input' : '')}
                                // data-enable-time
                                placeholder={config.placeholder}
                                disabled={config.options?.readonly || mode === FORM_MODE.READONLY}
                                onChange={(e) => {
                                    const date = DateTime.fromJSDate(e[0]).toFormat('yyyy-LL-dd');
                                    onChange(e, date);
                                }}
                                defaultValue={inputValue}
                                options={{
                                    altInput: true,
                                    altFormat: 'F j, Y',
                                    dateFormat: 'Y-m-d',
                                    locale: Thai,
                                    // style: {
                                    //     backgroundColor: '#f2f2f2'
                                    // }
                                }}
                                // value={inputValue}
                                id={`${formSlug}-${layoutComponent.slug}`}/>
                        </div>
                    </>
                )
            case 'datetime':
                return (
                    <>
                        <div className={requireInput !== '' ? 'border-danger' : ''}>
                            <Flatpickr
                                className={`form-control ${config.options?.readonly || mode === FORM_MODE.READONLY ? 'disable-input' : ''}`}
                                data-enable-time
                                id={`${formSlug}-${layoutComponent.slug}`}
                                placeholder={config.placeholder}
                                disabled={config.options?.readonly || mode === FORM_MODE.READONLY}
                                defaultValue={inputValue}
                                options={{
                                    altInput: true,
                                    // altFormat: 'F j, Y',
                                    // dateFormat: 'YYYY-MM-DD HH:MM'
                                }}
                                onChange={(e) => {
                                    const date = DateTime.fromJSDate(e[0]).toFormat('yyyy-LL-dd hh:mm:ss');
                                    // const date = DateTime.fromJSDate(e[0]).toFormat('yyyy-LL-dd');
                                    onChange(e, date);
                                }}
                            />
                        </div>
                    </>
                )
            case 'time':
                return (
                    <>
                        <Fragment>
                            <div className={requireInput !== '' ? 'border-danger' : ''}>
                                <Flatpickr
                                    className='form-control'
                                    id={`${formSlug}-${layoutComponent.slug}`}
                                    placeholder={config.placeholder}
                                    disabled={config.options?.readonly || mode === FORM_MODE.READONLY}
                                    options={{
                                        enableTime: true,
                                        noCalendar: true,
                                        dateFormat: 'H:i',
                                        time_24hr: true
                                    }}
                                    value={inputValue}
                                    onChange={(e) => {
                                        // eslint-disable-next-line no-useless-concat
                                        const time = DateTime.fromJSDate(e[0]).toFormat('hh:mm' + ':00');
                                        onChange(e, time);
                                    }}
                                />
                            </div>
                        </Fragment>
                    </>
                )
            default:
                return <div><h3> Not found component [{layoutComponent.type}]</h3></div>
        }
    }, [layoutComponent, recordId, config, requireInput, mode, formComponent, onChange, formSlug, config, layoutComponent, parseWithExpression])
    return <>
        {
            formComponent?.deletedAt != null ?
                <h4 className={'text-danger'}>---- Component is deleted ----</h4>
                : null
        }
        <div
            className={(mode === 'NORMAL' || mode === 'READONLY') && config.options?.hide ? 'd-none' : ''}
            id={`div-${formSlug}-${layoutComponent.slug}`}>
            {
                layoutComponent.type != 'label' &&
                layoutComponent.type != 'divider' &&
                layoutComponent.type != 'checkbox' &&
                <Label className='form-label' for={`${formSlug}-${layoutComponent.slug}`}
                       style={mapCss(config.options?.configLabel)}>
                    {config.options?.required ? (<label className={'text-danger'}>*</label>) : null}
                    <label style={{marginRight: 5}}>{config.label ?? 'No Title'}</label>
                    {layoutComponent.slug && mode === 'EDITOR' ?
                        <code style={{marginRight: 5}}>[{layoutComponent.slug}]</code> : null}
                    {
                        mode === 'EDITOR' && config.options?.hide ? (
                            <label className='text-danger ml-2'>(This Component is Hide)</label>
                        ) : null
                    }
                    {requireInput != null ? '*' : ''}
                </Label>
            }

            {renderFunc()}
            {requireInput !== '' &&
                <label className={'text-danger full-width'}>{requireInput}</label>}
            {
                config.description ? (
                    <small className='text-muted'>{config.description}</small>
                ) : null
            }
        </div>
    </>
}
export default GenerateFormComponentElem;
