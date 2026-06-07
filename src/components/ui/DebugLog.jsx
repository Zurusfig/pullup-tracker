export default function DebugLog({ lines = [] }) {
  return (
    <div className="bg-gray-900 text-brand-green font-mono text-[11px] rounded-2xl p-3 leading-relaxed">
      {lines.map((line, i) => (
        <div key={i} className="break-words">
          {line}
        </div>
      ))}
    </div>
  );
}
