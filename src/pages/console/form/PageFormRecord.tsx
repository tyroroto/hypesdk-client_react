import {useCallback} from "react";
import {useParams} from "react-router-dom";
import {Container} from "reactstrap";
import {FormRecordView} from "../../../hype/components/FormRecordView";
import {RecordTypeEnum} from "../../../hype/classes/constant";


const PageFormRecord = (props: {recordType: RecordTypeEnum, formMode: 'PREVIEW' | 'NORMAL' | 'READONLY', layout: 'DRAFT' | 'ACTIVE'}) => {
    // props: { formMode: 'PREVIEW' | 'NORMAL' | 'READONLY' }
    // const [formMode, setFormMode] = useState<string>('NORMAL');
    const {formId, id} = useParams();
    const actionMode = useCallback(() => {
        return id == 'create' ? 'ADD' : 'EDIT';
    }, [id])


    return <>
        <Container>
            <div className={'page-card'}>
                <div className={'d-flex mb-5'}>
                    <div className={'d-inline-flex fs-1'}>Form {formId} {props.formMode == 'PREVIEW' ? '[PREVIEW]' : ''}</div>
                </div>
                {
                    formId ? <FormRecordView formId={parseInt(formId)}
                                             recordId={id != 'create' ? parseInt(id ?? '') : undefined}
                                             layout={props.layout}
                                             formMode={props.formMode}
                                             recordType={props.recordType}
                                             actionMode={actionMode()}/>
                        : null
                }
            </div>
        </Container>

    </>
}

export default PageFormRecord;