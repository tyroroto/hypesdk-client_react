import {useMutation, useQuery, useQueryClient} from "react-query";
import axiosInstance, {createDevice, deleteForm, fetchFormRecords} from "../libs/axios";
import {Button, Card, Container} from "react-bootstrap";
import React, {useCallback} from "react";
import {Link, useNavigate} from "react-router-dom";
import ConsoleTable from "../hype/components/ConsoleTable";
import {Edit, Trash, Trash2} from "react-feather";
import toast from "react-hot-toast";
import {Cell} from "react-table";

/**
 * Example Page for starter
 */
export const PageDevices = () => {
    const mainFormId = 23;
    const recordDataQuery = useQuery<any, any>([`/forms/${mainFormId}/records`],
        () => {
            return fetchFormRecords(mainFormId, {})
        }
    );
    const queryClient = useQueryClient()
    const sendCreateDevice = useMutation(() => {
        return createDevice({})
    }, {
        onMutate: variables => {
            const toastRef = toast.loading(`Creating ${variables}`, {id: 'create'})
            return { toastRef: toastRef }
        },
        onError: (error, variables, context) => {
            toast.error('Create failed')
        },
        onSuccess: async (data, variables, context) => {
            toast.success('Create success')
            await queryClient.invalidateQueries([`/forms/${mainFormId}/records`])
        },
        onSettled: (data, error, variables, context) => {
            toast.dismiss('create')
        },
    })

    const urlParams = new URLSearchParams({redirect: '/console/devices'});
    const navigate = useNavigate()

    const columns = useCallback(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Create At',
                accessor: 'createdAt',
                Cell: (cell: Cell) => {
                    return new Date(cell.row.values.createdAt).toLocaleString()
                }
            },
            {
                Header: 'Action',
                Cell: (cell: any) => (
                    <>
                        <Link to={`/console/forms/${mainFormId}/records/${cell.row.values.id}`}>
                            <Button size={'sm'} className={'text-dark'} variant={'link'}>
                                <Edit size={22}/>
                            </Button>
                        </Link>
                        <Link to={`/console/users/${cell.row.original.ref_user}/roles`}>
                            <Button size={'sm'} >
                                Roles
                            </Button>
                        </Link>
                        <Link to={`/console/forms/${mainFormId}/records/${cell.row.values.id}/delete`}>
                            <Button size={'sm'} className={'text-dark'} variant={'link'}>
                                <Trash size={22}/>
                            </Button>
                        </Link>
                    </>
                )
            },
        ],
        []
    );

    return <>
        <Container className={'pt-3'}>
            {
                recordDataQuery.status == 'success' ?
                    <>
                        <Button variant={'success'}
                                onClick={() => {
                                    sendCreateDevice.mutate()
                                }}
                        >Create New Device</Button>
                    <ConsoleTable createButtonLabel={'Create Record'}
                                  disableCreateButton={true}
                                  onCreateClick={() => {
                                      navigate(`/console/forms/${mainFormId}/records/create`)
                                  }} data={recordDataQuery.data.data}
                                  columns={columns()}/>
                    </>
                        : null
            }


        </Container>

    </>
}