import {useEffect} from "react";
import {Container} from "react-bootstrap";
import {CornerDownLeft, Move, Plus, Settings, X} from "react-feather";
import {Badge, Col, Row, UncontrolledTooltip} from "reactstrap";
import {Item, Menu, useContextMenu} from "react-contexify";
import useBoundStore from "../../../../../stores";
import "react-contexify/dist/ReactContexify.css";
import GenerateFormComponentElem from "../../../../../hype/components/GenerateFormComponentElem";

export const INPUT_RENDER_MODE = {
    EDITOR: 'EDITOR',
    NORMAL: 'NORMAL',
    READONLY: 'READONLY',
}
export const FormEditorBox = (props: { boxId: string, path: Array<number> }) => {
    const {boxId, path} = props;
    const store = useBoundStore(state => state.formEditor)
    const boxData = useBoundStore(state => {
        return state.formEditor.layoutItemList.find(d => d.id == boxId)
    })

    // const [boxData, setBoxData] = useState<LayoutItemInterface>();
    const {show} = useContextMenu({id: `menu_left_${boxId}`})

    useEffect(() => {
        console.log('boxId', boxId)
    }, [boxId])
    return <>
        {
            boxData != null ? (
                <>
                    {
                        boxData.type === 'container' ? (<Container id={`e_${boxId}`} style={{
                            marginBottom: 2,
                            minHeight: 32,
                            border: '2px dashed #9747FF',
                            borderRadius: 5,
                            // boxShadow: 'inset 0px 0px 0px 3px #0000ff4d'
                        }}>
                            <div style={{position: 'relative'}}>
                                <div
                                    style={{zIndex: 1000, position: 'absolute', width: 70, right: -40, top: -25}}>
                                    <div className={'text-end'}>
                                        {
                                            (store.currentMode == 'move-box') && store.currentSelectedBoxId != null
                                            && store.currentSelectedBox?.type === 'row'
                                            && store.currentSelectedBox.type !== 'container'
                                            && store.currentSelectedBoxId != boxId ?
                                                (
                                                    <div className={'position-absolute'}
                                                         style={{right: 0, top: '50%'}}>
                                                        <Badge
                                                            id={`badge_move_to_${boxId}`}
                                                            onClick={() => {
                                                                store.moveCurrentBoxTo(
                                                                    boxId,
                                                                    'last'
                                                                )
                                                            }}
                                                            color='dark' pill>
                                                            <CornerDownLeft size={16}/>
                                                        </Badge>

                                                        <UncontrolledTooltip placement='top'
                                                                             target={`badge_move_to_${boxId}`}>
                                                            move to this container
                                                        </UncontrolledTooltip>
                                                    </div>
                                                ) : null
                                        }
                                        {
                                            (store.currentMode == 'move-box')
                                            && store.currentSelectedBox != null
                                            && store.currentSelectedBox.type === 'container'
                                            && store.currentSelectedBoxId !== boxId ?
                                                (
                                                    <div className={'position-absolute'}
                                                         style={{right: 0, top: '50%'}}>
                                                        <Badge
                                                            id={`badge_move_to_${boxId}`}
                                                            onClick={(e) => {show({
                                                                event: e,
                                                            })}}
                                                            color='dark' pill>
                                                            <CornerDownLeft size={16}/>
                                                        </Badge>
                                                        <UncontrolledTooltip placement='top'
                                                                             target={`badge_move_to_${boxId}`}>
                                                            insert container here
                                                        </UncontrolledTooltip>
                                                        <Menu id={`menu_left_${boxId}`}>
                                                            <Item onClick={() => store.moveCurrentBoxTo(
                                                                boxId,
                                                                'before'
                                                            )}>Insert Before</Item>
                                                            <Item onClick={() => {
                                                                store.moveCurrentBoxTo(
                                                                    boxId,
                                                                    'after'
                                                                )
                                                            }}>Insert After</Item>
                                                        </Menu>
                                                    </div>
                                                ) : null
                                        }
                                        {
                                            (store.currentMode == 'move-box') && store.currentSelectedBoxId == boxId ?
                                                <Badge
                                                    onClick={() => {
                                                        store.selectBoxToMove(null)
                                                    }}
                                                    className='handle'
                                                    color='danger' pill>
                                                    <X size={16}/>
                                                </Badge> : null
                                        }
                                        {
                                            (store.currentMode == 'move-box') && store.currentSelectedBoxId == null ?
                                                <>
                                                    <Badge
                                                        id={`badge_selectmove_${boxId}`}
                                                        onClick={() => {
                                                            store.selectBoxToMove(boxId)
                                                        }}
                                                        className='handle'
                                                        color='success' pill>
                                                        <Move size={16}/>
                                                    </Badge>
                                                    <UncontrolledTooltip placement='top'
                                                                         target={`badge_selectmove_${boxId}`}>
                                                        select this container
                                                    </UncontrolledTooltip>
                                                </>
                                                : null
                                        }
                                        {
                                            !(store.currentMode == 'move-box') ?
                                                <>
                                                    <Badge
                                                        className={'me-1'}
                                                        id={`badge_setting_${boxId}`}
                                                        onClick={() => {
                                                            store.openBoxConfig(boxId)
                                                        }}
                                                        color='primary' pill>
                                                        <Settings size={16}/>
                                                    </Badge>
                                                    <UncontrolledTooltip placement='top'
                                                                         target={`badge_setting_${boxId}`}>
                                                        setting this container.
                                                    </UncontrolledTooltip>
                                                    <Badge
                                                        id={`badge_create_${boxId}`}
                                                        onClick={() => {
                                                            store.createBox(boxId, {
                                                                type: 'row',
                                                                config: {
                                                                    lg: 12,
                                                                    md: 12,
                                                                    sm: 12,
                                                                    xs: 12,
                                                                }
                                                            })
                                                        }} color='success' pill>
                                                        <Plus size={16}/>
                                                        {/*<span className='align-middle ms-50'>add col</span>*/}
                                                    </Badge>
                                                    <UncontrolledTooltip placement='top'
                                                                         target={`badge_create_${boxId}`}>
                                                        Add row to this container
                                                    </UncontrolledTooltip>
                                                </> : null
                                        }
                                    </div>
                                </div>
                            </div>

                            {
                                boxData.children != null && boxData.children.map((boxId, k) => {
                                    return <FormEditorBox path={[...path, k]} boxId={boxId} key={k}/>
                                })
                            }
                        </Container>) : null
                    }

                    {
                        boxData.type === 'row' ? (
                            <Row className={'mt-1 mb-1'}
                                 style={{
                                     padding: 4, minHeight: 32,
                                     border: '1px solid #f006',
                                     borderRadius: 5,
                                     // boxShadow: 'inset 0px 0px 0px 3px #f006'
                                 }
                                 }>
                                <div style={{position: 'relative'}}>
                                    <div style={{position: 'absolute', width: 70, right: 0, top: -5}}>
                                        <div className={'text-end'}>

                                            {
                                                (store.currentMode == 'move-box') && store.currentSelectedBoxId == null ?
                                                    <>
                                                        <Badge
                                                            id={`badge_selectmove_${boxId}`}
                                                            onClick={() => {
                                                                store.selectBoxToMove(boxId)
                                                            }}
                                                            className='handle'
                                                            color='success' pill>
                                                            <Move size={16}/>
                                                        </Badge>
                                                        <UncontrolledTooltip placement='top'
                                                                             target={`badge_selectmove_${boxId}`}>
                                                            move this row
                                                        </UncontrolledTooltip>
                                                    </>
                                                    : null
                                            }

                                            {
                                                (store.currentMode == 'move-box')
                                                && store.currentSelectedBoxId != null
                                                && store.currentSelectedBox.type !== 'container'
                                                && store.currentSelectedBox.type === 'col' ?
                                                    <>
                                                        <Badge
                                                            id={`badge_move_to_${boxId}`}
                                                            onClick={() => {
                                                                store.moveCurrentBoxTo(
                                                                    boxId,
                                                                    'last'
                                                                )
                                                            }}
                                                            color='dark' pill>
                                                            <CornerDownLeft size={16}/>
                                                        </Badge>
                                                        <UncontrolledTooltip placement='top'
                                                                             target={`badge_move_to_${boxId}`}>
                                                            move to this row
                                                        </UncontrolledTooltip>
                                                    </>
                                                    : null
                                            }

                                            {
                                                (store.currentMode == 'move-box')
                                                && store.currentSelectedBox?.type === 'row'
                                                && store.currentSelectedBoxId != null
                                                && store.currentSelectedBoxId != boxId ?
                                                    (

                                                        <div className={'position-absolute'}
                                                             style={{right: 0, top: '50%'}}>
                                                            <Badge
                                                                id={`badge_move_to_${boxId}`}
                                                                onClick={(e) => {show({
                                                                    event: e,
                                                                })}}
                                                                color='dark' pill>
                                                                <CornerDownLeft size={16}/>
                                                            </Badge>
                                                            <UncontrolledTooltip placement='top'
                                                                                 target={`badge_move_to_${boxId}`}>
                                                                insert here1
                                                            </UncontrolledTooltip>
                                                            <Menu id={`menu_left_${boxId}`}>
                                                                <Item onClick={() => store.moveCurrentBoxTo(
                                                                    boxId,
                                                                    'before'
                                                                )}>Insert Before</Item>
                                                                <Item onClick={() => {
                                                                    store.moveCurrentBoxTo(
                                                                        boxId,
                                                                        'after'
                                                                    )
                                                                }}>Insert After</Item>
                                                            </Menu>
                                                        </div>
                                                    ) : null
                                            }

                                            {
                                                !(store.currentMode == 'move-box') ?
                                                    <>
                                                        <Badge
                                                            className={'me-1'}
                                                            id={`badge_setting_${boxId}`}
                                                            onClick={() => {
                                                                store.openBoxConfig(boxId)
                                                            }}
                                                            color='primary' pill>
                                                            <Settings size={16}/>
                                                        </Badge>
                                                        <UncontrolledTooltip placement='top'
                                                                             target={`badge_setting_${boxId}`}>
                                                            setting this row.
                                                        </UncontrolledTooltip>

                                                        <Badge
                                                            id={`badge_create_${boxId}`}
                                                            onClick={() => {
                                                                store.createBox(boxId, {
                                                                    type: 'col',
                                                                    config: {
                                                                        lg: 6,
                                                                        md: 6,
                                                                        sm: 12,
                                                                        xs: 12
                                                                    }
                                                                })
                                                            }} color='success' pill>
                                                            <Plus size={16}/>
                                                            {/*<span className='align-middle ms-50'>add col</span>*/}
                                                        </Badge>
                                                        <UncontrolledTooltip placement='top'
                                                                             target={`badge_create_${boxId}`}>
                                                            Add col to this row
                                                        </UncontrolledTooltip>
                                                    </> : null
                                            }
                                        </div>
                                    </div>
                                </div>

                                {
                                    boxData.children != null && boxData.children.map((boxId, k) => {
                                        return <FormEditorBox path={[...path, k]} boxId={boxId} key={k}/>
                                    })
                                }
                            </Row>
                        ) : null
                    }

                    {
                        boxData.type === 'col' ? (
                            <Col style={{minHeight: 32,
                                border: '3px inset',
                                borderColor: 'rgba(15,79,6,0.33)',
                                marginBottom: 2,
                                marginTop: 2,
                                borderRadius: 5,
                                // boxShadow: 'inset 0px 0px 0px 3px green'
                            }}
                                 className={boxData.config?.grow ? 'flex-grow-1' : ''}
                                 sm={boxData.config?.sm ?? 12}
                                 lg={boxData.config?.lg ?? 12}>
                                <div style={{position: 'relative'}}>
                                    <div
                                        style={{zIndex: 1000, position: 'absolute', width: 70, right: 20, top: 5}}>
                                        <div className={'text-end'}>

                                            {
                                                (store.currentMode == 'move-box')
                                                && store.currentSelectedBox?.type === 'col'
                                                && store.currentSelectedBoxId != null
                                                && store.currentSelectedBoxId != boxId ?
                                                    (

                                                        <div className={'position-absolute'}
                                                             style={{right: 0, top: '50%'}}>
                                                            <Badge
                                                                id={`badge_move_to_${boxId}`}
                                                                onClick={(e) => {show({
                                                                    event: e,
                                                                })}}
                                                                color='dark' pill>
                                                                <CornerDownLeft size={16}/>
                                                            </Badge>
                                                            <UncontrolledTooltip placement='top'
                                                                                 target={`badge_move_to_${boxId}`}>
                                                                insert here2
                                                            </UncontrolledTooltip>
                                                            <Menu id={`menu_left_${boxId}`}>
                                                                <Item onClick={() => store.moveCurrentBoxTo(
                                                                    boxId,
                                                                    'before'
                                                                )}>Insert Before</Item>
                                                                <Item onClick={() => {
                                                                    store.moveCurrentBoxTo(
                                                                        boxId,
                                                                        'after'
                                                                    )
                                                                }}>Insert After</Item>
                                                            </Menu>
                                                        </div>
                                                    ) : null
                                            }

                                            {
                                                (store.currentMode == 'move-box')
                                                && store.currentSelectedBoxId != null
                                                && store.currentSelectedBox.type !== 'container'
                                                && store.currentSelectedBox?.type !== 'col'
                                                    ?
                                                    <>
                                                        <Badge
                                                            id={`badge_move_to_${boxId}`}
                                                            onClick={() => {
                                                                store.moveCurrentBoxTo(
                                                                    boxId,
                                                                    'last'
                                                                )
                                                            }}
                                                            color='dark' pill>
                                                            <CornerDownLeft size={16}/>
                                                        </Badge>
                                                        <UncontrolledTooltip placement='top'
                                                                             target={`badge_move_to_${boxId}`}>
                                                            move to this col
                                                        </UncontrolledTooltip>
                                                    </> : null
                                            }
                                            {
                                                (store.currentMode == 'move-box') && store.currentSelectedBoxId == boxId ?
                                                    <Badge
                                                        onClick={() => {
                                                            store.selectBoxToMove(null)
                                                        }}
                                                        className='handle'
                                                        color='danger' pill>
                                                        <X size={16}/>
                                                    </Badge> : null
                                            }
                                            {
                                                (store.currentMode == 'move-box') && store.currentSelectedBoxId == null ?
                                                    <>
                                                        <Badge
                                                            id={`badge_selectmove_${boxId}`}
                                                            onClick={() => {
                                                                store.selectBoxToMove(boxId)
                                                            }}
                                                            className='handle'
                                                            color='success' pill>
                                                            <Move size={16}/>
                                                        </Badge>
                                                        <UncontrolledTooltip placement='top'
                                                                             target={`badge_selectmove_${boxId}`}>
                                                            select this col
                                                        </UncontrolledTooltip>
                                                    </>
                                                    : null
                                            }
                                            {
                                                !(store.currentMode == 'move-box') ?
                                                    <>
                                                        <Badge
                                                            className={'me-1'}
                                                            id={`badge_setting_${boxId}`}
                                                            onClick={() => {
                                                                store.openBoxConfig(boxId)
                                                            }}
                                                            color='primary' pill>
                                                            <Settings size={16}/>
                                                        </Badge>
                                                        <UncontrolledTooltip placement='top'
                                                                             target={`badge_setting_${boxId}`}>
                                                            setting this col.
                                                        </UncontrolledTooltip>
                                                        <Badge
                                                            id={`badge_create_${boxId}`}
                                                            onClick={() => {
                                                                store.openBoxConfig(boxId,
                                                                    'new'
                                                                );
                                                            }} color='success' pill>
                                                            <Plus size={16}/>
                                                            {/*<span className='align-middle ms-50'>add group</span>*/}
                                                        </Badge>
                                                        <UncontrolledTooltip placement='top'
                                                                             target={`badge_create_${boxId}`}>
                                                            Add component to this col
                                                        </UncontrolledTooltip>
                                                    </> : null
                                            }
                                        </div>
                                    </div>
                                </div>
                                {
                                    boxData.children.map((boxId, k) => {
                                        return <FormEditorBox path={[...path, k]} boxId={boxId} key={k}/>
                                    })
                                }
                            </Col>
                        ) : null
                    }

                    {
                        boxData.type === 'input' || boxData.type === 'decorator' || boxData.type === 'utility' ? (
                            <div className={'position-relative'}>
                                <div>
                                    <GenerateFormComponentElem
                                        formSlug={store.formData.slug}
                                        formComponent={store.formData.fields.find((c: any) => c.slug === boxData.component.slug)}
                                        layoutComponent={boxData.component}
                                        config={boxData.config}
                                        mode={INPUT_RENDER_MODE.EDITOR}
                                        onChange={(event: string, value: any) => console.log('onChange', event, value)}
                                        onAction={(event: string, value: any) => console.log('onAction', event, value)}

                                    />
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: -30
                                }}>
                                    {
                                        store.currentMode == 'move-box'
                                        && store.currentSelectedBoxId != null
                                        && store.currentSelectedBoxId != boxId
                                        && store.currentSelectedBox.type !== 'container'
                                        && store.currentSelectedBox.type !== 'col'
                                            // && store.currentSelectedBox.children[0] !== boxData.id
                                            ?
                                            (

                                                <div className={'position-absolute'} style={{right: 0, top: '50%'}}>
                                                    <Badge
                                                        id={`badge_move_to_${boxId}`}
                                                        onClick={(e) => {show({
                                                            event: e,
                                                        })}}
                                                        color='dark' pill>
                                                        <CornerDownLeft size={16}/>
                                                    </Badge>
                                                    <UncontrolledTooltip placement='top'
                                                                         target={`badge_move_to_${boxId}`}>
                                                        insert here
                                                    </UncontrolledTooltip>
                                                    <Menu id={`menu_left_${boxId}`}>
                                                        <Item onClick={() =>
                                                            store.moveCurrentBoxTo(
                                                                boxId,
                                                                'before'
                                                            )
                                                        }>Insert Before</Item>
                                                        <Item onClick={() => {
                                                            store.moveCurrentBoxTo(
                                                                boxId,
                                                                'after'
                                                            )
                                                        }}>Insert After</Item>
                                                    </Menu>
                                                </div>
                                            ) : null
                                    }
                                    {
                                        store.currentMode == 'move-box' && store.currentSelectedBoxId == boxId ?
                                            <Badge
                                                onClick={() => {
                                                    store.selectBoxToMove(null);
                                                }}
                                                className='handle'
                                                color='danger' pill>
                                                <X size={16}/>
                                            </Badge> : null
                                    }
                                    {
                                        store.currentMode == 'move-box' && store.currentSelectedBoxId == null ?
                                            <Badge
                                                id={`badge_selectmove_${boxId}`}
                                                onClick={() => {
                                                    store.selectBoxToMove(boxId)
                                                }}
                                                className='handle'
                                                color='dark' pill>
                                                <Move size={16}/>
                                                <UncontrolledTooltip placement='top'
                                                                     target={`badge_selectmove_${boxId}`}>
                                                    move this item
                                                </UncontrolledTooltip>
                                            </Badge> : null
                                    }
                                    {
                                        !(store.currentMode == 'move-box') ?
                                            <Badge
                                                id={`badge_setting_${boxId}`}
                                                onClick={() => {
                                                    console.log('boxId', boxId);
                                                    store.openBoxConfig(boxId)
                                                }}
                                                color='primary' pill>
                                                <Settings size={16}/>
                                                <UncontrolledTooltip placement='top'
                                                                     target={`badge_setting_${boxId}`}>
                                                    setting this comp.
                                                </UncontrolledTooltip>
                                            </Badge> : null
                                    }
                                </div>
                            </div>
                        ) : null
                    }
                </>
            ) : null
        }
    </>
}