import {useCallback, useEffect, useState} from "react";
import axiosInstance, {createPermission, createRole, deletePermission, deleteRole} from "../../../libs/axios";
import {Link} from "react-router-dom";
import ConsoleStaticTable from "../../../hype/components/ConsoleStaticTable";
import {Button, Container, Form, Offcanvas} from "react-bootstrap";
import {Trash2} from "react-feather";
import {useQuery, useQueryClient} from "react-query";
import {useForm} from "react-hook-form";
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
import {Cell} from "react-table";

const MySwal = withReactContent(Swal)

const PagePermissionList = () => {
    const [showCreateCanvas, setShowCreateCanvas] = useState(false);
    const handleCreateCanvasClose = () => setShowCreateCanvas(false);
    const queryClient = useQueryClient()
    const {register, control, handleSubmit} = useForm<{ name: string, slug: string }>();
    const onSubmit = async (data: any) => {
        await createPermission(data)
        await queryClient.invalidateQueries(['permissions'])
    };
    const query = useQuery({
        queryKey: ['permissions'],
        queryFn: async () => {
            const response = await axiosInstance.get('/admin/permissions')
            return response.data;
        },
    });


    const columns = useCallback(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
            },
            {
                header: 'Permission Name',
                accessorKey: 'name',
                cell: (cell: any) => (
                    <>
                        <span></span>
                        <div>
                            {cell.row.original.name}
                        </div>
                        <div className={'text-muted'}>
                            {cell.row.original.slug}
                        </div>
                    </>
                )
            },
            {
                header: 'Type',
                accessorKey: 'permissionType',
                cell: (cell: any) => (
                    <div className={'text-center'}>
                        {cell.row.original.permissionType}
                    </div>
                )
            },
            {
                header: 'Create At',
                accessorKey: 'createdAt',
                cell: (cell: Cell) => (
                    <div className={'text-center'}>
                        {new Date(cell.row.original.createdAt).toLocaleString()}
                    </div>
                )
            },
            {
                header: 'Action',
                cell: (cell: Cell) => (
                    <div className={'text-center'}>
                        {
                            cell.row.original.permissionType != 'core' ?
                                <Button onClick={() => handleDeleteButton(cell.row.original.id)} size={'sm'}
                                        className={'text-dark'} variant={'link'}>
                                    <Trash2 size={22}/>
                                </Button>
                                : null
                        }
                    </div>
                )
            },
        ],
        []
    );
    const handleDeleteButton = useCallback((id: number) => {
        MySwal.fire(
            {
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
            if (result.isConfirmed) {
                deletePermission(id).then(
                    async () => {
                        await Promise.all(
                            [
                                queryClient.invalidateQueries(['permissions']),
                                Swal.fire('Deleted!', '', 'success')
                            ]
                        )
                    }
                ).catch(e =>
                    () => Swal.fire('delete fail!', '', 'error')
                )
            }
        })
    }, [])
    return <>
        <Container fluid={true}>
            <Offcanvas backdrop="static" onHide={handleCreateCanvasClose} show={showCreateCanvas} scroll={true}
                       placement={"end"}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>New Permission</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>

                        <Form.Group className="mb-3" controlId="permissionName">
                            <Form.Label>
                                Permission name
                            </Form.Label>
                            <Form.Control
                                {...register('name', {required: "Please enter permission title"})}
                                type="text" placeholder="Permission Name"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="permissionSlug">
                            <Form.Label>
                                Slug
                            </Form.Label>
                            <Form.Control
                                {...register('slug', {required: "Please enter your slug"})}
                                type="text" placeholder="snakecase_name"/>
                        </Form.Group>
                        <div className={'text-center'}>
                            <Button className={'w-75'} size={'lg'} variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
            <div className={'page-card'}>
                <h4 className={'mb-4'}>Permissions</h4>
                {
                    query.status === 'success' ?
                        <ConsoleStaticTable data={query.data.data ?? []}
                                      onCreateClick={() => setShowCreateCanvas(true)}
                                      columns={columns()}/>
                        : null
                }
            </div>
        </Container>
    </>

}

export default PagePermissionList;