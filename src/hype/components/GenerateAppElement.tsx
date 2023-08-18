import {useCallback} from "react";
import {LayoutComponentInterface} from "../classes/generate-input.interface";
import {DatatableForm} from "../app-components/DatatableForm";
import {AppModeType, INPUT_RENDER_MODE} from "../../libs/util";
const GenerateAppElement = (props: {
    appSlug: string,
    mode: AppModeType ,
    component: LayoutComponentInterface,
    config: { options: any },
    emitAction: (action: string, value: any, slug?: any) => any
}) => {
    const renderFunc = useCallback(() => {
        switch (props.component.type) {
            case 'datatable-form':
                return <>
                    <DatatableForm
                        mode={props.mode}
                    formId={props.config.options.formId}/>
                </>
        }
    },[props]);
    return <>{renderFunc()}</>}

export default GenerateAppElement;
