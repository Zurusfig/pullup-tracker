import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ProgressChart({ data }) {
  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fontWeight: 700 }} tickFormatter={(d) => d.slice(5)} />
          <YAxis tick={{ fontSize: 11, fontWeight: 700 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.12)' }}
            labelStyle={{ fontWeight: 800 }}
          />
          <Line
            type="monotone"
            dataKey="reps"
            stroke="#58CC02"
            strokeWidth={3}
            dot={{ r: 3, fill: '#58CC02' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
