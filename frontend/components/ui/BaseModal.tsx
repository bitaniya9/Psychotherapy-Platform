"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";

type ModalContent = React.ReactNode | null;

type ModalContextValue = {
  open: (content: React.ReactNode) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within a BaseModalProvider");
  return ctx;
}

export const BaseModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [content, setContent] = useState<ModalContent>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let el = document.getElementById("base-modal-root");
    if (!el) {
      el = document.createElement("div");
      el.id = "base-modal-root";
      document.body.appendChild(el);
    }
    rootRef.current = el as HTMLDivElement;
    return () => {
      // do not remove element on unmount to avoid tearing down portals during HMR
    };
  }, []);

  const open = useCallback((c: React.ReactNode) => setContent(c), []);
  const close = useCallback(() => setContent(null), []);

  return (
    <ModalContext.Provider value={{ open, close }}>
      {children}
      {rootRef.current && content
        ? ReactDOM.createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={close} />
              <div className="relative z-10 max-w-3xl w-full mx-4">
                {content}
              </div>
            </div>,
            rootRef.current
          )
        : null}
    </ModalContext.Provider>
  );
};

export default BaseModalProvider;
