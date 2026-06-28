"use client";

import { useState, useEffect, createContext, useContext } from "react";

interface ToastCtx {
  show: (msg: string) => void;
}
const Ctx = createContext<ToastCtx>({ show: () => {} });
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState("");
  const [visible, setVisible] = useState(false);

  function show(m: string) {
    setMsg(m);
    setVisible(true);
    setTimeout(() => setVisible(false), 2500);
  }

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      {visible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-surface border border-border shadow-lg text-sm text-text animate-bounce">
          {msg}
        </div>
      )}
    </Ctx.Provider>
  );
}
