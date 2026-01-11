
import { useContext } from 'react';
import { ConfirmProviderContext } from './ConfirmProvider';
import type { ConfirmOptions, ConfirmResult } from './confirm.types';

export default function useConfirm() {
  const ctx = useContext(ConfirmProviderContext);
  if (!ctx) throw new Error('useConfirm must be used inside ConfirmProvider');

  const confirm = (opts?: ConfirmOptions): Promise<ConfirmResult> => {
    // ensure callers get a Promise that always resolves to boolean
    return ctx.confirm(opts).then((r) => !!r);
  };

  return confirm;
}