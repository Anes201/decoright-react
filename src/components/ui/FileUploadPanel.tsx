
import React from "react";
import { useStagedFiles } from "@/hooks/useStagedFiles";
import FileList from "./FileList";
import { ICONS } from "@/icons";

/**
 * Minimal panel - no styles. Add classes for layout.
 * The hook starts uploads automatically (see hook). If you prefer manual upload, remove that behavior from the hook.
 */
export default function FileUploadPanel() {
  const { files, addFiles, removeFile, retryFile } = useStagedFiles();

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
            <span className="font-medium text-xs text-muted px-1"> Attach Files </span>
            <label htmlFor="filesToUpload" className='flex items-center justify-between gap-4 w-full h-full p-2 border border-muted/25 bg-emphasis/75 rounded-t-lg cursor-pointer'>
                <div className="flex items-center px-2">
                  <span> <ICONS.documentArrowUp className='size-5 text-muted'/> </span>
                  <span className="text-2xs md:text-xs text-muted px-2"> Upload Files, Images & Documents </span>
                </div>
                <span className="font-semibold text-sm text-center min-w-max px-3 py-2 text-foreground bg-emphasis border border-muted/25 rounded-lg shadow-xs"> Upload </span>
            </label>
            <input type="file" name="filesToUpload" id="filesToUpload" className="hidden" multiple onChange={onInputChange} />
        </div>

        <div className="flex w-full md:p-2 md:border-x md:border-b border-muted/15 rounded-b-xl md:shadow-xs bg-surface">
            <FileList files={files} onRemove={removeFile} onRetry={retryFile} />
        </div>

    </div>
  );
}
