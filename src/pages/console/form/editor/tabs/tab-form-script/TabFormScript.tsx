import {Button, Nav, NavItem, NavLink} from "reactstrap";
import {Card, Col, Row} from "react-bootstrap";
import {useCallback, useEffect, useState} from "react";
import useBoundStore from "../../../../../../stores";
import {FormEditorSlice} from "../../../../../../stores/formEditorSlice";
import {updateFormScript} from "../../../../../../libs/axios";
import toast from "react-hot-toast";
import Select from "react-select";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";


const TabFormScript = () => {
    const formEditorStore = useBoundStore<FormEditorSlice>(state => state.formEditor)
    const [onSubmitCode, setOnSubmitCode] = useState('');
    const [validateCode, setValidateCode] = useState('');
    const [currentTab, setCurrentTab] = useState<'validate' | 'onsubmit'>('validate');
    const [editorLanguage, setEditorLanguage] = useState('javascript');
    const options = [
        {
            label: 'Javascript',
            value: 'javascript'
        },
    ];
    useEffect(() => {
        if (formEditorStore.formData != null) {
            try {
                const {onSubmit, validate} = formEditorStore.formData.scripts
                setOnSubmitCode(onSubmit);
                setValidateCode(validate);
            } catch (e) {
                console.error('something error on parse script')
            }

        }
    }, [formEditorStore.formData?.scripts])
    const handleSaveScript = useCallback(async () => {
        if (formEditorStore.formData?.id != null) {
            await toast.promise(
                updateFormScript(formEditorStore.formData.id, {
                    scripts:
                        {
                            validate: validateCode,
                            onSubmit: onSubmitCode,
                        }
                })
                ,
                {
                    loading: 'Saving...',
                    success: <b>Form saved!</b>,
                    error: <b>Could not save.</b>,
                },
                {
                    position: "top-right"
                }
            )
        }
    }, [toast, formEditorStore.formData, validateCode, onSubmitCode])

    function handleOnSubmitEditorChange(
        value: string | undefined,
        _ev: monaco.editor.IModelContentChangedEvent,
    ) {
        setOnSubmitCode(value ?? '');
    }

    function handleValidateEditorChange(
        value: string | undefined,
        _ev: monaco.editor.IModelContentChangedEvent,
    ) {
        setValidateCode(value ?? '');
    }

    return <>
        <div className={'d-flex gap-3'}>
            <div>
                <Nav pills vertical>
                    <NavItem>
                        <NavLink active={currentTab == 'validate'} type={'button'}
                                 onClick={e => {
                                     setCurrentTab('validate')
                                 }}
                        >Validate </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink active={currentTab == 'onsubmit'} type={'button'}
                                 onClick={e => {
                                     setCurrentTab('onsubmit')
                                 }}
                        >OnSubmit
                        </NavLink>
                    </NavItem>
                </Nav>
            </div>
            <div className={'flex-grow-1'}>
                {
                    currentTab == 'validate' ?
                        <>
                            <div style={{
                                backgroundColor: 'black',
                                borderBottom: '1px solid white',
                                padding: 4,
                                paddingBottom: 8,
                            }}>
                                <Row>
                                    <Col xs={4}>
                                        <label className={'text-white'}>Language</label>
                                        <Select
                                            isDisabled={true}
                                            defaultValue={options[0]}
                                            onChange={(newValue) => {
                                                if (newValue != null) {
                                                    setEditorLanguage(newValue.value);
                                                }
                                            }}
                                            options={options}/>
                                    </Col>
                                </Row>
                            </div>
                            <Editor
                                height="60vh"
                                theme="vs-dark"
                                options={{fontSize: 14}}
                                defaultLanguage={editorLanguage}
                                defaultValue={validateCode}
                                // onMount={handleEditorDidMount}
                                onChange={handleValidateEditorChange}
                            />
                        </>
                        : null
                }
                {
                    currentTab == 'onsubmit' ?
                        <>
                            <div style={{
                                backgroundColor: 'black',
                                borderBottom: '1px solid white',
                                padding: 4,
                                paddingBottom: 8,
                            }}>
                                <Row>
                                    <Col xs={4}>
                                        <label className={'text-white'}>Language</label>
                                        <Select
                                            isDisabled={true}
                                            defaultValue={options[0]}
                                            onChange={(newValue) => {
                                                if (newValue != null) {
                                                    setEditorLanguage(newValue.value);
                                                }
                                            }}
                                            options={options}/>
                                    </Col>
                                </Row>
                            </div>
                            <Editor
                                height="60vh"
                                theme="vs-dark"
                                options={{fontSize: 14}}
                                defaultLanguage={editorLanguage}
                                defaultValue={onSubmitCode}
                                onChange={handleOnSubmitEditorChange}
                            />
                        </>
                        : null
                }

            </div>
            <Card style={{width: 260}}>
                <Card.Body>
                    <Button className={'w-100 mb-1'} color={'primary'} onClick={() => {
                        handleSaveScript().catch(e => console.error(e, 'handleSaveForm'));
                    }}> Save </Button>

                </Card.Body>
            </Card>
        </div>

    </>

}

export default TabFormScript;