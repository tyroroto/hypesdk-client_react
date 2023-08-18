import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {Alert, Container, Spinner, Tab, Tabs} from "react-bootstrap";
import TabFormFields from "./tabs/tab-form-fields/TabFormFields";
import TabFormSetting from "./tabs/tab-form-setting/TabFormSetting";
import {fetchForm} from "../../../../libs/axios";
import {useQuery} from "react-query";
import useBoundStore from "../../../../stores";
import {FormInterface} from "../../../../hype/classes/form.interface";
import TabFormLayout from "./tabs/tab-form-layout/TabFormLayout";

const PageFormEditor= () => {
    const {id} = useParams();
    const formEditorStore = useBoundStore(state => state.formEditor);
    const query = useQuery<FormInterface>(
        [`forms`, id] ,
        () => {
            if(id == null){
                throw new Error('id params not exist')
            }
            return fetchForm(parseInt(id), {layout_state: 'DRAFT'})
        }
    );
    useEffect(()=>{
    }, [id])

    useEffect( () => {
        if(query.status == 'success'){
            console.log(query.data)
            formEditorStore.setFormData(query.data)
        }
    }, [query.data, query.status])
    return <>
        <Container fluid={true}>
            <div className={'page-card'}>
            {
                query.isLoading ?
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    : null
            }
            {
                query.status == 'success' && query.data != null ?
                    <>
                        <h2>{query.data.name} ({query.data.id})</h2>
                        <h3>{query.data.desc}</h3>
                        <Tabs
                            defaultActiveKey="form_layout"
                            id="uncontrolled-tab-example"
                            className="mb-3"
                        >
                            <Tab eventKey="form_layout" title="Layout">
                                <TabFormLayout layoutDataArr={query.data.layouts}/>
                            </Tab>
                            <Tab eventKey="form_fields" title="Fields">
                                <TabFormFields data={query.data.fields} />
                            </Tab>
                            <Tab eventKey="form_setting" title="Setting" >
                                <TabFormSetting />
                            </Tab>
                        </Tabs>
                    </>:
                    <Alert variant={'danger'} >Form not found !</Alert>
            }
            </div>
        </Container>
    </>

}

export default PageFormEditor;