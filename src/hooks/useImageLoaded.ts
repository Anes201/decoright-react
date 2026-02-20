
// src/hooks/useImageLoaded.ts
import { useEffect, useState } from "react";

export function useImageLoaded(src?: string) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!src) {
      setLoaded(false);
      setError(null);
      return;
    }

    let mounted = true;
    setLoaded(false);
    setError(null);

    const img = new Image();

    const onLoad = () => {
      if (!mounted) return;
      setLoaded(true);
      setError(null);
    };

    const onError = (ev: ErrorEvent | any) => {
      if (!mounted) return;
      setLoaded(false);
      setError(new Error("Image failed to load"));
      // optional: console.warn(ev);
    };

    img.addEventListener("load", onLoad);
    img.addEventListener("error", onError);
    img.src = src;

    // If cached, browser sometimes sets .complete immediately — handle that:
    if (img.complete && img.naturalWidth !== 0) {
      // microtask so handlers run in consistent order
      Promise.resolve().then(() => onLoad());
    }

    return () => {
      mounted = false;
      img.removeEventListener("load", onLoad);
      img.removeEventListener("error", onError);
    };
  }, [src]);

  return { loaded, error };
}