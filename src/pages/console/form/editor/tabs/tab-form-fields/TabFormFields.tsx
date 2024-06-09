import ConsoleStaticTable from "../../../../../../hype/components/ConsoleStaticTable";
import {useCallback, useEffect, useState} from "react";
import {Button, Spinner} from "react-bootstrap";
import {Edit, Plus, Trash} from "react-feather";
import {useQuery} from "react-query";
import {deleteFormField, fetchFormList, saveFormLayout} from "../../../../../../libs/axios";
import useBoundStore from "../../../../../../stores";
import FieldConfigCanvas from "./FieldConfigCanvas";
import {Cell} from "react-table";
import toast from "react-hot-toast";


const TabFormFields = (props: { data: Array<any> }) => {
    const [dataList, setDataList] = useState(props.data);
    const formId = useBoundStore(state => state.formEditor.formData?.id)
    const openFieldConfig = useBoundStore(state => state.formEditor.openFieldConfig)
    const showFieldConfig = useBoundStore(state => state.formEditor.showFieldConfig)

    const handleDeleteField = useCallback(async (id: any) => {
        await toast.promise(
            deleteFormField(formId, id)
            ,
            {
                loading: 'Deleting...',
                success: <b>Deleted!</b>,
                error: <b>Could not Delete.</b>,
            },
            {
                position: "top-right"
            }
        )
    }, [formId])

    const columns = useCallback(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
            },
            {
                header: 'Field Name',
                accessorKey: 'name',
                cell: (cell: any) => (
                    <>
                        <span>{cell.row.original.name}</span>
                    </>
                )
            },
            {
                header: 'Slug',
                accessorKey: 'slug',
                cell: (cell: any) => (
                    <>
                        <span>{cell.row.original.slug}</span>
                    </>
                )
            },
            {
                header: 'Create At',
                accessorKey: 'createdAt',
                cell: (cell: any) => (
                    new Date(cell.row.original.createdAt).toLocaleString()
                )
            },
            {
                header: 'Action',
                cell: (cell: Cell) => (
                    <>
                        <Button size={'sm'}
                                className={'text-dark'} variant={'link'}
                                onClick={() => openFieldConfig(cell.row.original.id)}>
                            <Edit size={22}/>
                        </Button>
                        <Button onClick={() => handleDeleteField(cell.row.original.id)} size={'sm'}
                                className={'text-dark'} variant={'link'}>
                            <Trash size={22}/>
                        </Button>
                    </>
                )
            },
        ],
        []
    );
    return <>
        <FieldConfigCanvas show={showFieldConfig}></FieldConfigCanvas>
        <ConsoleStaticTable onCreateClick={() => openFieldConfig('', 'new')} createButtonLabel={'Add Fields'}
                      data={props.data} columns={columns()}/>
    </>

}

export default TabFormFields;