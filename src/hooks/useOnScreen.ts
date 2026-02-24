
// src/hooks/useOnScreen.ts
import { useEffect, useRef, useState } from "react";

export function useOnScreen<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // if IntersectionObserver not supported, assume visible (graceful fallback)
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // do not unobserve immediately if you want repeated triggers;
            // here we unobserve to only trigger once
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, ...options } // default: when 15% visible
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options]);

  return { ref, isVisible };
}