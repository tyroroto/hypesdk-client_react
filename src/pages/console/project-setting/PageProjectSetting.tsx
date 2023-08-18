import {Container, Spinner} from "react-bootstrap";
import {PageCard} from "../../../hype/components/PageCard";
import {FormRecordView} from "../../../hype/components/FormRecordView";
import {useEffect, useState} from "react";
import {RecordTypeEnum} from "../../../hype/classes/constant";
import {findForm} from "../../../libs/axios";

const PageProjectSetting = () => {
    const [formId, setFormId] = useState(null);
    useEffect(() => {
        findForm(null, 'project_setting').then( response => {
            setFormId(response.id)
        })
    }, [])
    return (
        <>
            <Container>
                <PageCard>
                    <h4>Project Setting</h4>
                    {
                        formId ? <FormRecordView
                                layout={'ACTIVE'}
                                formId={parseInt(formId)}
                                recordId={1}
                                formMode={'NORMAL'}
                                actionMode={'EDIT'}
                                recordType={RecordTypeEnum.PROD}/>
                            : <div className={'mt-5 text-center'}>
                                <h2>Loading form</h2>
                                <Spinner className={'mt-3 '} animation="grow" variant="dark"/>
                            </div>
                    }
                </PageCard>
            </Container>
        </>
    )
}

export default PageProjectSetting;
