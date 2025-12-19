import React, { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
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

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-center items-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div
        className={`relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-300 ${className}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-neutral-100 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6 text-neutral-900" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};
