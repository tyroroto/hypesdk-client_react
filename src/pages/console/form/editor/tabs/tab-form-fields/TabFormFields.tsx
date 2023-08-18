import ConsoleTable from "../../../../../../hype/components/ConsoleTable";
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
                Header: 'ID',
                accessor: 'id',
            },
            {
                Header: 'Field Name',
                accessor: 'name',
                Cell: (cell: any) => (
                    <>
                        <span>{cell.row.original.name}</span>
                    </>
                )
            },
            {
                Header: 'Slug',
                accessor: 'slug',
                Cell: (cell: any) => (
                    <>
                        <span>{cell.row.original.slug}</span>
                    </>
                )
            },
            {
                Header: 'Create At',
                accessor: 'createdAt',
                Cell: (cell: any) => (
                    new Date(cell.row.values.createdAt).toLocaleString()
                )
            },
            {
                Header: 'Action',
                Cell: (cell: Cell) => (
                    <>
                        <Button size={'sm'}
                                className={'text-dark'} variant={'link'}
                                onClick={() => openFieldConfig(cell.row.values.id)}>
                            <Edit size={22}/>
                        </Button>
                        <Button onClick={() => handleDeleteField(cell.row.values.id)} size={'sm'}
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
        <ConsoleTable onCreateClick={() => openFieldConfig('', 'new')} createButtonLabel={'Add Fields'}
                      data={props.data} columns={columns()}/>
    </>

}

export default TabFormFields;