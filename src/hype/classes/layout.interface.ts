export interface IAppData {
    "id": number
    "name": string
    "slug": string
    "createdBy": number
    "updatedBy": number
    "deletedBy": number
    "desc": string
    "appType": string
    "iconBlobId": number
    "tags": string
    "createdAt": Date
    "updatedAt": Date
    "deletedAt": Date,
    "permissions": Array<any>,
    "layouts": AppLayoutDataInterface[]
}

export interface LayoutItemInterface {
    id: string;
    type: 'input' | 'decorator' | 'utility' | string;
    children: Array<string>;
    config?: any;
    component?: any;
}


export interface AppLayoutDataInterface {
    id: number;
    applicationId: number;
    iconBlobId: number;
    script: { [key: string]: string };
    state: 'DRAFT' | 'ACTIVE' | string;
    layout: string;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
    createdBy: number;
    updatedBy: number | null;
    deletedBy: number | null;
}

export interface FormLayoutDataInterface {
    id: number;
    formId: number;
    iconBlobId: number;
    script: { [key: string]: string };
    approval: Array<any>;
    enableDraftMode: boolean;
    requireCheckMode: string;
    state: 'DRAFT' | 'ACTIVE' | string;
    layout: string;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
    createdBy: number;
    updatedBy: number | null;
    deletedBy: number | null;
}
