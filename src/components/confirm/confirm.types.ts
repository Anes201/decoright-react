
export interface ConfirmOptions {
title?: string;
description?: string;
confirmText?: string;
cancelText?: string;
// optional variant for styling (e.g. 'destructive' for deletes)
variant?: 'default' | 'destructive';
// optional payload (useful when you want to pass context to the caller)
payload?: unknown;
}


export type ConfirmResult = boolean;