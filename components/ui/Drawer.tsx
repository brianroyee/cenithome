import React, { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleEsc);
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, onClose]);

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-neutral-100">
            {title && (
              <h2 className="text-xl font-bold tracking-tight text-neutral-900">
                {title}
              </h2>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-50 rounded-full transition-colors -mr-2"
            >
              <X className="w-6 h-6 text-neutral-900" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};
