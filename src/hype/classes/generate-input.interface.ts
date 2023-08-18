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

export interface LayoutComponentInterface {
    layoutType: 'input' | 'decorator' | 'utility';
    type: string;
    slug: string;
    value: string;
    label: string;
}

