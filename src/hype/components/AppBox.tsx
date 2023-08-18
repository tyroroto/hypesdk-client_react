import {useCallback, useContext, useEffect, useState} from "react";

// ** Styles
import 'react-contexify/dist/ReactContexify.min.css'
// import '@styles/react/libs/context-menu/context-menu.scss'
// import GenerateAppComponent from "./GenerateAppComponent";
import AppView, {AppViewContext} from "./AppView";
import {Card, Col, Container, Row} from "react-bootstrap";
import GenerateAppElement from "./GenerateAppComponent";
// import {useSkin} from "@hooks/useSkin";


const AppBox = (props: { boxId: string, boxData: any, boxValue: any, path: Array<number> }) => {
    // ** Hooks
    // const { skin } = useSkin()

    // const classDark = skin === 'dark' ? 'dark-layout' : '';
    const {boxId, boxData, boxValue, path} = props;
    const classDark = 'dark-layout';
    const appViewContext = useContext(AppViewContext);
    const [inputValue, setInputValue] = useState('');
    const parseConfigStyle = (config: { style: string }) => {
        try {
            const style = config.style ? JSON.parse(config.style) : {};
            return {...style};
        } catch (e) {
            console.error('ERROR ON parse style', config)
        }
        return {};
    };

    return (
        <>
            {
                appViewContext != null && boxData != null ? (
                    <>
                        {
                            boxData.type === 'container' ? (<Container fluid={boxData.config?.fluid} id={`e_${boxId}`}
                                                                       className={`app-container ${classDark} ${boxData.config?.isCard ? 'app-container-card' : ''} ${boxData.config?.classname ?? ''}`}
                                                                       style={{}}>
                                {
                                    boxData.children != null && boxData.children.map((boxId: string, k: number) => {
                                        const renderData = appViewContext.getRenderData(boxId)
                                        return <AppBox boxData={renderData.boxData} boxValue={renderData.boxValue}
                                                       path={[...path, k]} boxId={boxId} key={k}/>
                                    })
                                }

                            </Container>) : null
                        }

                        {
                            boxData.type === 'row' ? (
                                <Row className={`${boxData.config?.classname ?? ''}`}
                                     id={boxId}
                                     style={{padding: 4, minHeight: 32, ...parseConfigStyle(boxData.config)}}>
                                    {
                                        boxData.children != null && boxData.children.map((boxId: string, k: number) => {
                                            const renderData = appViewContext.getRenderData(boxId)
                                            return <AppBox boxData={renderData.boxData} boxValue={renderData.boxValue}
                                                           path={[...path, k]} boxId={boxId} key={k}/>
                                        })
                                    }
                                </Row>
                            ) : null
                        }

                        {
                            boxData.type === 'card' ? (
                                <Card className={boxData.config?.classname ?? ''} id={boxId}>
                                    {
                                        boxData.children != null && boxData.children.map((boxId: string, k: number) => {
                                            const renderData = appViewContext.getRenderData(boxId)
                                            return <AppBox boxData={renderData.boxData} boxValue={renderData.boxValue}
                                                           path={[...path, k]} boxId={boxId} key={k}/>
                                        })
                                    }
                                </Card>
                            ) : null
                        }

                        {
                            boxData.type === 'col' ? (
                                <Col style={{minHeight: 32}}
                                     className={`app-col ${boxData.config?.grow ? 'flex-grow-1' : ''}`}
                                     id={boxId}
                                     sm={boxData.config?.sm ?? 12}
                                     lg={boxData.config?.lg ?? 12}>
                                    <div className={`d-block ${boxData.config.classname ?? ''}`}>
                                        {
                                            boxData.children.map((boxId: string, k: number) => {
                                                const renderData = appViewContext.getRenderData(boxId)
                                                return <AppBox boxData={renderData.boxData}
                                                               boxValue={renderData.boxValue}
                                                               path={[...path, k]} boxId={boxId} key={k}/>
                                            })
                                        }
                                    </div>
                                </Col>
                            ) : null
                        }

                        {
                            boxData.type === 'input' || boxData.type === 'decorator' || boxData.type === 'utility' ? (
                                <>
                                    <div
                                        className={`d-inline-block position-relative ${boxData.config?.classname ?? 'w-auto'}`}
                                        style={parseConfigStyle(boxData.config)}>
                                        {/*<GenerateAppComponent*/}
                                        {/*    appSlug={appViewContext.appData.slug}*/}
                                        {/*    mode={'NORMAL'}*/}
                                        {/*    formSlug={appViewContext.appData.slug}*/}
                                        {/*    inputValue={inputValue}*/}
                                        {/*    layoutComponent={boxData.component}*/}
                                        {/*    config={boxData.config}*/}
                                        {/*    emitAction={(action: string, value: any, slug: string) => {*/}
                                        {/*        // appViewContext.onActionHandler({*/}
                                        {/*        //     action,*/}
                                        {/*        //     boxId,*/}
                                        {/*        //     value,*/}
                                        {/*        //     meta: event,*/}
                                        {/*        //     slug: slug ? slug : boxData.config.slug*/}
                                        {/*        // })*/}
                                        {/*        return null*/}
                                        {/*    }*/}
                                        {/*    }/>*/}
                                        {/*</GenerateAppComponent>*/}
                                    </div>
                                </>


                            ) : null
                        }
                    </>
                ) : null
            }

        </>
    );
}

export default AppBox
