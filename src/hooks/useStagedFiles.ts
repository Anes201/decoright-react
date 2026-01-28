
import { useEffect, useRef, useState } from "react";
import type { StagedFile } from "@/types/upload";

export function useStagedFiles(uploadFn?: (file: File) => Promise<string>) {
  const [files, setFiles] = useState<StagedFile[]>([]);
  const cancelers = useRef<Record<string, () => void>>({});
  const filesRef = useRef<StagedFile[]>(files);
  filesRef.current = files; // Keep ref in sync

  // cleanup cancelers on unmount
  useEffect(() => {
    return () => {
      Object.values(cancelers.current).forEach((c) => c && c());
      cancelers.current = {};
    };
  }, []);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const arr = Array.from(fileList);
    const newStaged: StagedFile[] = arr.map((f) => ({
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: f.name,
      size: f.size,
      mime: f.type || "application/octet-stream",
      file: f,
      progress: 0,
      status: "idle",
    }));

    setFiles((prev) => [...prev, ...newStaged]);
  }

  // Auto-start upload when files are added
  useEffect(() => {
    if (!uploadFn) return;

    files.forEach(file => {
      if (file.status === 'idle' && file.file) {
        startUpload(file.id, file.file);
      }
    });
  }, [files, uploadFn]);

  function removeFile(id: string) {
    // cancel ongoing upload if any
    if (cancelers.current[id]) {
      cancelers.current[id]();
      delete cancelers.current[id];
    }
    setFiles((prev) => prev.filter((p) => p.id !== id));
  }

  async function startUpload(id: string, targetFile?: File) {
    // If targetFile not passed, try to find it from ref
    if (!targetFile) {
      const current = filesRef.current.find((f) => f.id === id);
      targetFile = current?.file || undefined;
    }
    if (!targetFile || !uploadFn) return;

    // mark uploading
    setFiles((prev) => prev.map((p) => (p.id === id ? { ...p, status: "uploading", progress: 0 } : p)));

    try {
      const url = await uploadFn(targetFile);
      setFiles((prev) => prev.map((p) => (p.id === id ? { ...p, status: "complete", progress: 100, url } : p)));
    } catch (error) {
      console.error("Upload failed for file", id, error);
      setFiles((prev) => prev.map((p) => (p.id === id ? { ...p, status: "failed", progress: 0 } : p)));
    }
  }

  function retryFile(id: string) {
    // reset state then start again
    setFiles((prev) => prev.map((p) => (p.id === id ? { ...p, status: "idle", progress: 0 } : p)));
    // small tick so state applies, then start
    setTimeout(() => startUpload(id), 10);
  }

  return {
    files,
    setFiles,
    addFiles,
    removeFile,
    retryFile,
    startUpload, // exported if you want manual control
  };
}
