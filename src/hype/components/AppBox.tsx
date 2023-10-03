import {useContext, useState} from "react";

// ** Styles
import {AppViewContext} from "./AppView";
import {Card, Col, Container, Row} from "react-bootstrap";
import GenerateAppComponent from "./GenerateAppElement";
import {AppModeType} from "../../libs/util";


const AppBox = (props: { boxId: string, boxData: any, boxValue: any, path: Array<number> }) => {
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
                                        <GenerateAppComponent
                                            appSlug={appViewContext.appData.slug}
                                            layoutComponent={boxData.component}
                                            config={boxData.config}
                                            mode={AppModeType.NORMAL}
                                            emitAction={(event: string, value: any, slug?: any) => console.log('onAction', event, value)}
                                        />
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
