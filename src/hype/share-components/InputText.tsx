// ** React Imports
import {Fragment, useEffect, useRef, useState} from 'react'
// ** Reactstrap Imports
import {Input, Label} from 'reactstrap'
import {FORM_MODE} from "../../libs/util";
import {BaseGenerateInputInterface} from "../classes/generate-input.interface";

const InputText = (args: BaseGenerateInputInterface) => {
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
    const inputRef = useRef(null)
    const [currentVal, setCurrentVal] = useState(0);
    const [showVal, setShowVal] = useState('0');
    useEffect(() => {
    }, [inputRef.current])

    return (
        <>
            <Input
                className={'shadow-hover'}
                onChange={(e) => {
                    onChange(e, e.target.value);
                }}
                type='text'
                id={`${formSlug}-${layoutComponent.slug}`}
                placeholder={config.placeholder}
                readOnly={config.options?.readonly || mode === FORM_MODE.READONLY}
                style={customStyle}
                defaultValue={inputValue}
            />
        </>
    )
}

export default InputText
