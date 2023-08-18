
export enum RecordStateEnum {
    ACTIVE = 'ACTIVE',
    DRAFT = 'DRAFT'
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