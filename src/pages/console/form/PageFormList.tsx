import {useCallback,  useState} from "react";
import  {createForm, deleteForm, fetchFormList} from "../../../libs/axios";
import {Link} from "react-router-dom";
import ConsoleStaticTable, {useStaticTable} from "../../../hype/components/ConsoleStaticTable";
import {Button, Container, Form, Offcanvas, Spinner, Tab, Tabs} from "react-bootstrap";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {useForm} from "react-hook-form";
import {Edit, Table, Trash2} from "react-feather";
import toast from "react-hot-toast";


const PageFormList = () => {
    const [showCreateCanvas, setShowCreateCanvas] = useState(false);
    const handleCreateCanvasClose = () => setShowCreateCanvas(false);
    const queryClient = useQueryClient()
    const {register, control, handleSubmit} = useForm<{ name: string, slug: string }>();
    const onSubmit = async (data: any) => {
        try {
            await createForm(data)
            await queryClient.invalidateQueries(['forms'])
        }catch (e) {
            if ( e instanceof Error ) {
                toast.error(e.message);
            }
        }
    };
    const query = useQuery({
        queryKey: ['forms'],
        queryFn: () => fetchFormList(),
    });

    const queryDeleted = useQuery({
        queryKey: ['formsDeleted'],
        queryFn: () => fetchFormList(true),
    });

    const deleteFormMutate = useMutation((id: number) => {
        return deleteForm(id)
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
            await queryClient.invalidateQueries(['forms'])
            await queryClient.invalidateQueries(['formsDeleted'])
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
            },
            {
                header: 'Form Name',
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
                        <Link to={`/console/forms/${cell.row.original.id}/editor`}>
                            <Button size={'sm'} className={'text-dark'} variant={'link'}>
                                <Edit size={22}/>
                            </Button>
                        </Link>
                        <Link to={`/console/forms/${cell.row.original.id}/records`}>
                            <Button size={'sm'} className={'text-dark'} variant={'link'}>
                                <Table size={22}/>
                            </Button>
                        </Link>
                        <Button
                            onClick={() => {deleteFormMutate.mutate(cell.row.original.id)}}
                            size={'sm'} className={'text-dark'} variant={'link'}>
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
                <h4 className={'mb-4'}>FORMS</h4>
                <Offcanvas backdrop="static" onHide={handleCreateCanvasClose} show={showCreateCanvas} scroll={true}
                           placement={"end"}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>New Form</Offcanvas.Title>
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
                    id="uncontrolled-tab-form"
                    className="mb-3"
                >
                    <Tab eventKey="all" title="All">
                        {
                            query.status !== 'success' ?
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                                : <>

                                    <ConsoleStaticTable createButtonLabel={'Create Form'}
                                                  onCreateClick={() => setShowCreateCanvas(true)}
                                                  data={query.data?.data} columns={columns()}/>
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

export default PageFormList;