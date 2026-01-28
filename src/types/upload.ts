export type UploadStatus = "idle" | "uploading" | "complete" | "failed";

export interface StagedFile {
  id: string;         // local id for React keys and tracking
  name: string;
  size: number;
  mime: string;
  file?: File;        // keep the File reference in case you upload later
  progress: number;   // 0..100
  status: UploadStatus;
  url?: string;       // public url after upload
};

// Runtime presence to avoid "module don't provide export" in some environments
export const STAGED_FILE_TYPES = true;
