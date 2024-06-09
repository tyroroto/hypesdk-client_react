import ConsoleStaticTable from "../components/ConsoleStaticTable";
import {useEffect, useMemo} from "react";
import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";
import {Edit, Trash, Trash2} from "react-feather";
import {useQuery} from "react-query";
import {fetchFormRecords} from "../../libs/axios";
import {APP_MODE, AppModeType} from "../../libs/util";

export interface IDatatableFormProps {
    formId: number
    mode: AppModeType
}

export const DatatableForm = (props: IDatatableFormProps) => {
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
                header: 'ID',
                accessorKey: 'id',
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
                cell: (cell: any) => (
                    <>
                        <Link to={`/console/forms/${formId}/records/${cell.row.original.id}`}>
                            <Button size={'sm'} className={'text-dark'} variant={'link'}>
                                <Edit size={22}/>
                            </Button>
                        </Link>
                        <Link to={`/console/forms/${formId}/records/${cell.row.original.id}/delete`}>
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
                            <ConsoleStaticTable columns={columns} data={query.data.data}/>
                            : null
                    }
                </>
        }
    </>
}