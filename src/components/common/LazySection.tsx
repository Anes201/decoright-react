
// src/components/LazySection.tsx
import React, { Suspense, useMemo } from "react";
import { useOnScreen } from "@/hooks/useOnScreen";

type Loader<TProps = any> = () => Promise<{ default: React.ComponentType<TProps> }>;

export function LazySection<TProps = any>({
  loader,
  placeholder = null,
  rootMargin = "0px 0px 200px 0px",
  props,
}: {
  loader: Loader<TProps>;
  placeholder?: React.ReactNode;
  rootMargin?: string;
  props?: TProps;
}) {
  const { ref, isVisible } = useOnScreen<HTMLDivElement>({ rootMargin });

  // memoize lazy import to avoid re-creating component on re-renders
  const LazyComponent = useMemo(() => {
    return React.lazy(loader) as React.LazyExoticComponent<React.ComponentType<TProps>>;
  }, [loader]);

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
    >
      {isVisible ? (
        <Suspense fallback={placeholder ?? null}>
          <LazyComponent {...(props as any)} />
        </Suspense>
      ) : (
        placeholder ?? null
      )}
    </div>
  );
}