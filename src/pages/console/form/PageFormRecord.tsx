import {useCallback} from "react";
import {useParams} from "react-router-dom";
import {Container} from "reactstrap";
import {FormRecordView} from "../../../hype/components/FormRecordView";
import {RecordTypeEnum} from "../../../hype/classes/constant";
import {useQuery} from "react-query";
import {FormInterface} from "../../../hype/classes/form.interface";
import {fetchForm} from "../../../libs/axios";
import {HypeFormContext} from "../../../hype/contexts/hypeFormContext";


const PageFormRecord = (props: {recordType: RecordTypeEnum, formMode: 'PREVIEW' | 'NORMAL' | 'READONLY', layout: 'DRAFT' | 'ACTIVE'}) => {
    // props: { formMode: 'PREVIEW' | 'NORMAL' | 'READONLY' }
    // const [formMode, setFormMode] = useState<string>('NORMAL');
    const {formId, id} = useParams();
    const actionMode = useCallback(() => {
        return id == 'create' ? 'ADD' : 'EDIT';
    }, [id])

    const query = useQuery<FormInterface, any>([`/forms/${formId == null}`],
        () => {
            if (formId == null ) {
                throw new Error('formId or formSlug params not exist')
            }
            return fetchForm(formId, {layout_state: props.layout})
        }
    );


    return <>
        <Container>
            {
                query.data != null ?
                    <HypeFormContext.Provider value={{
                        form: {
                            id: formId
                        },
                        record: {
                            id: id != 'create' ? parseInt(id ?? '') : undefined
                        }
                    }}>
                        <div className={'page-card'}>
                            <div className={'text-end fs-6 text-secondary'}>fid:{formId}</div>
                            <div className={'d-flex mb-5'}>
                                <div className={'d-inline-flex ms-1 fs-1'}> {query.data?.name} {props.formMode == 'PREVIEW' ? '[PREVIEW]' : ''}</div> Form
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
                    </HypeFormContext.Provider>
                    : <h3 className={'text-center'}>
                        Loading...
                    </h3>
            }

        </Container>

    </>
}

export default PageFormRecord;