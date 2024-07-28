export interface BaseGenerateInputInterface {
    inputValue: any,
    requireInput?: any,
    onChange: (event: any, value: any) => void,
    customStyle: object,
    formSlug?: string,
    children?: any,
    mode: string,
    config: {
        placeholder?: string ,
        options: any
    },
    layoutComponent: any
}

export type LayoutComponentLayoutType = 'input' | 'decorator' | 'utility';
export type LayoutComponentType = 'label' | 'container' | 'divider'
    | 'button' | 'datatable-form' | 'checkbox' | 'text-input' | 'text-area'
    | 'radio' | 'select' | 'date-picker' | 'time-picker' | 'date-time-picker' | 'file-upload'
    | 'number-input' | 'float-input' | 'select-string' | 'date' | 'datetime' | 'time'


export interface LayoutComponentInterface {
    layoutType: LayoutComponentLayoutType;
    type: LayoutComponentType;
    slug: string;
    value: string;
    label: string;
}

