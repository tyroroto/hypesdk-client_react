import {useCallback, useMemo} from "react";
import {deleteFormRecord, fetchForm, fetchFormRecords} from "../../../libs/axios";
import {Link, NavLink, useNavigate, useParams} from "react-router-dom";
import ConsoleStaticTable from "../../../hype/components/ConsoleStaticTable";
import {Button, Container,Spinner} from "react-bootstrap";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {Edit,Trash2} from "react-feather";
import {Breadcrumb, BreadcrumbItem} from "reactstrap";
import {FormInterface} from "../../../hype/classes/form.interface";
import toast from "react-hot-toast";
import {IFormRecord} from "../../../hype/classes/form-record.interface";


const PageFormRecordList = (props: { recordType?: 'DEV' | 'PROD' }) => {
    const {id} = useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const queryListName = `hype-recordList-${props.recordType ?? 'PROD'}`
    useQuery<FormInterface>(
        [`forms`, id],
        () => {
            if (id == null) {
                throw new Error('id params not exist')
            }
            return fetchForm(parseInt(id), {layout_state: 'ACTIVE'})
        }
    );

    const recordsQuery = useQuery<{
        data: IFormRecord[],
        total: number,
    }>({
        queryKey: [queryListName, id],
        queryFn: () => {
            if (id == null) {
                throw new Error('id not valid');
            }
            return fetchFormRecords(parseInt(id), {recordType: props.recordType ?? null})
        },
    });

    // exclude from IFormRecord
    const extraColumns = [
        'createdAt',
        'createdBy',
        'createdByUser',
        'deletedAt',
        'deletedBy',
        'errors',
        'recordState',
        'recordType',
        'updatedAt',
        'updatedBy',
        'id'
    ];
    const generateColumns = useMemo(() => {
        if (recordsQuery.data) {
          if(recordsQuery.data.data?.length > 0) {
              const firstRecord: IFormRecord | any = recordsQuery.data.data[0]
                return Object.keys(firstRecord).filter( c => {
                    return !extraColumns.includes(c)
                }).map(key => {
                    // check type of key
                    const isNumber = typeof (firstRecord[key])  === 'number'
                    return {
                        header: key,
                        accessorKey: key,
                        cell: (cell: any) => (
                            <div className={'text-center'}>
                                { isNumber ? cell.row.original[key].toLocaleString('en') : cell.row.original[key] }
                            </div>
                        )
                    }
                })
          }
        }
        return []
    },[recordsQuery.data])

    const deleteRecordMutate = useMutation((recordId: number) => {
        return deleteFormRecord(parseInt(id ?? ''), recordId)
    }, {
        onMutate: variables => {
            const toastRef = toast.loading(`Deleting ${variables}`, {id: 'delete'})
            return { toastRef: toastRef }
        },
        onError: (error, variables, context) => {
            toast.error('Delete failed')
        },
        onSuccess: async (data, variables, context) => {
            toast.success('Delete success')
            await queryClient.invalidateQueries([queryListName, id])
        },
        onSettled: (data, error, variables, context) => {
            toast.dismiss('delete')
        },
    })

    const columns = useCallback(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
                cell: (cell: any) => (
                    <div className={'text-center'}>
                        {(cell.row.original.id)}
                    </div>
                )
            },
            ...generateColumns,
            {
                header: 'Create At',
                accessorKey: 'createdAt',
                cell: (cell: any) => (
                   <div className={'text-center'}>
                       {new Date(cell.row.original.createdAt).toLocaleString()}
                   </div>
                )
            },
            {
                header: 'Action',
                cell: (cell: any) => (
                    <div className={'text-center'}>
                        <Link to={`/console/forms/${id}/records/${cell.row.original.id}`}>
                            <Button size={'sm'} className={'text-dark'} variant={'link'}>
                                <Edit size={22}/>
                            </Button>
                        </Link>
                        <Button onClick={() => {
                            deleteRecordMutate.mutate(cell.row.original.id)
                        }}  size={'sm'} className={'text-dark'} variant={'link'}>
                            <Trash2 size={22}/>
                        </Button>
                    </div>
                )
            },
        ],
        [generateColumns]
    );

    return <>
        <Container fluid>
            <div className={'page-card'}>
                <h4>Records</h4>
                {
                    recordsQuery.status !== 'success' ?
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        : <>
                            <div className={'mb-2'}>
                                <Breadcrumb listTag="div">
                                    <BreadcrumbItem>
                                        <NavLink to={'/console/forms'}>Forms</NavLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbItem>
                                        Records
                                    </BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                            <ConsoleStaticTable createButtonLabel={'Create Record'}
                                          onCreateClick={() => {
                                              navigate(`/console/forms/${id}/records/create`)
                                          }} data={recordsQuery.data.data}
                                          columns={columns()}/>
                        </>
                }
            </div>

        </Container>
    </>

}

export default PageFormRecordList;