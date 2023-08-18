import {createContext, useCallback, useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {FormInterface} from "../classes/form.interface";
import {
    createFormRecord,
    fetchForm,
    fetchFormRecord,
    updateFormRecord
} from "../../libs/axios";
import {FormRecordViewBox} from "./FormRecordViewBox";
import {findRootNode} from "../../libs/util";
import {FormLayoutDataInterface, LayoutItemInterface} from "../classes/layout.interface";
import {Button} from "reactstrap";
import toast from "react-hot-toast";
import {RecordStateEnum, RecordTypeEnum} from "../classes/constant";

interface IFormRecordViewContext {
    layoutItemList: Array<LayoutItemInterface>,
    formData: any,
    recordData: any,
    setUpdatedRecordData: React.Dispatch<any>,
    updatedRecordData: any,
    recordId: number | null,
    getBoxData: (boxId: string) => void,
    getRenderData: (boxId: string) => void,
    actionMode: string,
    formMode: string,
    forceSave: boolean,
    onBoxValueChange: (args: { event: string, boxId: string, boxData: any, slug: string, value: any }) => void,
    onAction: (args: { event: string, boxId: string, boxData: any, slug: string }) => void,
    getContextVariable: (varName: string) => any,
    contextVariableObject: object,
    requiredInput: [],
}

export const FormRecordViewContext = createContext<IFormRecordViewContext | undefined>(undefined)

export interface IFormRecordViewProps {
    formId: number,
    recordId?: number
    actionMode: 'ADD' | 'EDIT' | string
    formMode: 'NORMAL' | 'PREVIEW' | 'READONLY' | string
    layout: 'ACTIVE' | 'DRAFT' | number
    recordType: RecordTypeEnum
}

export const FormRecordView = (props: IFormRecordViewProps) => {
    const queryClient = useQueryClient();
    const query = useQuery<FormInterface>([`/forms/${props.formId}`],
        () => {
            if (props.formId == null) {
                throw new Error('formId params not exist')
            }
            return fetchForm(props.formId, {layout_state: props.layout})
        }
    );



    const [layoutRoot, setLayoutRoot] = useState<Array<any>>([]);
    const [layoutItemList, setLayoutItemList] = useState<Array<any>>([]);
    const [contextVariableObject, setContextVariableObject] = useState<any>({});
    const [recordId, setRecordId] = useState<number | null>(props.recordId ?? null);
    const [recordData, setRecordData] = useState<any>({});
    const [updatedRecordData, setUpdatedRecordData] = useState<any>({});
    const [requiredInput, setRequiredInput] = useState<any>({});
    const [forceSave, setForceSave] = useState<any>({});
    const [formData, setFormData] = useState<any>();

    const recordDataQuery = useQuery<FormInterface>([`/forms/${props.formId}/${props.recordId}`],
        () => {
            if (props.recordId == null) {
                throw new Error('No Record id')
            }
            return fetchFormRecord(props.formId, props.recordId)
        }
    );

    const getBoxData = useCallback((boxId: string) => {

    }, [])

    const getRenderData = useCallback((boxId: string) => {

    }, [])

    const handleOnBoxValueChange = useCallback((args: { event: string, boxId: string, boxData: any, slug: string, value: any }) => {

    }, [])
    const handleOnAction = useCallback((args: { event: string, boxId: string, boxData: any, slug: string }) => {

    }, [])

    const getContextVariable = useCallback((varName: string) => {

    }, [])

    const handleSaveDraft = useCallback(() => {

    }, [])

    const createApi = useMutation((input: { data: any, recordState: RecordStateEnum }) => {
        return createFormRecord(props.formId, input.data, input.recordState, props.recordType)
    }, {
        onMutate: variables => {
            const toastRef = toast.loading(`Creating ${variables}`, {id: 'create'})
            return {toastRef: toastRef}
        },
        onError: (error, variables, context) => {
            toast.error('Create failed')
        },
        onSuccess: async (data, variables, context) => {
            toast.success('Create success')
            await queryClient.invalidateQueries([`recordList-${props.recordType ?? 'PROD'}`])
        },
        onSettled: (data, error, variables, context) => {
            toast.dismiss('create')
        },
    })

    const updateApi = useMutation((input: { data: any, recordState: RecordStateEnum }) => {
        if(recordId == null){
            throw new Error('update need recordId')
        }
        return updateFormRecord(props.formId, recordId, input.data, input.recordState)
    }, {
        onMutate: variables => {
            const toastRef = toast.loading(`Updating ${variables}`, {id: 'update'})
            return {toastRef: toastRef}
        },
        onError: (error, variables, context) => {
            toast.error('Update failed')
        },
        onSuccess: async (data, variables, context) => {
            toast.success('Update success')
            await queryClient.invalidateQueries([`recordList-${props.recordType ?? 'PROD'}`])
        },
        onSettled: (data, error, variables, context) => {
            toast.dismiss('update')
        },
    })

    useEffect(() => {

        if (props.recordId != null && recordDataQuery.status == 'success') {
            setRecordData(recordDataQuery.data)
        }
    }, [props.recordId, recordDataQuery.status])

    useEffect(() => {
        if (query.status == 'success') {
            setFormData(query.data);
            const activeLayout = query.data.layouts.find((l: FormLayoutDataInterface) => l.state === props.layout)
            if (activeLayout != null) {
                // setDefaultLayout(activeLayout.layout);
                const layoutItemArr = JSON.parse(activeLayout.layout);
                setLayoutItemList(layoutItemArr);
                setLayoutRoot([...findRootNode(layoutItemArr)]);
            } else {
                console.error('None active layout found.')
            }
        }

    }, [query.data, query.status, props.formMode])

    return <>
        <FormRecordViewContext.Provider value={{
            layoutItemList,
            getContextVariable,
            onBoxValueChange: handleOnBoxValueChange,
            onAction: handleOnAction,
            recordData,
            updatedRecordData,
            setUpdatedRecordData,
            contextVariableObject,
            formMode: props.formMode,
            actionMode: props.actionMode,
            requiredInput,
            forceSave,
            recordId,
            formData,
            getBoxData,
            getRenderData
        }}>
            {
                (props.recordId != null && recordDataQuery.status == 'success') || props.recordId == null ?
                    <>
                        {
                            layoutRoot != null && layoutRoot.length > 0 ?
                                <>
                                    {
                                        layoutItemList.filter(d => layoutRoot.indexOf(d.id) > -1).map((data, keyLayout) =>
                                            <FormRecordViewBox key={keyLayout} path={[keyLayout]}
                                                               boxId={data.id}/>
                                        )
                                    }
                                </> : null
                        }
                    </> : null
            }


            <div className={'d-inline-flex ms-auto'}>
                <div className={'align-self-center'}>
                    <Button
                        disabled={recordData['recordState'] == 'ACTIVE'}
                        onClick={() => {
                            if (recordId == null) {
                                createApi.mutate({
                                    data: updatedRecordData,
                                    recordState: RecordStateEnum.DRAFT,
                                })
                            } else {
                                updateApi.mutate({
                                    data: updatedRecordData,
                                    recordState: RecordStateEnum.DRAFT,
                                })
                            }
                        }}
                        outline={true} className={'me-1'}
                        color={'primary'}>  {recordId != null ? 'Update' : 'Create'} draft </Button>
                    <Button
                        onClick={() => {
                            if (recordId == null) {
                                createApi.mutate({
                                    data: updatedRecordData,
                                    recordState: RecordStateEnum.ACTIVE,
                                })
                            } else {
                                updateApi.mutate({
                                    data: updatedRecordData,
                                    recordState: RecordStateEnum.ACTIVE,
                                })
                            }
                        }}
                        color={'primary'}> {recordId != null ? 'Update' : 'Create'} </Button>
                </div>
            </div>
        </FormRecordViewContext.Provider>
    </>
}