import React, {useCallback} from "react";
import {useParams} from "react-router-dom";
import {Container} from "reactstrap";
import {FormModeEnum, RecordStateEnum, RecordTypeEnum} from "../../hype/classes/constant";
import {FormRecordView} from "../../hype/components/FormRecordView";

const FormRender = () => {
    const {formSlug, id} = useParams();
    const actionMode = useCallback(() => {
        return id == 'create' ? 'ADD' : 'EDIT';
    }, [id])

    return <>
        <Container>
            <div className={'page-card'}>
                {
                    formSlug != null ?
                        <>
                            <div className={'d-flex mb-5'}>
                                <div className={'d-inline-flex fs-1'}>Form {formSlug}</div>
                            </div>
                            <FormRecordView
                                            formSlug={formSlug}
                                            recordId={id != 'create' && id != null ? parseInt(id) : undefined}
                                            layout={RecordStateEnum.ACTIVE}
                                            formMode={FormModeEnum.NORMAL}
                                            recordType={RecordTypeEnum.PROD}
                                            actionMode={actionMode()}/>
                            </>
                        : null
                }

            </div>
        </Container>

    </>
}

export default FormRender;