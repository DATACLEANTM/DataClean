export interface UploadResponse {
    fileId: string;
    filename: string;
    originalName: string;
    size: number;
    rowCount: number;
    columns: string[];
    uploadedAt: Date;
}