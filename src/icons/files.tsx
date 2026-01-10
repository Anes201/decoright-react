


export default function FileIcon({ mime, name }: { mime: string; name: string }) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (mime === "application/pdf" || ext === "pdf") {
    return <span className="file-icon file-icon--pdf" aria-hidden="true">PDF</span>;
  }
  if (mime.startsWith("image/") || ["jpg", "jpeg", "png", "webp"].includes(ext)) {
    return <span className="file-icon file-icon--img" aria-hidden="true">IMG</span>;
  }
  if (mime.startsWith("text/") || ["txt", "md"].includes(ext)) {
    return <span className="file-icon file-icon--txt" aria-hidden="true">TXT</span>;
  }
  return <span className="file-icon file-icon--generic" aria-hidden="true">FILE</span>;
}
