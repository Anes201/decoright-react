// single source of truth for the staged/upload file shape
export type UploadStatus = "idle" | "uploading" | "complete" | "failed";

export type StagedFile = {
  id: string;         // local id for React keys and tracking
  name: string;
  size: number;
  mime: string;
  file?: File;        // keep the File reference in case you upload later
  progress: number;   // 0..100
  status: UploadStatus;
};
