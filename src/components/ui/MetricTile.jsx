export default function MetricTile({ label, value, accent = '#58CC02', icon: Icon }) {
  return (
    <div className="bg-white dark:bg-surface-card rounded-2xl p-4 flex-1 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon size={18} color={accent} />}
        <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{value}</span>
      </div>
      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
