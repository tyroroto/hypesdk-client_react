import ConsoleTable from "../components/ConsoleTable";
import {useCallback, useEffect, useMemo} from "react";
import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";
import {Edit, Trash, Trash2} from "react-feather";
import {useQuery} from "react-query";
import {fetchFormRecords} from "../../libs/axios";
import {APP_MODE, AppModeType} from "../../libs/util";

export interface DatatableFormProps {
    formId: number
    mode: AppModeType
}

export const DatatableForm = (props: DatatableFormProps) => {
    const formId = props.formId;

    const query = useQuery({
        queryKey: [`recordList-PROD`, props.formId],
        queryFn: () => {
            if (props.formId == null) {
                throw new Error('id not valid');
            }
            return fetchFormRecords((props.formId), {recordType: null})
        },
    });


    useEffect(() => {

    }, [props.formId])
    const columns = useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
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
                Cell: (cell: any) => (
                    <>
                        <Link to={`/console/forms/${formId}/records/${cell.row.values.id}`}>
                            <Button size={'sm'} className={'text-dark'} variant={'link'}>
                                <Edit size={22}/>
                            </Button>
                        </Link>
                        <Link to={`/console/forms/${formId}/records/${cell.row.values.id}/delete`}>
                            <Button size={'sm'} className={'text-dark'} variant={'link'}>
                                <Trash size={22}/>
                            </Button>
                        </Link>
                        <Button size={'sm'} className={'text-dark'} variant={'link'}>
                            <Trash2 size={22}/>
                        </Button>
                    </>
                )
            },
        ],
        []
    );
    return <>
        {
            props.mode == APP_MODE.EDITOR ?
                <h2>
                    DataTable will render
                </h2> : <>
                    {
                        query.data != null ?
                            <ConsoleTable columns={columns} data={query.data.data}/>
                            : null
                    }
                </>
        }
    </>
}