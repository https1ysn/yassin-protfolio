"use client";

import { createContext, useCallback, useContext, useRef, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, AlertCircle, Undo2 } from "lucide-react";

type Toast = {
  id: number;
  kind: "success" | "error";
  message: string;
  undo?: () => void;
};

type ToastApi = {
  success: (message: string, undo?: () => void) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastApi>({ success: () => {}, error: () => {} });

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const push = useCallback((kind: Toast["kind"], message: string, undo?: () => void) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev.slice(-3), { id, kind, message, undo }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), undo ? 6000 : 3200);
  }, []);

  const api: ToastApi = {
    success: (m, undo) => push("success", m, undo),
    error: (m) => push("error", m),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-5 left-1/2 z-[98] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="glass pointer-events-auto flex w-full items-center gap-3 rounded-2xl px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
              role="status"
            >
              {t.kind === "success" ? (
                <Check size={15} className="shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle size={15} className="shrink-0 text-red-400" />
              )}
              <span className="flex-1 text-sm">{t.message}</span>
              {t.undo && (
                <button
                  type="button"
                  onClick={() => {
                    t.undo!();
                    setToasts((prev) => prev.filter((x) => x.id !== t.id));
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-white/20"
                >
                  <Undo2 size={12} /> Undo
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
