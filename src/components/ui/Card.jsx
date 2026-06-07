export default function Card({ children, className = '', accent = null }) {
  const accentClass = accent ? `border-l-4` : '';
  const style = accent ? { borderLeftColor: accent } : {};
  return (
    <div
      style={style}
      className={`bg-white dark:bg-surface-card rounded-2xl p-4 shadow-sm
        ${accentClass} ${className}`}
    >
      {children}
    </div>
  );
}
