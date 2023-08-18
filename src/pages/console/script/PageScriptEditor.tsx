import {useCallback, useState} from "react";
import {useParams} from "react-router-dom";
import {Button, Container} from "reactstrap";
import Editor from "@monaco-editor/react";
import Select from "react-select";
import {Col, Row} from "react-bootstrap";
import {publishScript, fetchScript, updateScript} from "../../../libs/axios";
import toast from "react-hot-toast";
import * as monaco from "monaco-editor";
import {useQuery} from "react-query";


const PageScriptEditor = () => {
    const {id} = useParams();
    const [editorLanguage, setEditorLanguage] = useState('javascript');
    // const editorRef = useRef(null);
    const [scriptCode, setScriptCode] = useState('')
    const options = [
        {
            label: 'SQL',
            value: 'sql'
        },
        {
            label: 'Javascript',
            value: 'javascript'
        },
        {
            label: 'Typescript',
            value: 'typescript'
        },
        {
            label: 'JSON',
            value: 'json'
        }
    ];

    const scriptQuery = useQuery({
        queryKey: [`scripts/${id}`],
        queryFn: async () => {
            if (id == null) throw new Error('scriptQuery need id')
            return fetchScript(id)
        },
    });

    // function handleEditorDidMount(editor, monaco) {
    //     editorRef.current = editor;
    // }
    //
    function handleEditorChange(
        value: string | undefined,
        _ev: monaco.editor.IModelContentChangedEvent,
    ) {
        setScriptCode(value ?? '');
    }

    const handleSaveScript = useCallback(async () => {
        if (id != null) {
            await toast.promise(
                updateScript(id, {
                    script: scriptCode,
                    scriptType: editorLanguage,
                    state: 'DRAFT'
                })
                ,
                {
                    loading: 'Saving...',
                    success: <b>Script saved!</b>,
                    error: <b>Could not save.</b>,
                },
                {
                    position: "top-right"
                }
            )
        }

    }, [id, scriptCode]);

    const handlePublishScript = useCallback(async () => {
        if (id != null) {
            await toast.promise(
                publishScript(id)
                ,
                {
                    loading: 'Saving...',
                    success: <b>Script saved!</b>,
                    error: <b>Could not save.</b>,
                },
                {
                    position: "top-right"
                }
            )
        }
    }, [id]);


    return <>
        <Container>
            <div className={'page-card'}>
                <div className={'d-flex mb-5'}>
                    <div className={'d-inline-flex fs-1'}>Script</div>
                    <div className={'d-inline-flex ms-auto'}>
                        <div className={'align-self-center'}>
                            <Button color={'primary'}
                                    onClick={() => {
                                        handleSaveScript().catch(e => console.error(e));
                                    }}
                            > Save </Button>

                            <Button color={'success'}
                                    onClick={() => {
                                        handlePublishScript();
                                    }}
                                    className={'ms-1'}> Save & Publish </Button>
                        </div>


                    </div>
                </div>

                <div style={{border: '1px solid grey'}}>
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
                                    defaultValue={options[1]}
                                    onChange={(newValue) => {
                                        if (newValue != null) {
                                            setEditorLanguage(newValue.value);
                                        }
                                    }}
                                    options={options}/>
                            </Col>
                        </Row>
                    </div>
                    {scriptQuery.data != null ?
                        <Editor
                            height="60vh"
                            theme="vs-dark"
                            options={{fontSize: 14}}
                            defaultLanguage={editorLanguage}
                            defaultValue={scriptQuery.data.script}
                            // onMount={handleEditorDidMount}
                            onChange={handleEditorChange}
                        /> : null
                    }
                </div>

            </div>
        </Container>

    </>
}

export default PageScriptEditor;