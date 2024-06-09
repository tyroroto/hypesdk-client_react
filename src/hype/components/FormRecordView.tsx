import {createContext, useCallback, useEffect, useMemo, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {FormInterface} from "../classes/form.interface";
import {
    createFormRecord,
    fetchForm, fetchFormBySlug,
    fetchFormRecord,
    updateFormRecord
} from "../../libs/axios";
import {FormRecordViewBox} from "./FormRecordViewBox";
import {findRootNode} from "../../libs/util";
import {FormLayoutDataInterface, LayoutItemInterface} from "../classes/layout.interface";
import {Button} from "reactstrap";
import toast from "react-hot-toast";
import {FormModeType, RecordStateEnum, RecordStateType, RecordTypeEnum} from "../classes/constant";
import {useLocation, useNavigate} from "react-router-dom";

interface IFormRecordViewContext {
    layoutItemList: Array<LayoutItemInterface>,
    formData: any,
    recordData: any,
    setUpdatedRecordData: React.Dispatch<any>,
    updatedRecordData: any,
    recordId: number | undefined,
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
    formId?: number,
    formSlug?: string,
    recordId?: number
    actionMode: 'ADD' | 'EDIT' | string
    formMode: FormModeType
    layout: RecordStateType
    recordType: RecordTypeEnum
}

export const FormRecordView = (props: IFormRecordViewProps) => {
    const queryClient = useQueryClient();
    const location = useLocation()

    const searchParams = useMemo( () => {
        return  new URLSearchParams(location.search)
    }, [location])
    const query = useQuery<FormInterface, any>([`/forms/${props.formId == null ?? props.formSlug}`],
        () => {
            if (props.formId == null && props.formSlug == null) {
                throw new Error('formId or formSlug params not exist')
            }
            if (props.formId != null) {
                return fetchForm(props.formId, {layout_state: props.layout})
            } else {
                return fetchFormBySlug(props.formSlug, {layout_state: props.layout})
            }
        }
    );


    const [layoutRoot, setLayoutRoot] = useState<Array<any>>([]);
    const [layoutItemList, setLayoutItemList] = useState<Array<any>>([]);
    const [contextVariableObject, setContextVariableObject] = useState<any>({});
    const [recordId, setRecordId] = useState<number | undefined>(props.recordId ?? undefined);
    const [recordData, setRecordData] = useState<any>({});
    const [updatedRecordData, setUpdatedRecordData] = useState<any>({});
    const [requiredInput, setRequiredInput] = useState<any>({});
    const [forceSave, setForceSave] = useState<any>({});
    const [formData, setFormData] = useState<FormInterface>();
    const navigate = useNavigate()

    useEffect(() => {
        setRecordId(props.recordId)
    }, [props.recordId]);

    const recordDataQuery = useQuery<FormInterface, any>([`/forms/${props.formId}/${props.recordId}`],
        () => {
            if(formData == null){
                throw new Error('[recordDataQuery] formData not exist')
            }
            return fetchFormRecord(formData.id, props.recordId)
        },
        {
            enabled: props.recordId != null && formData != null
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

    const createApi = useMutation((input: { data: any, recordState: RecordStateEnum }) => {
        if(formData == null) {
            throw new Error('[createApi] formData not exist')
        }
        return createFormRecord(formData.id, input.data, input.recordState, props.recordType)
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
            if(searchParams.get('redirect') != null){
                navigate(searchParams.get('redirect') ?? '/',  {replace: true})
            }else{
                navigate(`/hype-forms/${formData?.slug}/records/${data.id}`,  {replace: true})
            }
        },
        onSettled: (data, error, variables, context) => {
            toast.dismiss('create')
        },
    })

    const updateApi = useMutation((input: { data: any, recordState: RecordStateEnum }) => {
        if(formData == null){
            throw new Error('[updateApi] formData not exist')
        }
        if(recordId == null){
            throw new Error('[updateApi] update need recordId')
        }
        return updateFormRecord(formData.id, recordId, input.data, input.recordState)
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

    const activeLayout = useMemo(() => {
        if (query.status == 'success') {
            return query.data.layouts.find((l: FormLayoutDataInterface) => l.state === props.layout)
        }
        return null
    }, [query.data, query.status, props.layout])

    const enableDraft = useMemo( () => {
        if(activeLayout != null) {
            return activeLayout.enableDraftMode
        }
        return false
    }, [query])

    useEffect(() => {
        if (query.status == 'success') {
            setFormData(query.data);
            if (activeLayout != null) {
                // setDefaultLayout(activeLayout.layout);
                const layoutItemArr = JSON.parse(activeLayout.layout);
                setLayoutItemList(layoutItemArr);
                setLayoutRoot([...findRootNode(layoutItemArr)]);
            } else {
                console.error('None active layout found.')
            }
        }

    }, [query.data, query.status, props.formMode, activeLayout])

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
                query.isLoading || recordDataQuery.isLoading ?
                    <div className={'d-flex justify-content-center'}>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div> : null
            }
            {
                query.status == 'error' ?
                    <div className={'d-flex justify-content-center'}>
                        <div className="alert alert-danger" role="alert">
                            {query.error.message}
                            <p><b>{query.error.response?.data?.message} on Form</b></p>
                        </div>
                    </div> : null
            }

            {
                recordDataQuery.status == 'error' ?
                    <div className={'d-flex justify-content-center'}>
                        <div className="alert alert-danger" role="alert">
                            {recordDataQuery.error.message}
                            <p><b>{recordDataQuery.error.response?.data?.message} on Record</b></p>
                        </div>
                    </div> : null
            }
            {
                query.status == 'loading' ?
                    <div className={'d-flex justify-content-center'}>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div> : null
            }
            {
                query.status == 'success' ?
                    <>
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

                                    <div className={'d-inline-flex ms-auto'}>
                                        <div className={'align-self-center'}>
                                            {
                                                enableDraft ? <Button
                                                        disabled={recordData['recordState'] == 'ACTIVE'}
                                                        onClick={() => {
                                                            if (recordId == null) {
                                                                createApi.mutate({
                                                                    data: updatedRecordData,
                                                                    recordState:  RecordStateEnum.DRAFT,
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
                                                    : null
                                            }

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
                                </>: null
                        }
                    </> : null
            }

        </FormRecordViewContext.Provider>
    </>
}