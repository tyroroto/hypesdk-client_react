import {RecordStateEnum} from "./constant";

export interface ScriptInterface {
    id: number;
    name: string;
    slug: string;
    tags: string;
    script: string;
    type: string;
    state: RecordStateEnum | string;
    createdBy: number;
    updatedBy: number;
    deletedBy: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    permissions: Array<any>;
}


