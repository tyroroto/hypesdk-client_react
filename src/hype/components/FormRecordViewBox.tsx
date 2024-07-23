import {useContext, useEffect, useState} from "react";
import {Container} from "react-bootstrap";
import {Col, Row} from "reactstrap";
import {FormRecordViewContext} from "./FormRecordView";
import GenerateFormComponentElem from "./GenerateFormComponentElem";
import {LayoutItemInterface} from "../classes/layout.interface";

export const INPUT_RENDER_MODE = {
    EDITOR: 'EDITOR',
    NORMAL: 'NORMAL',
    READONLY: 'READONLY',
}
export const FormRecordViewBox = (props: { boxId: string, path: Array<number> }) => {
    const {boxId, path} = props;
    const formRecordViewContext = useContext(FormRecordViewContext);
    // const [boxData, setBoxData] = useState<any>();
    const [boxData, setBoxData] = useState<LayoutItemInterface>();

    useEffect(() => {
        if (formRecordViewContext != null) {
            const box = formRecordViewContext.layoutItemList.find(d => d.id == boxId)
            setBoxData(box);
        }
    }, [formRecordViewContext, boxId])
    return <>
        {
            formRecordViewContext != null && boxData != null ? (
                <>
                    {
                        boxData.type === 'container' ? (<Container id={`e_${boxId}`} style={{
                            minHeight: 32,
                        }}>
                            {
                                boxData.children != null && boxData.children.map((boxId: string, k: number) => {
                                    return <FormRecordViewBox path={[...path, k]} boxId={boxId} key={k}/>
                                })
                            }
                        </Container>) : null
                    }

                    {
                        boxData.type === 'row' ? (
                            <Row className={'mt-1 mb-1'}
                                 style={{padding: 4, minHeight: 32}}>
                                {
                                    boxData.children != null && boxData.children.map((boxId: string, k: number) => {
                                        return <FormRecordViewBox path={[...path, k]} boxId={boxId} key={k}/>
                                    })
                                }
                            </Row>
                        ) : null
                    }

                    {
                        boxData.type === 'col' ? (
                            <Col style={{minHeight: 32}}
                                 className={boxData.config?.grow ? 'flex-grow-1' : ''}
                                 sm={boxData.config?.sm ?? 12}
                                 lg={boxData.config?.lg ?? 12}>
                                {
                                    boxData.children?.map((boxId: string, k: number) => {
                                        return <FormRecordViewBox path={[...path, k]} boxId={boxId} key={k}/>
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
                                        formSlug={formRecordViewContext.formData.slug}
                                        formComponent={formRecordViewContext.formData.fields.find((c: any) => c.slug === boxData.component.slug)}
                                        layoutComponent={boxData.component}
                                        config={boxData.config}
                                        inputValue={formRecordViewContext.recordData[boxData.component.slug] }
                                        mode={INPUT_RENDER_MODE.EDITOR}
                                        onChange={(event: any, value: any) => {
                                            console.log('onChange', event, value)
                                            formRecordViewContext?.onBoxValueChange(
                                                { event: event, boxId: boxData?.id, boxData: boxData, slug: boxData.component.slug, value: value }
                                            );
                                        }}
                                        onAction={(event: any, value: any) => console.log('onAction', event, value)}
                                    />

                                </div>
                            </div>
                        ) : null
                    }
                </>
            ) : null
        }
    </>
}