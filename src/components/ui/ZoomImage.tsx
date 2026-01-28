// src/components/ZoomImage.tsx
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

function ensureModalRoot() {
  if (typeof document === 'undefined') return null;
  let root = document.getElementById('zoom-modal-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'zoom-modal-root';
    document.body.appendChild(root);
  }
  return root;
}

export type ZoomDisplay = 'contain' | 'cover' | 'fullWidth';

export type ZoomImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** display mode for the zoomed image */
  display?: ZoomDisplay;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
};

export default function ZoomImage({
  src,
  alt,
  className = '',
  display = 'contain',
  onOpen,
  onClose,
  style,
  ...imgProps
}: ZoomImageProps) {
  const [open, setOpen] = useState(false);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setModalRoot(ensureModalRoot());
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev || '';
    };
  }, [open]);

  function openModal() {
    setOpen(true);
    onOpen?.();
  }
  function closeModal() {
    setOpen(false);
    onClose?.();
  }

  const imgElement = (
    <img src={src} alt={alt} {...imgProps} className={`zoom-image inline-block cursor-zoom-in w-full h-full object-cover ${className}`} style={style} />
  );

  const modal =
    modalRoot && open
      ? createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="zoom-modal fixed inset-0 z-100 flex items-center justify-center p-0"
          onClick={closeModal}
        >
          <div className="zoom-backdrop absolute inset-0 bg-black/75" />
          <div className="zoom-content relative z-10 flex items-center justify-center max-w-[90vw] md:max-w-3/4 max-md:w-full aspect-auto md:h-full max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="zoomed-image w-full h-full rounded-md object-contain"
              crossOrigin="anonymous"
            />
            <button
              aria-label="Close"
              onClick={closeModal}
              className="font-medium text-sm absolute -top-10 md:top-0 right-0 md:-right-10 border border-muted/75 bg-foreground px-2 py-1 text-white rounded-md"
            >
              ✕
            </button>
          </div>
        </div>,
        modalRoot
      )
      : null;

  return (
    <>
      <button type="button" onClick={openModal} aria-label={alt ? `Open image: ${alt}` : 'Open image'}
        className="zoom-wrapper inline-block p-0 m-0 w-full h-full border-0 bg-transparent"
      >
        {imgElement}
      </button>

      {modal}
    </>
  );
}
