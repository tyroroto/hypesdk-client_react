import {useCallback, useState} from "react";
import {createScript, fetchScriptList} from "../../../libs/axios";
import {Link} from "react-router-dom";
import ConsoleStaticTable from "../../../hype/components/ConsoleStaticTable";
import {Button, Container, Form, Offcanvas, Spinner, Tab, Tabs} from "react-bootstrap";
import {useQuery, useQueryClient} from "react-query";
import {useForm} from "react-hook-form";
import {Edit, Trash2} from "react-feather";
import {parseSlug} from "../../../libs/util";


const PageScriptList = () => {
    const [showCreateCanvas, setShowCreateCanvas] = useState(false);
    const handleCreateCanvasClose = () => setShowCreateCanvas(false);
    const queryClient = useQueryClient()
    const {register, setValue, reset, handleSubmit} = useForm<{ name: string, slug: string }>();
    const onSubmit = async (data: any) => {
        await createScript(data)
        await queryClient.invalidateQueries(['scripts']);
        reset();
    };

    const queryAll = useQuery({
        queryKey: ['scripts'],
        queryFn: () => {
            return fetchScriptList()
        },
    });
    const queryDeleted = useQuery({
        queryKey: ['scripts','delete'],
        queryFn: () => {
            return fetchScriptList({ paranoid: false, where: { deletedAt: {
                        '$ne': null
                    }}})
        },
    });

    const columns = useCallback(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
                cell: (cell: any) => (
                    <div className={'text-center'}>
                        <span>{cell.row.original.id}</span>
                    </div>
                )
            },
            {
                header: 'Script Name',
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
                        <Link to={`${cell.row.original.id}`}>
                            <Button size={'sm'} className={'text-dark'} variant={'link'}>
                                <Edit size={22}/>
                            </Button>
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
                <h4 className={'mb-4'}>Scripts</h4>

                <Offcanvas backdrop="static" onHide={handleCreateCanvasClose} show={showCreateCanvas} scroll={true}
                           placement={"end"}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>New Script</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Form onSubmit={handleSubmit(onSubmit)}>

                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>
                                    Script Name
                                </Form.Label>
                                <Form.Control
                                    {...register('name', {required: "Please enter your title"})}
                                    type="text" placeholder="Script Name"/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formUsername">
                                <Form.Label>
                                    Script Slug
                                </Form.Label>
                                <Form.Control
                                    {...register('slug', {required: "Please enter your slug"})}
                                    onChange={(e) => {
                                        setValue('slug', parseSlug(e.target.value))
                                    }}
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
                    id="uncontrolled-tab-form"
                    className="mb-3"
                >
                    <Tab eventKey="all" title="All">
                        {
                            queryAll.status !== 'success' ?
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                                : <>

                                    <ConsoleStaticTable createButtonLabel={(<>Create Script</>)}
                                                  onCreateClick={() => setShowCreateCanvas(true)}
                                                  data={queryAll.data.data} columns={columns()}/>
                                </>
                        }
                    </Tab>
                    <Tab eventKey="trash" title="Trash">
                        {
                            queryDeleted.status !== 'success' ?
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                                : <ConsoleStaticTable data={queryDeleted.data.data} columns={columns()}/>
                        }
                    </Tab>
                </Tabs>

            </div>
        </Container>
    </>

}

export default PageScriptList;