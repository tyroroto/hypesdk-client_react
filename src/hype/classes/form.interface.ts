import {RecordStateEnum} from "./constant";

export interface FormInterface {
    id: number;
    name: string;
    slug: string;
    desc: string;
    tags: string;
    state: RecordStateEnum | string;
    scripts: object;
    createdBy: number;
    updatedBy: number;
    deletedBy: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    fields: Array<any>;
    relations: Array<any>;
    permissions: Array<any>;
    layouts: Array<any>;
}


