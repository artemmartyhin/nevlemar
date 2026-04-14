'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import Modal from './Modal';

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
};

type Ctx = (opts: ConfirmOptions) => Promise<boolean>;

const ConfirmCtx = createContext<Ctx | null>(null);

export function useConfirm() {
  const c = useContext(ConfirmCtx);
  if (!c) throw new Error('useConfirm must be used within <ConfirmProvider>');
  return c;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<(ConfirmOptions & { resolve: (v: boolean) => void }) | null>(null);

  const confirm: Ctx = useCallback(
    (opts) => new Promise((resolve) => setState({ ...opts, resolve })),
    [],
  );

  const close = (result: boolean) => {
    if (state) {
      state.resolve(result);
      setState(null);
    }
  };

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      <Modal open={!!state} onClose={() => close(false)} title={state?.title || 'Підтвердження'} size="sm">
        <p className="text-nv-text leading-6">{state?.message}</p>
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={() => close(false)}
            className="rounded-full border border-nv-dark/20 px-5 py-2.5 font-semibold hover:bg-nv-cream/30 transition"
          >
            {state?.cancelLabel || 'Скасувати'}
          </button>
          <button
            onClick={() => close(true)}
            className={`rounded-full px-5 py-2.5 font-semibold text-white transition ${
              state?.danger ? 'bg-rose-500 hover:bg-rose-600' : 'bg-nv-dark hover:bg-black'
            }`}
          >
            {state?.confirmLabel || 'Підтвердити'}
          </button>
        </div>
      </Modal>
    </ConfirmCtx.Provider>
  );
}
