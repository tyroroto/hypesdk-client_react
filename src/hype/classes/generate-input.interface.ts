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
export type LayoutComponentType = 'label' | 'container' | 'divider' | 'button' | 'datatable-form' | 'checkbox'


export interface LayoutComponentInterface {
    layoutType: LayoutComponentLayoutType;
    type: LayoutComponentType;
    slug: string;
    value: string;
    label: string;
}

