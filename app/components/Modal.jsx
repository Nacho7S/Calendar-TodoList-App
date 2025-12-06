import React from 'react';
import { useTheme } from '../providers/themeProvider';

const Modal = ({ isOpen, onClose, title, children }) => {
  const { theme } = useTheme();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-opacity-0"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className="relative bg-[var(--bg-primary)] rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border border-[var(--border-color)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;