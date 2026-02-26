
import React from "react";
import FileList from "./FileList";
import { useStagedFiles } from "@/hooks/useStagedFiles";
import { DocumentArrowUp } from "@/icons";
/**
 * Minimal panel - no styles. Add classes for layout.
 * The hook starts uploads automatically (see hook). If you prefer manual upload, remove that behavior from the hook.
 */
import type { StagedFile } from "@/types/upload";
import { useTranslation } from "react-i18next";

interface FileUploadPanelProps {
  stagedFiles?: {
    files: StagedFile[];
    addFiles: (fileList: FileList | null) => void;
    removeFile: (id: string) => void;
    retryFile: (id: string) => void;
  };
}

export default function FileUploadPanel({ stagedFiles }: FileUploadPanelProps) {
  const localHook = useStagedFiles();
  const { files, addFiles, removeFile, retryFile } = stagedFiles || localHook;

  const { t } = useTranslation();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    // reset input so same file chosen again will still trigger change
    e.currentTarget.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2 w-full h-fit" onDrop={onDrop} onDragOver={onDragOver}>
        <span className="font-medium text-xs text-muted px-1"> { t('common.upload_attach_files_label') } </span>
        <label htmlFor="filesToUpload" className='flex items-center justify-between gap-4 w-full h-full p-2 border border-muted/25 bg-emphasis/75 rounded-t-lg cursor-pointer'>
          <div className="flex items-center px-2">
            <span> <DocumentArrowUp className='size-5 text-muted' /> </span>
            <span className="text-2xs md:text-xs text-muted px-2"> { t('common.upload_files_label') } </span>
          </div>
          <span className="font-semibold text-sm text-center min-w-max px-3 py-2 text-foreground bg-emphasis border border-muted/25 rounded-lg shadow-xs"> { t('common.upload') } </span>
        </label>
        <input type="file" name="filesToUpload" id="filesToUpload" className="hidden" multiple onChange={onInputChange} />
      </div>

        <div className="relative flex w-full md:p-2 border border-muted/25 rounded-b-lg bg-surface">
            <FileList files={files} onRemove={removeFile} onRetry={retryFile} />
        </div>

    </div>
  );
}
