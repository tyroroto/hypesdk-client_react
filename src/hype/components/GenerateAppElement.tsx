import {useCallback} from "react";
import {LayoutComponentInterface} from "../classes/generate-input.interface";
import {DatatableForm} from "../app-components/DatatableForm";
import {AppModeType} from "../../libs/util";
import {IAppBoxConfig} from "../../pages/console/app/app-editor/tabs/tab-app-layout/BoxConfigCanvas";

const GenerateAppElement = (props: {
    appSlug: string,
    mode: AppModeType,
    layoutComponent: LayoutComponentInterface,
    config: IAppBoxConfig,
    expression?: { [key: string]: string },
    emitAction: (action: string, value: any, slug?: any) => any
}) => {
    const {config, appSlug, layoutComponent} = props;

    const mapCss = useCallback((option: any, css?: any, type = '', ignore: Array<string> = []) => {
        const style = css ? css : {};
        if (option?.align && (option?.align === 'center' || option?.align === 'right')) {
            if (type !== 'button') {
                style.width = '100%';
            }
            style.textAlign = option.align;
        }
        if (ignore.indexOf('fontSize') == -1) {
            if (option?.fontSize) {
                style.fontSize = parseInt(option.fontSize);
            } else {
                style.fontSize = 16;
            }
        }

        if (option?.bold) {
            style.fontWeight = 'bold';
        }
        if (option?.italic) {
            style.fontStyle = 'italic';
        }
        if (option?.underline) {
            style.textDecoration = 'underline';
        }
        return style;
    }, [])

    const renderFunc = useCallback(() => {
        switch (props.layoutComponent.type) {
            case 'label':
                return (
                    <div className={config.options?.hide ? 'd-none' : ''}
                         id={`div-${appSlug}-${layoutComponent.slug}`}>
                        {
                            config.options.configLabel?.tag == 'h1' ?
                                <h1 id={config.htmlId}
                                    style={mapCss(config.options?.configLabel, {}, '', ['fontSize'])}
                                >
                                    {config.label}
                                </h1>
                                : null
                        }
                        {
                            config.options.configLabel?.tag == 'h2' ?
                                <h2 id={config.htmlId}
                                    style={mapCss(config.options?.configLabel, {}, '', ['fontSize'])}
                                >
                                    {config.label}
                                </h2>
                                : null
                        }
                        {
                            config.options.configLabel?.tag == 'h3' ?
                                <h3 id={config.htmlId}
                                    style={mapCss(config.options?.configLabel, {}, '', ['fontSize'])}
                                >
                                    {config.label}
                                </h3>
                                : null
                        }
                        {
                            config.options.configLabel?.tag == 'h4' ?
                                <h4 id={config.htmlId}
                                    style={mapCss(config.options?.configLabel, {}, '', ['fontSize'])}
                                >
                                    {config.label}
                                </h4>
                                : null
                        }
                        {
                            config.options.configLabel?.tag == 'h5' ?
                                <h5 id={config.htmlId}
                                    style={mapCss(config.options?.configLabel, {}, '', ['fontSize'])}
                                >
                                    {config.label}
                                </h5>
                                : null
                        }
                        {
                            config.options.configLabel?.tag == 'h6' ?
                                <h6 id={config.htmlId}
                                    style={mapCss(config.options?.configLabel, {}, '', ['fontSize'])}
                                >
                                    {config.label}
                                </h6>
                                : null
                        }
                        {
                            config.options.configLabel?.tag == 'div' ?
                                <label id={config.htmlId}
                                       style={mapCss(config.options?.configLabel)}>{config.label}</label>
                                : null
                        }

                        {
                            config.options.configLabel == null ?
                                <label id={config.htmlId}
                                >{config.label}
                                </label>
                                : null
                        }
                    </div>
                )
            case 'datatable-form':
                return <>
                    <DatatableForm
                        mode={props.mode}
                        formId={props.config.options.formId}/>
                </>
        }
    }, [props]);
    return <>{renderFunc()}</>
}

export default GenerateAppElement;
