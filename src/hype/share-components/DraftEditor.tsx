// ** React Imports
import {Fragment, useEffect, useState} from 'react'
import {convertToRaw, EditorState, ContentState, convertFromHTML} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg'
import draftToHtml from "draftjs-to-html";

const DraftEditor = (props: any) => {
    const [editorState, setEditorState] = useState<any>(null);
    const [localData, setLocalData] = useState<any>(null);
    const [currentID, setCurrentID] = useState<any>(null);

    // ** State
    useEffect(() => {
        if (props.value) {
            if (currentID !== props?.id) {
                const convertResult = convertFromHTML(props.value ?? '');
                const contentDataState = ContentState.createFromBlockArray(convertResult.contentBlocks);
                const editorDataState = EditorState.createWithContent(contentDataState);
                setEditorState(editorDataState);
                setCurrentID(props.id)
            }
        }
    }, [props])
    const onEditorStateChange = (editorStateData: any) => {
        setEditorState(editorStateData);
        const data = draftToHtml(convertToRaw(editorStateData.getCurrentContent()));
        setLocalData(data);
    };

    useEffect(() => {
        if (props.onDataChange != null) {
            props.onDataChange(localData);
        }
    }, [localData])
    return (
        <Fragment>
            <Editor
                    // id={props?.id ?? ''}
                    placeholder={props?.placeholder}
                    wrapperClassName={ (props?.readonly ? 'disable-input' : "") + props?.wrapperClassName}
                    readOnly={props?.readonly}
                    editorState={editorState}
                    onEditorStateChange={(e: any) => onEditorStateChange(e)}
            />
        </Fragment>


    )
}

export default DraftEditor
