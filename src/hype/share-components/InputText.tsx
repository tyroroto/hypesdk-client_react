// ** React Imports
import {useEffect, useRef, useState} from 'react'
// ** Reactstrap Imports
import {Input} from 'reactstrap'
import {FORM_MODE} from "../../libs/util";
import {BaseGenerateInputInterface} from "../classes/generate-input.interface";

const InputText = (args: BaseGenerateInputInterface) => {
    const {
        inputValue,
        onChange,
        customStyle,
        formSlug,
        mode,
        config,
        layoutComponent,
    } = args;
    // ** State
    const inputRef = useRef(null)
    useEffect(() => {
    }, [inputRef.current])

    return (
        <>
            <Input
                className={'shadow-hover'}
                onChange={(e) => {
                    onChange('onChange', e.target.value);
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
