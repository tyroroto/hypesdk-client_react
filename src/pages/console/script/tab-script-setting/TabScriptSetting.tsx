import {Button, Input, Label} from "reactstrap";
import {useCallback, useState} from "react";
import TableScriptPermissions from "./TableScriptPermissions";

interface IScriptData {
    id: number,
    name: string,
    slug: string,
}
const TabScriptSetting = (props: {scriptData: IScriptData}) => {
    const [formName, setFormName] = useState('');
    const {scriptData} = props;
    return <>
        <div className={'d-flex gap-3'}>
            <div className={'flex-grow-1'}>
                <Label>Script Name</Label>
                <Input onChange={(e)=> {
                    setFormName(e.target.value)
                }} defaultValue={scriptData?.name}/>
                <Label>Script Slug</Label>
                <Input disabled readOnly defaultValue={scriptData?.slug}/>
                <div className={'mb-4'}/>
                <TableScriptPermissions scriptId={scriptData?.id}/>
            </div>
        </div>
    </>
}

export default TabScriptSetting;