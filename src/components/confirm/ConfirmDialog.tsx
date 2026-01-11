import { useEffect, useRef } from 'react';
import type { ConfirmOptions } from './confirm.types';

interface Props extends ConfirmOptions {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  description = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);

  // manage focus when opened
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => {
      confirmButtonRef.current?.focus();
    }, 0);
    return () => {
      clearTimeout(t);
      prev?.focus();
    };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'Escape') onCancel();
      if ((e.key === 'Enter' || e.key === ' ') && document.activeElement === confirmButtonRef.current) onConfirm();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onConfirm, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        ref={dialogRef}
        className="relative z-100 w-full max-w-lg rounded-2xl bg-surface p-2 shadow-2xl"
      >
        <div className="p-4 border border-muted/15 rounded-xl">
          <h3 id="confirm-title" className="text-lg font-semibold">
            {title}
          </h3>
          <p id="confirm-desc" className="mt-2 text-sm text-gray-600">
            {description}
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="rounded-md px-4 py-2 text-sm"
              aria-label={cancelText}
            >
              {cancelText}
            </button>

            <button
              ref={confirmButtonRef}
              onClick={onConfirm}
              className={
                'rounded-lg px-4 py-2 text-sm text-white ' +
                (variant === 'destructive' ? 'bg-danger/75 hover:bg-danger' : 'bg-primary/75 hover:bg-primary')
              }
              aria-label={confirmText}
            >
              {confirmText}
            </button>
        </div>
        </div>
      </div>
    </div>
  );
}