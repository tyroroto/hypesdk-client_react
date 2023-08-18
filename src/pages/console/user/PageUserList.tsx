import {useCallback, useState} from "react";
import axiosInstance, {createUser} from "../../../libs/axios";
import {Button, Col, Container, Form, Offcanvas, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import ConsoleTable from "../../../hype/components/ConsoleTable";
import {Trash2} from "react-feather";
import {useQuery, useQueryClient} from "react-query";
import {useForm} from "react-hook-form";
import {Badge} from "reactstrap";

// TODO add validator for text
const PageRoleList = () => {
    const [showCreateCanvas, setShowCreateCanvas] = useState(false);
    const handleCreateCanvasClose = () => setShowCreateCanvas(false);

    const queryClient = useQueryClient()
    const {register, control, handleSubmit} = useForm<{ email: string, username: string, password: string }>();
    const onSubmit = async (data: any) => {
        await createUser(data)
        await queryClient.invalidateQueries(['users'])
    };
    const query = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await axiosInstance.get('/admin/users')
            return response.data;
        },
    });

    const renderStatus = useCallback((status: string) => {
            if(status === 'active') {
                return <Badge color={'primary'}>ACTIVE</Badge>
            }
            return status;
        }
        , [])
    const columns = useCallback(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
            },
            {
                Header: 'User Name',
                accessor: 'username',
                Cell: (cell: any) => (
                    <>
                        <span>{cell.row.original.username}</span>
                    </>
                )
            },
            {
                Header: 'Status',
                accessor: 'status',
                Cell: (cell: any) => (
                    <div className={'text-center'}>
                        <span>{renderStatus(cell.row.original.status)}</span>
                    </div>
                )
            },
            {
                Header: 'Create At',
                accessor: 'createdAt',
                Cell: (cell: any) => (
                    <div className={'text-center'}>
                        {new Date(cell.row.values.createdAt).toLocaleString()}
                    </div>
                )
            },
            {
                Header: 'Action',
                Cell: (cell: any) => (
                    <div className={'text-center'}>
                        <Link to={`/console/users/${cell.row.values.id}`}>
                            <Button size={'sm'} variant={'outline-dark'} className={''}>OPEN</Button>
                        </Link>
                        <Link to={`/console/users/${cell.row.values.id}/roles`}>
                            <Button size={'sm'} variant={'outline-dark'} className={'ms-1'}>Roles</Button>
                        </Link>
                        <Button size={'sm'} className={'ms-1 text-dark'} variant={'link'}>
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
                <Offcanvas.Title>New User</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>
                            Email
                        </Form.Label>
                        <Form.Control
                            {...register('email', {required: "Please enter email"})}
                            type="email" placeholder="email@example.com"/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formUsername">
                        <Form.Label>
                            Username
                        </Form.Label>
                        <Form.Control
                            {...register('username', {required: "Please enter username"})}
                            type="text" placeholder="uname"/>
                    </Form.Group>
                    <Form.Group className="mb-5" controlId="formPassword">
                        <Form.Label>
                            Password
                        </Form.Label>
                        <Form.Control
                            {...register('password', {required: "Please enter passowrd"})}
                            type="password" placeholder="Password"/>
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
                <h4 className={'mb-4'}>Users</h4>
                {
                    query.status === 'success' ?
                        <ConsoleTable data={query.data.data ?? []}
                                      onCreateClick={() => setShowCreateCanvas(true)}
                                      columns={columns()}
                        />
                        : null
                }
            </div>
        </Container>
    </>

}

export default PageRoleList;