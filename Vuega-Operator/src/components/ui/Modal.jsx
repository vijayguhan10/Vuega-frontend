import { FaTimes } from "react-icons/fa";

/**
 * Reusable modal component.
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {string} title
 * @param {React.ReactNode} children
 * @param {string} [maxWidth] – Tailwind max-w class
 */
const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full ${maxWidth} mx-4 bg-v-primary-bg rounded-xl shadow-2xl border border-v-border animate-in fade-in zoom-in-95`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-v-border">
          <h3 className="text-lg font-semibold text-v-text">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-v-text-muted hover:bg-v-secondary hover:text-v-text transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
