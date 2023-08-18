import {Button, Card, Col, Container, Row, Spinner, Tab, Tabs} from "react-bootstrap";
import {ArrowRight, ExternalLink, Share} from "react-feather";
import TabAppLayout from "./tabs/tab-app-layout/TabAppLayout";
import {useParams} from "react-router-dom";
import useBoundStore from "../../../../stores";
import {useQuery} from "react-query";
import {fetchDraftApp} from "../../../../libs/axios";
import {useEffect} from "react";

const PageAppEditor = () => {
    const {id} = useParams();
    const appEditorStore = useBoundStore(state => state.appEditor);
    const query = useQuery<any>(
        [`apps`, id],
        () => {
            if (id == null) {
                throw new Error('id params not exist')
            }
            return fetchDraftApp(parseInt(id))
        }
    );
    useEffect(() => {
    }, [id])

    useEffect(() => {
        if (query.status == 'success') {
            appEditorStore.setAppData(query.data)
        }
    }, [query.data, query.status])
    return (
        <>
            <h1>PageAppEditor</h1>
            <Container>
                <div className={'page-card'}>

                    <Tabs
                        defaultActiveKey="dashboard"
                        id="uncontrolled-tab-app"
                        className="mb-3"
                    >
                        <Tab eventKey="dashboard" title="Dashboard">
                            <h1>Dashboard</h1>
                            <Row>
                                <Col>
                                    <Card>
                                        <Card.Body>
                                            <p>Development</p>
                                            <h5>Version Development</h5>
                                            <Button
                                                className={'mb-1'}
                                                variant={'outline-dark'}
                                            >Open <ExternalLink/></Button>
                                            <div>
                                                <Button variant={'outline-primary'}>move to Staging <ArrowRight/>
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col>
                                    <Card className={'border-success'}>
                                        <Card.Body>
                                            <p>Active</p>
                                            <h5>Version -</h5>
                                            <Button variant={'outline-success'}>Open <ExternalLink/></Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Tab>
                        <Tab eventKey="editor" title="Editor">
                            <h1>Editor</h1>
                            {
                                query.status == 'success' && query.data != null ?
                                    <TabAppLayout layoutDataArr={query.data.layouts}/>
                                    : null
                            }
                        </Tab>
                    </Tabs>
                </div>
            </Container>
        </>
    )
}

export default PageAppEditor
