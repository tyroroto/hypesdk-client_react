import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import useBoundStore from "../../stores";
import {env} from "../../env";
import {getAppDataActive} from "../../libs/api-service";
import {Alert, Button, Spinner} from "react-bootstrap";
import {Edit3} from "react-feather";
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal)
import AppBox from "./AppBox";
import {AbilityContext} from "../contexts/CanContext";


interface IAppViewContext {
    layoutDataList: Array<any>;
    appData: any;
    getBoxData: any;
    getRenderData: (boxId: string) => any;
    mode: string;
    // onActionHandler: (payload: { action: string, boxId: string, slug: string, value: any }) => any;
    getContextVariable: (varName: string | null) => any,
    contextVariableObject: null,
    setContextVariableObject: (payload: any) => any,
    pendingActionList: Array<SendActionParam>;
    revokeAction: (id: number) => void;
}

export const AppViewContext = createContext<IAppViewContext| undefined>(undefined)

interface SendActionParam {
    id?: number;
    appCompSlug: string;
    action: ()=>void;
    params: { [key: string]: any }
}

interface AppViewProps {
    initAppData: any;
    initAppValue: any;
    appId: number;
    appSlug: string;
    onAction: ()=>void;
    mode: 'PREVIEW';
}

interface ActionInput {
    action: string;
    boxId: string;
    slug: string;
    value: any;
}

interface AppData {
    id: number;
    slug: string;

    [key: string]: any;
}

interface LayoutData {
    id: string;

    [key: string]: any;
}

