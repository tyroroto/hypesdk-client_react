import {useCallback, useEffect, useState} from "react";
import axiosInstance, {createApp} from "../../../../libs/axios";
import {Button, Container, Form, Offcanvas, Spinner, Tab, Tabs} from "react-bootstrap";
import {Link} from "react-router-dom";
import ConsoleStaticTable from "../../../../hype/components/ConsoleStaticTable";
import {useQuery, useQueryClient} from "react-query";
import {useForm} from "react-hook-form";
import {Trash2} from "react-feather";


const PageAppList = () => {
    const [showCreateCanvas, setShowCreateCanvas] = useState(false);
    const handleCreateCanvasClose = () => setShowCreateCanvas(false);
    const queryClient = useQueryClient()

    const {register, control, handleSubmit} = useForm<{ name: string, slug: string }>();
    const onSubmit = async (data: any) => {
        await createApp(data)
        await queryClient.invalidateQueries(['apps'])
    };
    const query = useQuery({
        queryKey: ['apps'],
        queryFn: async () => {
            const response = await axiosInstance.get('/applications');
            return response.data.data;
        },
    });

    useEffect(() => {

    }, [])
    const columns = useCallback(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
            },
            {
                header: 'App Name',
                accessorKey: 'name',
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
                        <Link to={`/console/apps/${cell.row.original.id}/editor`}>
                            <Button size={'sm'} variant={'outline-dark'} className={''}>OPEN</Button>
                        </Link>
                        <Button size={'sm'} className={'text-dark'} variant={'link'}>
                            <Trash2 size={22}/>
                        </Button>
                    </div>
                )
            },
        ],
        []
    );

    return <>
        <Container fluid={true}>
            <div className={'page-card'}>
                <h4 className={'mb-4'}>APPS</h4>

                <Offcanvas backdrop="static" onHide={handleCreateCanvasClose} show={showCreateCanvas} scroll={true}
                           placement={"end"}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>New App</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Form onSubmit={handleSubmit(onSubmit)}>

                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>
                                    Form name
                                </Form.Label>
                                <Form.Control
                                    {...register('name', {required: "Please enter your title"})}
                                    type="text" placeholder="Form Name"/>
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

                <Tabs
                    defaultActiveKey="all"
                    id="uncontrolled-tab-app"
                    className="mb-3"
                >
                    <Tab eventKey="all" title="All">
                        {
                            query.status !== 'success' ?
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                                : <>
                                    <ConsoleStaticTable createButtonLabel={'Create App'}
                                                  onCreateClick={() => setShowCreateCanvas(true)}
                                                  data={query.data} columns={columns()}/>
                                </>
                        }
                    </Tab>

                    <Tab eventKey="trash" title="Trash">
                        {
                            query.status !== 'success' ?
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                                : <>
                                    <ConsoleStaticTable createButtonLabel={'Create App'}
                                                  onCreateClick={() => setShowCreateCanvas(true)}
                                                  data={query.data} columns={columns()}/>
                                </>
                        }
                    </Tab>
                </Tabs>
            </div>
        </Container>
    </>

}

export default PageAppList;