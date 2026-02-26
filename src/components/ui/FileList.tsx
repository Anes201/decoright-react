
import type { StagedFile } from "@/types/upload";
import FileRow from "@components/ui/FileRow";
import { useTranslation } from "react-i18next";

export default function FileList({
  files,
  onRemove,
  onRetry,
}: {
  files: StagedFile[];
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}) {

  const { t } = useTranslation();

  if (files.length === 0)
    return (
      <div className="content-center font-medium text-xs md:text-sm text-muted/75 text-center w-full py-4 md:py-8">
        {t("common.uploaded_files_placeholder")}
      </div>
  );

  return (
    <ul role="list" aria-label="Staged files" className="flex flex-col gap-2 w-full h-fit">
        {files.map((f) => (
            <FileRow key={f.id} file={f} onRemove={onRemove} onRetry={onRetry} />
        ))}
    </ul>
  );
}