const AppView = ({
                     initAppData,
                     initAppValue,
                     appId,
                     appSlug,
                     onAction,
                     mode = 'PREVIEW'
                 }: AppViewProps) => {
    const authStore = useBoundStore(state => state.auth)
    const navigate = useNavigate();
    const [appData, setAppData] = useState<AppData | null>(null);
    const [appViewData, setAppViewData] = useState<any>({});
    const [layoutRoot, setLayoutRoot] = useState<Array<string>>([]);
    const [scripts, setScripts] = useState<{ [key: string]: ()=>void }>({});
    const [contextVariableObject, setContextVariableObject] = useState<any>({});
    const [layoutDataList, setLayoutDataList] = useState<Array<LayoutData>>([]);
    const [isViewReady, setIsViewReady] = useState(false);
    const [viewHasError, setViewHasError] = useState('');
    const [pendingActionList, setPendingActionList] = useState<Array<SendActionParam>>([]);
    const ability = useContext(AbilityContext)
    const sendAction = useCallback(({appCompSlug, action, params}: SendActionParam) => {
        console.log('sendAction was called', {appCompSlug, action, params})
        setPendingActionList(prev => [
            ...prev, {
                appCompSlug,
                action,
                params,
                id: new Date().getTime() + Math.floor(Math.random() * 1000)
            }
        ])
    }, [pendingActionList, setPendingActionList])

    const isMobileApp = useCallback(() => {
        return env.REACT_APP_PLATFORM === 'MOBILE_APP';
    }, []);

    const hasPermission = useCallback((payload: { id: number, slug: string }) => {
        if( authStore.user == null){
            return false;
        }
        for (const r of authStore.user.roles) {
            for (const p of r.permissions) {
                if (p.id === payload.id || p.slug === payload.slug) {
                    return true;
                }
            }
        }
    }, [authStore.user]);

    const hasRole = useCallback((payload: { id: number, slug: string }) => {
        if( authStore.user == null){
            return false;
        }
        for (const r of authStore.user.roles) {
            if (r.id === payload.id || r.slug === payload.slug) {
                return true;
            }
        }
    }, [authStore.user]);

    const userFnNavigate = useCallback((url: string) => {
        navigate(url, {replace: true});
    }, [navigate])

    const revokeAction = useCallback((id: number) => {
        const newAppActionList = [...pendingActionList]
        newAppActionList.splice(pendingActionList.findIndex(pa => pa.id === id), 1);
        setPendingActionList(newAppActionList);
    }, [pendingActionList, setPendingActionList])

    const getRenderData = useCallback((boxId: string) => {
        const tempBoxData = layoutDataList.find(b => b.id == boxId)
        let tempRecordData = null;
        if (tempBoxData?.component != null) {
            tempRecordData = appViewData[tempBoxData.component.slug]
        }
        return {boxData: tempBoxData, recordData: tempRecordData};
    }, [layoutDataList, appViewData])


    const getContextVariable = useCallback((varName: string | null = null) => {
        // console.log('contextVariableObject', contextVariableObject);
        if (varName == null) {
            return contextVariableObject;
        }
        return contextVariableObject[varName] ?? ''
    }, [contextVariableObject])

    useEffect(() => {
        if (appData != null && appSlug != null) {
            getAppDataActive(appSlug).then(action => {
                if (action.error != null) {
                    // setIsHasError(action.error.message);
                } else {
                    setAppData(action.payload);
                }
            });
        }
    }, [appData, appSlug])

    const getBoxData = useCallback((boxId: string) => {
        const tempBoxData = layoutDataList.find(b => b.id == boxId)
        return tempBoxData;
    }, [layoutDataList])

    useEffect(() => {
        if (appData != null && initAppData != null) {
            setAppData(initAppData)
        }
    }, [initAppData]);

    useEffect(() => {
        if (appId != null) {
            if (appData != null) {
                // console.log('appData', appData.layoutDataList)
                setLayoutDataList(appData.layoutDataList);
                setLayoutRoot(appData.layoutRoot);
                setScripts(appData.scripts);
                setIsViewReady(true);
            }
        }

    }, [appId, appData]);
    return (
        <>
            {
                appData != null ?
                    (
                        <>
                            {
                                ability.can('has', 'administrator') || ability.can('has', 'form_management') ?
                                    <div className={'app-editor-shortcut position-fixed'}
                                         style={{right: 12, zIndex: 99999}}>
                                        <Link to={`/console/app/app-editor/${appId}`}>
                                            <Button size={'sm'} color={'warning'}>
                                                <Edit3 style={{width: 18}}></Edit3>
                                                <label className={'text-white'}>{appData.slug}</label>
                                            </Button>
                                        </Link>
                                    </div>
                                    : null
                            }

                            <AppViewContext.Provider value={
                                {
                                    layoutDataList,
                                    getBoxData,
                                    appData,
                                    mode,
                                    getContextVariable,
                                    getRenderData,
                                    contextVariableObject,
                                    setContextVariableObject,
                                    pendingActionList,
                                    revokeAction
                                }
                            }
                            >
                                {
                                    viewHasError !== '' ?
                                        <>
                                            <Alert color='danger'>
                                                <h4 className='alert-heading'>Error occur</h4>
                                                <div className='alert-body'>
                                                    {viewHasError}
                                                </div>
                                            </Alert>
                                        </>

                                        : null
                                }
                                {
                                    !isViewReady ?
                                        <>
                                            <div className=' mt-3 d-flex justify-content-center my-1'>
                                                <Spinner/>
                                            </div>
                                            <div className={'mb-3 text-center'}> Loading...</div>
                                        </>

                                        : null
                                }
                                {
                                    viewHasError === '' && isViewReady && layoutRoot != null && layoutRoot.length > 0 && layoutDataList != null && layoutDataList.length > 0 ?
                                        <>
                                            {
                                                layoutDataList.filter(d => layoutRoot.indexOf(d.id) > -1).map((data, keyLayout) =>
                                                    <AppBox key={keyLayout} path={[keyLayout]}
                                                            boxValue={''} boxData={data} boxId={data.id}/>
                                                )
                                            }
                                        </> : null
                                }
                            </AppViewContext.Provider>
                        </>
                    ) : null
            }

        </>
    )
}

export default AppView

