import {useCallback, useMemo, useState} from "react";
import axiosInstance, {createUser} from "../../../libs/axios";
import {Button, Col, Container, Form, Offcanvas, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {Trash2} from "react-feather";
import {useQuery, useQueryClient} from "react-query";
import {useForm} from "react-hook-form";
import {Badge} from "reactstrap";
import toast from "react-hot-toast";
import ConsoleStaticTable from "../../../hype/components/ConsoleStaticTable";
import {ISearchKey, IUser} from "../../../hype/classes/default.interface";

const PageUserList = () => {
    const [showCreateCanvas, setShowCreateCanvas] = useState(false);
    const handleCreateCanvasClose = () => setShowCreateCanvas(false);

    const queryClient = useQueryClient()
    const {register, control, handleSubmit} = useForm<{ email: string, username: string, password: string }>();
    const onSubmit = async (data: any) => {
        try{
            await createUser(data)
            toast.success('User created')
        }catch (e) {
            if ( e instanceof Error ) {
                toast.error(e.message);
            }
        }
        setShowCreateCanvas(false)
        await queryClient.invalidateQueries(['users'])
    };

    const query = useQuery({
        queryKey: ['hype-users'],
        queryFn: async () => {
            const response = await axiosInstance.get('/admin/users')
            if(response.status == 200){
                return response.data.data.map((u: IUser & ISearchKey) => {
                    return {
                        ...u,
                        searchKey: u.username + ' ' + u.email + ' ' + u.id
                    };
                })
            }
            return []
        },
    });

    const [search, setSearch] = useState('');
    const displayData = useMemo(() => {
        if(query.data == null) return []
        return query.data.filter((v: ISearchKey) => {
            return v.searchKey.toLowerCase().includes(search.toLowerCase())
        })

    }, [search, query.data]);

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
                header: 'ID',
                accessorKey: 'id',
            },
            {
                header: 'User Name',
                accessorKey: 'username',
                cell: (cell: any) => (
                    <>
                        <span>{cell.row.original.username}</span>
                    </>
                )
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (cell: any) => (
                    <div className={'text-center'}>
                        <span>{renderStatus(cell.row.original.status)}</span>
                    </div>
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
                        <Link to={`/console/users/${cell.row.original.id}`}>
                            <Button size={'sm'} variant={'outline-dark'} className={''}>OPEN</Button>
                        </Link>
                        <Link to={`/console/users/${cell.row.original.id}/roles`}>
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
                        <ConsoleStaticTable data={displayData}
                                            onSearchClick={ (s) => {
                                                setSearch(s)
                                            }}
                                            onCreateClick={() => setShowCreateCanvas(true)}
                                            columns={columns()}
                        />
                        : null
                }
            </div>
        </Container>
    </>

}

export default PageUserList;