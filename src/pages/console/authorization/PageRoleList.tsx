import {useCallback, useEffect, useState} from "react";
import axiosInstance, {createRole, deleteRole} from "../../../libs/axios";
import {Button, Container, Form, Offcanvas} from "react-bootstrap";
import ConsoleStaticTable from "../../../hype/components/ConsoleStaticTable";
import {Trash2} from "react-feather";
import withReactContent from "sweetalert2-react-content";
import {useQuery, useQueryClient} from "react-query";
import {useForm} from "react-hook-form";
import {Link} from "react-router-dom";
import Swal from 'sweetalert2';
const MySwal = withReactContent(Swal)

const PageRoleList = () => {
    const [showCreateCanvas, setShowCreateCanvas] = useState(false);
    const handleCreateCanvasClose = () => setShowCreateCanvas(false);
    const queryClient = useQueryClient()
    const {register, control, handleSubmit} = useForm<{ name: string, slug: string }>();
    const onSubmit = async (data: any) => {
        await createRole(data)
        await queryClient.invalidateQueries(['roles'])
    };
    const query = useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const response = await axiosInstance.get('/admin/roles')
            return response.data;
        },
    });

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
                deleteRole(id).then(
                    () => {
                        queryClient.invalidateQueries(['roles']).then(_ => {})
                        Swal.fire('Deleted!', '', 'success').then(_ => {})
                    }
                ).catch( e =>
                    () => Swal.fire('delete fail!', '', 'error')
                )
            }
        })
    }, [])
    const columns = useCallback(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
            },
            {
                header: 'Role Name',
                accessorKey: 'name',
                cell: (cell: any) => (
                    <>
                        <span>{cell.row.original.name}</span>
                        <span className={'ms-2'}>{cell.row.original.slug}</span>
                    </>
                )
            },
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
                        <Link to={`/console/roles/${cell.row.original.id}`}>
                            <Button size={'sm'} variant={'outline-dark'} className={''}>OPEN</Button>
                        </Link>
                        <Button onClick={() => handleDeleteButton(cell.row.original.id)} size={'sm'} className={'text-dark'}
                                variant={'link'}>
                            <Trash2 size={22}/>
                        </Button>
                    </div>

                )
            },
        ],
        []
    );

    return <>
        <Offcanvas backdrop="static" onHide={handleCreateCanvasClose} show={showCreateCanvas} scroll={true}
                   placement={"end"}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>New Role</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>

                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>
                            Role name
                        </Form.Label>
                        <Form.Control
                            {...register('name', {required: "Please enter role title"})}
                            type="text" placeholder="Role Name"/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formUsername">
                        <Form.Label>
                            Form Slug
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
        <Container fluid={true}>
            <div className={'page-card'}>
                <h4 className={'mb-4'}>Roles</h4>
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

export default PageRoleList;