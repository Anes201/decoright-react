

import type { StagedFile } from "@/types/upload";
import FileIcon from "@/icons/files";
import ProgressBar from "./ProgressBar";
import { ICONS } from "@/icons";

export default function FileRow({
  file,
  onRemove,
  onRetry,
}: {
  file: StagedFile;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}) {
  // small helper for human file size
  const niceSize = (n: number) => {
    if (n > 1_000_000) return `${Math.round(n / 1_000_000)} MB`;
    if (n > 1_000) return `${Math.round(n / 1000)} KB`;
    return `${n} B`;
  };

  return (
    <li className="flex gap-2 w-full h-full p-2 bg-surface rounded-xl" role="listitem" data-id={file.id}>
      <div className="flex items-center justify-center w-1/3 md:w-1/7 aspect-square border border-muted/15 rounded-lg">
        <FileIcon mime={file.mime} name={file.name} />
      </div>

      <div className="flex flex-col justify-between gap-2 w-full">
        <div className="flex flex-col gap-2 pt-1">

          <div className="text-xs md:text-sm text-ellipsis-2line wrap-normal">{file.name}</div>

          <div className="flex">
            <div className="text-xs after:content-['•'] after:mx-2">{niceSize(file.size)}</div>

            {/* status text */}
            {file.status === "uploading" && <div className="text-2xs md:text-xs text-muted w-fit">Uploading…</div>}
            {file.status === "complete" && <div className="text-2xs md:text-xs text-success w-fit">Complete</div>}
            {file.status === "failed" && <div className="text-2xs md:text-xs text-danger w-fit">Uploading Failed</div>}
            {file.status === "idle" && <div className="text-2xs md:text-xs text-warning w-fit">Ready</div>}
          </div>
        </div>

        <div>

          {/* progress bar (show when uploading or complete) */}
          {(file.status === "uploading" || file.status === "idle" || file.status === "complete") && <ProgressBar value={file.progress} />}

        </div>
      </div>

      <div className="flex flex-col justify-between w-fit">
        <button type="button" onClick={() => onRemove(file.id)} aria-label={`Remove ${file.name}`}>
          <ICONS.trash className="size-5 text-muted"/>
        </button>

        {/* failed hint + retry */}
        {file.status === "failed" && (
          <button type="button" onClick={() => onRetry(file.id)} aria-label={`Retry ${file.name}`}>
            <ICONS.arrowPath className="size-5 text-muted" />
          </button>
        )}

      </div>
    </li>
  );
}
