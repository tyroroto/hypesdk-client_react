import {useEffect, useState} from "react";
import {FormEditorSlice} from "../../../../../../stores/formEditorSlice";
import useBoundStore from "../../../../../../stores";
import {Button, Container, Nav, NavItem, NavLink} from "reactstrap";
import {Card, Col, Form, Row} from "react-bootstrap";
import Select from "react-select";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";

const LayoutScriptEditor = () => {
    const formEditorStore = useBoundStore<FormEditorSlice>(state => state.formEditor)
    const [currentTab, setCurrentTab] = useState<'onLoaded' | 'onAction'>('onLoaded');
    const [editorLanguage, setEditorLanguage] = useState('javascript');
    const options = [
        {
            label: 'Javascript',
            value: 'javascript'
        },
    ];

    // useEffect(() => {
    //     if (formEditorStore.currentLayout?.script != null) {
    //         try {
    //             const {onAction, onLoaded} = JSON.parse(formEditorStore.currentLayout?.script)
    //         } catch (e) {
    //             console.error('something error on parse script')
    //         }
    //
    //     }
    // }, [formEditorStore.currentLayout?.script])

    useEffect(() => {
        console.log(formEditorStore.layoutScript)
    }, [formEditorStore.layoutScript])

    function handleOnActionEditorChange(
        value: string | undefined,
        _ev: monaco.editor.IModelContentChangedEvent,
    ) {
        formEditorStore.updateCurrentLayoutScript('onAction', value ?? '')
    }

    function handleOnLoadedEditorChange(
        value: string | undefined,
        _ev: monaco.editor.IModelContentChangedEvent,
    ) {
        formEditorStore.updateCurrentLayoutScript('onLoaded', value ?? '')
    }

    return <>
        <Container>
            <div className={'d-flex gap-3'}>
                <div>
                    <Nav pills vertical>
                        <NavItem>
                            <NavLink active={currentTab == 'onLoaded'} type={'button'}
                                     onClick={e => {
                                         setCurrentTab('onLoaded')
                                     }}
                            >onLoaded </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink active={currentTab == 'onAction'} type={'button'}
                                     onClick={e => {
                                         setCurrentTab('onAction')
                                     }}
                            >onAction
                            </NavLink>
                        </NavItem>
                    </Nav>
                </div>
                <div className={'flex-grow-1'}>
                    {
                        currentTab == 'onLoaded' ?
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
                                    defaultValue={formEditorStore.layoutScript.onLoaded ?? ''}
                                    // onMount={handleEditorDidMount}
                                    onChange={handleOnLoadedEditorChange}
                                />
                            </>
                            : null
                    }
                    {
                        currentTab == 'onAction' ?
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
                                    defaultValue={formEditorStore.layoutScript.onAction ?? ''}
                                    onChange={handleOnActionEditorChange}
                                />
                            </>
                            : null
                    }

                </div>
            </div>
        </Container>
    </>
}


export default LayoutScriptEditor;