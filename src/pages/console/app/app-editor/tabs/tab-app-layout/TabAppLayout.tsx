import {useCallback, useEffect, useState} from "react";
import useBoundStore from "../../../../../../stores";
import {Button} from "reactstrap";
import {findRootNode} from "../../../../../../libs/util";
import {publishAppLayout, saveAppLayout} from "../../../../../../libs/axios";
import {Plus, X} from "react-feather";
import BoxConfigCanvas from "./BoxConfigCanvas";
import {Card, Form} from "react-bootstrap";
import toast from "react-hot-toast";
import {Link} from "react-router-dom";
import {AppEditorSlice} from "../../../../../../stores/appEditorSlice";
import {FormLayoutDataInterface, LayoutItemInterface} from "../../../../../../hype/classes/layout.interface";
import {AppEditorBox} from "./AppEditorBox";

const TabAppLayout = (props: { layoutDataArr: any }) => {
    const {layoutDataArr} = props;
    const handleCreateCanvasClose = () => appEditorStore.closeBoxConfig;


    const appEditorStore = useBoundStore<AppEditorSlice>(state => state.appEditor)
    const layoutItemList = useBoundStore<Array<LayoutItemInterface>>(state => state.appEditor.layoutItemList)
    const [layoutRoot, setLayoutRoot] = useState<Array<any>>([]);

    const [defaultLayout, setDefaultLayout] = useState<Array<LayoutItemInterface>>();
    const [enableDraftMode, setEnableDraftMode] = useState<boolean>();
    const [requireCheckMode, setRequireCheckMode] = useState<string>();
    const [currentMode, setCurrentMode] = useState<string>('editor');
    const [layoutOptions, setLayoutOptions] = useState<any>();

    useEffect(() => {
        const currentLayout = layoutDataArr.find((l: FormLayoutDataInterface) => l.state === 'DRAFT')
        appEditorStore.setCurrentLayout(currentLayout);
        if (currentLayout != null) {
            setDefaultLayout(currentLayout.layout);
            const layoutItemArr = JSON.parse(currentLayout.layout);
            appEditorStore.setLayoutItemList(layoutItemArr);
            setLayoutOptions(currentLayout.options);
            setEnableDraftMode(currentLayout.enableDraftMode);
            setRequireCheckMode(currentLayout.requireCheckMode);
        } else {
            console.error('should not happen')
        }
    }, [layoutDataArr])

    useEffect(() => {
        setLayoutRoot([...findRootNode(layoutItemList)]);
    }, [layoutItemList])

    const handlePublishLayout = useCallback(async () => {
        if (appEditorStore.currentLayout != null) {
            await toast.promise(
                saveAppLayout(appEditorStore.currentLayout.id, {
                    layout: JSON.stringify(appEditorStore.layoutItemList),
                    script: appEditorStore.layoutScript,
                    options: layoutOptions,
                    enableDraftMode: enableDraftMode,
                    requireCheckMode: requireCheckMode,
                })
                ,
                {
                    loading: 'Saving...',
                    success: <b>App saved!</b>,
                    error: <b>Could not save.</b>,
                },
                {
                    position: "top-right"
                }
            )

            await toast.promise(
                publishAppLayout(appEditorStore.currentLayout.id)
                ,
                {
                    loading: 'Publishing...',
                    success: <b>Published!</b>,
                    error: <b>Could not publish.</b>,
                },
                {
                    position: "top-right"
                }
            )
        }
    }, [publishAppLayout, appEditorStore.layoutScript, appEditorStore.layoutItemList, appEditorStore.currentLayout])

    const handleSaveLayout = useCallback(() => {
        if (appEditorStore.currentLayout != null) {
            toast.promise(
                saveAppLayout(appEditorStore.currentLayout.id, {
                    layout: JSON.stringify(appEditorStore.layoutItemList),
                    script: appEditorStore.layoutScript,
                    options: layoutOptions,
                    enableDraftMode: enableDraftMode,
                    requireCheckMode: requireCheckMode,
                })
                ,
                {
                    loading: 'Saving...',
                    success: <b>App saved!</b>,
                    error: <b>Could not save.</b>,
                },
                {
                    position: "top-right"
                }
            ).then().catch(e => {
                console.error('error toast on handleSaveLayout')
            });
        }
    }, [saveAppLayout, appEditorStore.layoutScript, appEditorStore.layoutItemList, appEditorStore.currentLayout])

    useEffect(() => {
        appEditorStore.changeEditorMode(currentMode)
    }, [currentMode])

    useEffect(() => {
        console.log('layoutItemList', layoutItemList)
    }, [layoutItemList])
    useEffect(() => {
        console.log('layoutRoot', layoutRoot)
    }, [layoutRoot])
    return <>
        <BoxConfigCanvas show={appEditorStore.showBoxConfig}></BoxConfigCanvas>


        <div className={'d-flex gap-3'}>
            <div className={'flex-grow-1'}>
                <>
                    <div className={'flex-grow-1 mb-2 d-flex'}>
                        <Button outline color={'dark'} onClick={() => appEditorStore.createBox('root', {
                            type: 'container',
                            config: {
                                lg: 12,
                                md: 12,
                                sm: 12,
                                xs: 12
                            }
                        })}>Add Container <Plus size={16}/>
                        </Button>


                        {
                            appEditorStore.currentMode == 'move-box' && appEditorStore.currentSelectedBoxId != null ?
                                <Button color={'gradient-danger'}
                                        onClick={() => appEditorStore.selectBoxToMove(null)}>
                                    <X size={16}/> Cancel
                                </Button> : null
                        }
                    </div>
                    <div className={'flex-grow-1'}>
                        {
                            layoutRoot != null && layoutRoot.length > 0 ?
                                <>
                                    {
                                        layoutItemList.filter(d => layoutRoot.indexOf(d.id) > -1).map((data, keyLayout) =>
                                            <AppEditorBox key={keyLayout} path={[keyLayout]}
                                                          boxId={data.id}/>
                                        )
                                    }
                                </> : null
                        }
                    </div>
                </>

            </div>
            <Card style={{maxWidth: 260}}>
                <Card.Body>
                    <Form.Group className={'d-inline ms-auto'}>
                        <Form.Label className={'me-4'}>
                            <b>Editor Mode</b>
                        </Form.Label>
                        <Form.Check
                            type="radio"
                            checked={currentMode == 'editor'}
                            onClick={() => setCurrentMode('editor')}
                            name="mode-switch"
                            id="mode-switch-1"
                            label="Edit Layout"
                        />
                        <Form.Check
                            type="radio"
                            checked={currentMode == 'move-box'}
                            onClick={() => setCurrentMode('move-box')}
                            name="mode-switch"
                            id="mode-switch-3"
                            label="Move Box"
                        />
                        <Form.Check
                            type="radio"
                            checked={currentMode == 'script'}
                            onClick={() => setCurrentMode('script')}
                            name="mode-switch"
                            id="mode-switch-2"
                            label="Layout Script"
                        />
                    </Form.Group>
                    <hr/>
                    <Link target={'_blank'}
                          to={`/console/forms/${appEditorStore.appData?.id}/dev-records/preview`}>
                        <Button className={'w-100 mb-1'} outline={true} color={'dark'} onClick={() => {
                        }}> Preview </Button>
                    </Link>

                    <Button className={'w-100 mb-1'} color={'primary'} onClick={() => {
                        handleSaveLayout();
                    }}> Save </Button>

                    <Button className='w-100 mb-1' color={'success'} onClick={async () => {
                        await handlePublishLayout();
                    }
                    }> Save & Publish </Button>
                    <hr/>
                </Card.Body>
            </Card>
        </div>


    </>

}


export default TabAppLayout;