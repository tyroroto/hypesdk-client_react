import {Button, Input, Label} from "reactstrap";
import {Alert, Card} from "react-bootstrap";
import {useCallback, useState} from "react";
import TableFormPermissions from "./TableFormPermissions";
import useBoundStore from "../../../../../../stores";
import {FormEditorSlice} from "../../../../../../stores/formEditorSlice";
import {updateForm} from "../../../../../../libs/axios";
import toast from "react-hot-toast";


const TabFormSetting = () => {
    const formEditorStore = useBoundStore<FormEditorSlice>(state => state.formEditor)
    const [formName, setFormName] = useState('');

    const handleSaveForm = useCallback( async () => {
        if(formEditorStore.formData?.id != null){
            await toast.promise(
                updateForm(formEditorStore.formData.id, {name: formName})
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
    }, [toast, formEditorStore.formData, formName])
    return <>
        <div className={'d-flex gap-3'}>
            <div className={'flex-grow-1'}>
                <Label>Form Name</Label>
                <Input onChange={(e)=> {
                    setFormName(e.target.value)
                }} defaultValue={formEditorStore.formData?.name}/>
                <Label>Form Slug</Label>
                <Input disabled readOnly defaultValue={formEditorStore.formData?.slug}/>
                <div className={'mb-4'}/>
                {
                    formEditorStore.formData?.id != null ?
                        <TableFormPermissions formId={formEditorStore.formData?.id}/>
                        : <Alert variant={'danger'}>Form not found !</Alert>
                }
            </div>
            <Card style={{width: 260}}>
                <Card.Body>
                    <Button className={'w-100 mb-1'} color={'primary'} onClick={() => {
                        handleSaveForm().catch(e => console.error(e, 'handleSaveForm'));
                    }}> Save </Button>

                </Card.Body>
            </Card>
        </div>

    </>

}

export default TabFormSetting;