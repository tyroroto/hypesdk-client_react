
export type RecordStateType ='ACTIVE' | 'DRAFT';
export enum RecordStateEnum {
    ACTIVE = 'ACTIVE' ,
    DRAFT = 'DRAFT',
}

export type FormModeType = 'NORMAL' | 'PREVIEW' | 'READONLY'
export enum FormModeEnum {
    NORMAL = 'NORMAL',
    PREVIEW = 'PREVIEW',
    READONLY = 'READONLY'
}
export enum RecordTypeEnum {
    DEV = 'DEV',
    PROD = 'PROD'
}

export type EditorModeType = 'editor' | 'move-box';

export enum EditorModeEnum {
    Editor = 'editor',
    Move = 'move-box',
}

export type FormActionType = 'new'|'edit';

export enum FormActionEnum {
    EDIT = 'edit',
    NEW = 'new',
}
export enum EditorBoxPosition {
    First = 'first',
    Before = 'before',
    After = 'after' ,
    Last = 'last'
}

export type PermissionGrantType = 'ACCESS_FORM' | 'READ_ONLY' | 'READ_EDIT' | 'READ_EDIT_DELETE';
export enum PermissionGrantEnum {
    ACCESS_FORM = 'ACCESS_FORM',
    READ_ONLY = 'READ_ONLY',
    READ_EDIT = 'READ_EDIT',
    READ_EDIT_DELETE = 'READ_EDIT_DELETE',
}