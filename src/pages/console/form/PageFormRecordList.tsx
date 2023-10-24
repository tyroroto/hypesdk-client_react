import {useCallback,  useState} from "react";
import  {fetchForm, fetchFormRecords} from "../../../libs/axios";
import {Link, NavLink, useNavigate, useParams} from "react-router-dom";
import ConsoleTable from "../../../hype/components/ConsoleTable";
import {Button, Container,Spinner} from "react-bootstrap";
import {useQuery} from "react-query";
import {Edit, ExternalLink, Trash, Trash2} from "react-feather";
import {Breadcrumb, BreadcrumbItem} from "reactstrap";
import {FormInterface} from "../../../hype/classes/form.interface";


const PageFormRecordList = (props: { recordType?: 'DEV' | 'PROD' }) => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [showCreateCanvas, setShowCreateCanvas] = useState(false);
    const handleCreateCanvasClose = () => setShowCreateCanvas(false);
    const formQuery = useQuery<FormInterface>(
        [`forms`, id],
        () => {
            if (id == null) {
                throw new Error('id params not exist')
            }
            return fetchForm(parseInt(id), {layout_state: 'ACTIVE'})
        }
    );

    const recordsQuery = useQuery({
        queryKey: [`recordList-${props.recordType ?? 'PROD'}`, id],
        queryFn: () => {
            if (id == null) {
                throw new Error('id not valid');
            }
            return fetchFormRecords(parseInt(id), {recordType: props.recordType ?? null})
        },
    });

    const columns = useCallback(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
            },
            {
                Header: 'Create At',
                accessor: 'createdAt',
                Cell: (cell: any) => (
                    new Date(cell.row.values.createdAt).toLocaleString()
                )
            },
            {
                Header: 'Action',
                Cell: (cell: any) => (
                    <>
                        <Link to={`/console/forms/${id}/records/${cell.row.values.id}`}>
                            <Button size={'sm'} className={'text-dark'} variant={'link'}>
                                <Edit size={22}/>
                            </Button>
                        </Link>
                        <Link to={`/console/forms/${id}/records/${cell.row.values.id}/delete`}>
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

                                {/*{*/}
                                {/*    props.recordType == 'DEV' ?*/}
                                {/*        <Link to={`/console/forms/${id}/records`}>*/}
                                {/*            <Button variant={'outline-dark'} size={'sm'}>Prod mode <ExternalLink/></Button>*/}
                                {/*        </Link> :*/}
                                {/*        <Link to={`/console/forms/${id}/dev-records`}>*/}
                                {/*            <Button variant={'outline-dark'} size={'sm'}>Dev mode <ExternalLink/></Button>*/}
                                {/*        </Link>*/}
                                {/*}*/}

                            </div>
                            <ConsoleTable createButtonLabel={'Create Record'}
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