// ** React Imports
import {Fragment, useEffect, useRef, useState} from 'react'
// ** Reactstrap Imports
import {Input, Label} from 'reactstrap'
import {FORM_MODE} from "../../libs/util";
import {BaseGenerateInputInterface} from "../classes/generate-input.interface";

const InputNumber = (args: BaseGenerateInputInterface) => {
    const {
        inputValue,
        requireInput,
        onChange,
        customStyle,
        formSlug,
        children,
        mode,
        config,
        layoutComponent,
    } = args;
    // ** State
    const [isFocus, setFocus] = useState(false)
    const [focusNumberInput, setFocusNumberInput] = useState(false)
    const inputRef = useRef(null)
    const [currentVal, setCurrentVal] = useState(inputValue);
    const [showVal, setShowVal] = useState('0');
    useEffect(() => {
    }, [inputRef.current])

    useEffect(() => {
        let f = parseFloat(currentVal)
        if (isNaN(f)) {
            f = 0;
        }
        setShowVal(f.toLocaleString('en'));
    }, [currentVal])
    return (
        <>
            <div onMouseEnter={ () => {
                setFocus(true)
            }} >
                <Input type={'text'} id={`${formSlug}-${layoutComponent.slug}-text`}
                       className={` ${(isFocus ? 'd-none' : '')}`}
                       style={customStyle}
                       placeholder={config.placeholder ?? ''}
                       readOnly={config.options?.readonly || mode === FORM_MODE.READONLY}
                       invalid={requireInput != null}
                       value={showVal}
                />
            </div>

                <Input className={`${isFocus ? '' :'d-none'}`} type={'number'}
                       onMouseLeave={() => {
                           if(!focusNumberInput){
                               setFocus(false)
                               setFocusNumberInput(false)
                           }
                       }}
                       id={`${formSlug}-${layoutComponent.slug}`}
                       ref={inputRef}
                       style={customStyle}
                       placeholder={config.placeholder}
                       readOnly={config.options?.readonly || mode === FORM_MODE.READONLY}
                       invalid={requireInput !== ''}
                       defaultValue={inputValue}
                       onBlur={() => {
                           setFocus(false)
                           setFocusNumberInput(false)
                       }}
                       onFocus={ () => {
                           setFocusNumberInput(true)
                       }}
                       onChange={(e) => {
                           let f = parseFloat(e.target.value)
                           if (isNaN(f)) {
                               f = 0;
                           }
                           setCurrentVal(f)
                           onChange(e, f);
                       }}/>
        </>
    )
}

export default InputNumber
