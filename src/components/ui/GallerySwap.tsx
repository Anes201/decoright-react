import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ZoomImage from "./ZoomImage";

export type GalleryImage = { id: string; src: string; alt?: string; srcSet?: string };

type Props = {
  images: GalleryImage[];
  initialIndex?: number; // 0..n-1 (user-facing)
  objectFit?: "cover" | "contain";
  className?: string;
  showNav?: boolean;
};

export default function Gallery({
  images,
  className,
  initialIndex = 0,
  objectFit = "cover",
  showNav = true,
}: Props) {
  const n = images.length;
  if (n === 0) return <div className="text-sm text-muted-foreground">No images.</div>;
  if (n === 1) {
    return (
      <div className={`${className} select-none overflow-hidden`}>
        <div className="relative w-full h-full">
          <ZoomImage
            src={images[0].src}
            alt={images[0].alt ?? ""}
            className={`w-full h-full ${objectFit === "cover" ? "object-cover" : "object-contain"}`}
          />
        </div>
      </div>
    );
  }

  const trackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const startX = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);

  // clones: [cloneLast, ...images..., cloneFirst] => track indices 0..n+1
  const clampTrackIndex = (t: number) => Math.max(0, Math.min(t, n + 1));

  // start at initialIndex mapped to track (userIndex + 1)
  const [trackIndex, setTrackIndexState] = useState(() => clampTrackIndex(Math.max(0, Math.min(initialIndex, n - 1)) + 1));

  // small guard: prevent overlapping transitions / rapid fire
  const isTransitioning = useRef(false);

  const trackWidth = () => trackRef.current?.clientWidth ?? 0;
  const setTransform = (px: number, withTransition: boolean) => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transition = withTransition ? "transform 260ms cubic-bezier(.2,.9,.2,1)" : "none";
    el.style.transform = `translateX(${px}px)`;
  };

  // helper setter that respects clamp and marks transition state
  const setTrackIndex = (newIndex: number, animate = true) => {
    const clamped = clampTrackIndex(newIndex);
    // if we're already transitioning don't accept new requests
    if (isTransitioning.current && animate) return;
    // when animating to a new index, mark transitioning; animationend will clear it
    if (animate) isTransitioning.current = true;
    setTrackIndexState(clamped);
  };

  // ensure initial position is rendered without transition
  useLayoutEffect(() => {
    const w = trackWidth();
    prevTranslate.current = -trackIndex * w;
    // initial positioning: no transition
    setTransform(prevTranslate.current, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // position track when trackIndex changes (animate normally)
  useEffect(() => {
    const w = trackWidth();
    prevTranslate.current = -trackIndex * w;
    // when we ask to animate, isTransitioning should already be true; still set transform with transition
    setTransform(prevTranslate.current, true);

    // preload user-facing neighbors
    const userIdx = ((trackIndex - 1) % n + n) % n;
    [userIdx - 1, userIdx + 1].forEach((i) => {
      const img = images[(i + n) % n];
      if (img) new Image().src = img.src;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex]);

  // transitionend: handle clone jumps and clear transition lock
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onTransitionEnd = () => {
      // If we're on the appended clone (trackIndex === n+1), jump instantly to first real (1)
      if (trackIndex === n + 1) {
        const w = trackWidth();
        prevTranslate.current = -1 * w;
        // jump without transition
        setTransform(prevTranslate.current, false);
        // update state silently (no animation)
        setTrackIndexState(1);
      } else if (trackIndex === 0) {
        // If we're on the prepended clone, jump to last real (n)
        const w = trackWidth();
        prevTranslate.current = -n * w;
        setTransform(prevTranslate.current, false);
        setTrackIndexState(n);
      }
      // clear lock
      isTransitioning.current = false;
    };
    el.addEventListener("transitionend", onTransitionEnd);
    return () => el.removeEventListener("transitionend", onTransitionEnd);
  }, [trackIndex, n, images]);

  // animate loop while dragging
  function animate() {
    setTransform(currentTranslate.current, false);
    rafRef.current = requestAnimationFrame(animate);
  }

  // pointer handlers
  function pointerDown(e: React.PointerEvent) {
    if (!trackRef.current) return;
    // if currently transitioning, cancel it and allow immediate drag — safe behavior
    if (isTransitioning.current) {
      // cancel any active transition and reset lock so user can take control
      isTransitioning.current = false;
      setTransform(prevTranslate.current, false);
    }
    draggingRef.current = true;
    startX.current = e.clientX;
    prevTranslate.current = -trackIndex * trackWidth();
    currentTranslate.current = prevTranslate.current;
    trackRef.current.setPointerCapture(e.pointerId);
    rafRef.current = requestAnimationFrame(animate);
  }
  function pointerMove(e: React.PointerEvent) {
    if (!draggingRef.current || !trackRef.current) return;
    const dx = e.clientX - startX.current;
    currentTranslate.current = prevTranslate.current + dx;
  }
  function pointerUp(e: React.PointerEvent) {
    if (!trackRef.current) return;
    draggingRef.current = false;
    trackRef.current.releasePointerCapture(e.pointerId);
    cancelAnimationFrame(rafRef.current ?? 0);

    const moved = currentTranslate.current - prevTranslate.current;
    const w = trackWidth() || 1;
    const threshold = Math.max(40, w * 0.12);

    if (moved < -threshold) {
      // next
      setTrackIndex(trackIndex + 1, true);
    } else if (moved > threshold) {
      // prev
      setTrackIndex(trackIndex - 1, true);
    } else {
      // snap back
      // mark transitioning so buttons/fast interactions are blocked until end
      isTransitioning.current = true;
      setTransform(prevTranslate.current, true);
    }
  }
  function pointerCancel(e: React.PointerEvent) {
    if (!trackRef.current) return;
    draggingRef.current = false;
    trackRef.current.releasePointerCapture(e.pointerId);
    cancelAnimationFrame(rafRef.current ?? 0);
    isTransitioning.current = true;
    setTransform(prevTranslate.current, true);
  }

  // resize: keep user-facing index centered without animation
  useEffect(() => {
    function onResize() {
      const w = trackWidth();
      prevTranslate.current = -trackIndex * w;
      setTransform(prevTranslate.current, false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [trackIndex]);

  // keyboard nav (respects isTransitioning)
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (isTransitioning.current) return;
      if (ev.key === "ArrowRight") setTrackIndex(trackIndex + 1, true);
      if (ev.key === "ArrowLeft") setTrackIndex(trackIndex - 1, true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [trackIndex]);

  const goNext = () => { if (!isTransitioning.current) setTrackIndex(trackIndex + 1, true); };
  const goPrev = () => { if (!isTransitioning.current) setTrackIndex(trackIndex - 1, true); };

  const trackNodes = [images[n - 1], ...images, images[0]];
  const userIndex = ((trackIndex - 1) % n + n) % n;

  return (
    <div className={`${className} select-none overflow-hidden`}>
      <div
        className="relative w-full h-full touch-pan-y"
        style={{ touchAction: "pan-y" }}
        aria-roledescription="carousel"
        aria-label="Image carousel"
      >
        <div
          ref={trackRef}
          className="flex w-full h-full"
          role="list"
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={pointerUp}
          onPointerCancel={pointerCancel}
          onDragStart={(e) => e.preventDefault()}
        >
          {trackNodes.map((img, i) => (
            <div
              key={img.id + "-" + i}
              className="flex-none w-full h-full flex items-center justify-center bg-black/5"
              role="listitem"
            >
              <img
                src={img.src}
                srcSet={img.srcSet}
                alt={img.alt ?? ""}
                className={`w-full h-full ${objectFit === "cover" ? "object-cover" : "object-contain"} pointer-events-none`}
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {showNav && (
          <>
            <button onClick={goPrev} aria-label="Previous" className="max-md:hidden absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-sm focus:outline-none">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
            </button>

            <button onClick={goNext} aria-label="Next" className="max-md:hidden absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-sm focus:outline-none">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" /></svg>
            </button>
          </>
        )}

        <div className="content-center absolute bottom-1 max-md:right-1 md:left-1/2 md:-translate-x-1/2 text-2xs md:text-xs bg-black/60 text-white px-1 py-0.5 md:px-2 md:py-1 rounded">
          {userIndex + 1} / {n}
        </div>
      </div>
    </div>
  );
}
