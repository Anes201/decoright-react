
import React, { type ReactNode, useCallback, useMemo, useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import type { ConfirmOptions, ConfirmResult } from './confirm.types';

/**
 * Lightweight local provider implementation.
 *
 * We implement a tiny provider so you don't have to be locked into a specific external
 * dependency. If you already use a library (react-confirm, react-confirm-hook, material-ui-confirm, etc.)
 * you can swap this provider to wrap that library instead and keep the rest of the API.
 */

type ConfirmCallback = (result: ConfirmResult) => void;

interface InternalDialogState extends ConfirmOptions {
  open: boolean;
  _id: number;
}

export const ConfirmProviderContext = React.createContext<{
  confirm: (opts?: ConfirmOptions) => Promise<ConfirmResult>;
} | null>(null);

export default function ConfirmProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<InternalDialogState | null>(null);
  const [waiting, setWaiting] = useState<Record<number, ConfirmCallback>>({});
  const nextId = React.useRef(1);

  const confirm = useCallback((opts: ConfirmOptions = {}) => {
    const id = nextId.current++;
    return new Promise<ConfirmResult>((resolve) => {
      // store resolve callback
      setWaiting((prev) => ({ ...prev, [id]: resolve }));
      setDialog({ ...opts, open: true, _id: id });
    });
  }, []);

  const handleResolve = useCallback((id: number, value: ConfirmResult) => {
    setWaiting((prev) => {
      const cb = prev[id];
      const copy = { ...prev };
      delete copy[id];
      // call after state update
      setTimeout(() => cb?.(value), 0);
      return copy;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (!dialog) return;
    handleResolve(dialog._id, true);
    setDialog(null);
  }, [dialog, handleResolve]);

  const handleCancel = useCallback(() => {
    if (!dialog) return;
    handleResolve(dialog._id, false);
    setDialog(null);
  }, [dialog, handleResolve]);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmProviderContext.Provider value={value}>
      {children}
      {/* Render the dialog mounted at app root — portal recommended in production. */}
      {dialog && (
        <ConfirmDialog
          open={dialog.open}
          title={dialog.title}
          description={dialog.description}
          confirmText={dialog.confirmText}
          cancelText={dialog.cancelText}
          variant={dialog.variant}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ConfirmProviderContext.Provider>
  );
}