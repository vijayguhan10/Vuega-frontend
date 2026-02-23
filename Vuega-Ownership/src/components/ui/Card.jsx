/**
 * Reusable card wrapper component.
 *
 * @param {React.ReactNode} children
 * @param {string} [className] – additional classes
 * @param {string} [padding]   – custom padding, defaults to "p-5"
 */
const Card = ({ children, className = "", padding = "p-5" }) => {
  return (
    <div
      className={`bg-v-primary-bg border border-v-border rounded-xl shadow-sm ${padding} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
