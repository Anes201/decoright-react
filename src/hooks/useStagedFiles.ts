
import { useEffect, useRef, useState } from "react";
import type { StagedFile } from "../types/upload";

/**
 * simulateUpload(file, onProgress) => returns cancel function
 * Replace this with real upload call that accepts an onProgress callback.
 */
function simulateUpload(_file: File, onProgress: (p: number) => void): () => void {
  let percent = 0;
  const t = setInterval(() => {
    percent += Math.floor(Math.random() * 12) + 4;
    if (percent >= 100) {
      onProgress(100);
      clearInterval(t);
    } else {
      onProgress(Math.min(percent, 99));
    }
  }, 150);

  // Randomly fail sometimes so retry UI can be tested
  const failTimer = setTimeout(() => {
    if (Math.random() < 0.08) {
      onProgress(-1); // sentinel for failure in this demo; hook will interpret
    }
  }, 800 + Math.random() * 1200);

  return () => {
    clearInterval(t);
    clearTimeout(failTimer);
  };
}

export function useStagedFiles() {
  const [files, setFiles] = useState<StagedFile[]>([]);
  const cancelers = useRef<Record<string, () => void>>({});

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

    // prepend new files so newest appear at top (choose your UX)
    setFiles((prev) => [...newStaged, ...prev]);

    // start upload immediately (optimistic). If you don't want this, remove this loop.
    newStaged.forEach((s) => startUpload(s.id));
  }

  function removeFile(id: string) {
    // cancel ongoing upload if any
    if (cancelers.current[id]) {
      cancelers.current[id]();
      delete cancelers.current[id];
    }
    setFiles((prev) => prev.filter((p) => p.id !== id));
  }

  function startUpload(id: string) {
    const file = files.find((f) => f.id === id) ?? null;
    // For safety: refresh the file from current state (there may be a race).
    const current = files.find((f) => f.id === id);
    // If file not present (maybe removed before start), look at DOM? Abort.
    const targetFile = current?.file ?? file?.file;
    if (!targetFile) return;

    // mark uploading
    setFiles((prev) => prev.map((p) => (p.id === id ? { ...p, status: "uploading", progress: 0 } : p)));

    // start simulated upload (replace this with real uploader)
    const cancel = simulateUpload(
      targetFile,
      (progress) => {
        if (progress === -1) {
          // failure sentinel used by simulateUpload
          setFiles((prev) => prev.map((p) => (p.id === id ? { ...p, status: "failed", progress: 0 } : p)));
          if (cancelers.current[id]) {
            delete cancelers.current[id];
          }
          return;
        }

        setFiles((prev) =>
          prev.map((p) => (p.id === id ? { ...p, progress: Math.max(0, Math.min(100, progress)) } : p))
        );

        if (progress >= 100) {
          setFiles((prev) => prev.map((p) => (p.id === id ? { ...p, status: "complete", progress: 100 } : p)));
          if (cancelers.current[id]) {
            delete cancelers.current[id];
          }
        }
      }
    );

    cancelers.current[id] = cancel;
  }

  function retryFile(id: string) {
    // reset state then start again
    setFiles((prev) => prev.map((p) => (p.id === id ? { ...p, status: "idle", progress: 0 } : p)));
    // small tick so state applies, then start
    setTimeout(() => startUpload(id), 10);
  }

  return {
    files,
    addFiles,
    removeFile,
    retryFile,
    startUpload, // exported if you want manual control
  };
}
