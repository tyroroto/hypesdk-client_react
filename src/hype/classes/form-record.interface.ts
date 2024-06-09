export interface IFormRecord {
    createdAt: string;
    createdBy: number;
    createdByUser: string;
    deletedAt: string | null;
    deletedBy: number | null;
    errors: string | null;
    recordState: string;
    recordType: string;
    updatedAt: string;
    updatedBy: number;
    id: number;
}
