'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint { date: string; score: number; maxScore: number; }
interface Props { data: DataPoint[]; }

export default function ScoreLineChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-on-surface-variant">
        No score data yet. Complete more tests to see your trend.
      </div>
    );
  }

  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    pct: Math.round((d.score / d.maxScore) * 100),
  }));

  return (
    <ResponsiveContainer width="100%" height={256}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5eeff" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#434655' }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#434655' }} unit="%" />
        <Tooltip formatter={(v: any) => [`${v}%`, 'Score']} contentStyle={{ borderRadius: '12px', border: '1px solid #e5eeff' }} />
        <Line type="monotone" dataKey="pct" stroke="#0048c9" strokeWidth={2} dot={{ r: 4, fill: '#0048c9' }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}