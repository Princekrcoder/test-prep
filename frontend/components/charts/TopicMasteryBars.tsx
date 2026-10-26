'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DataPoint { topicName: string; mastery: number; attempted: number; }
interface Props { data: DataPoint[]; }

export default function TopicMasteryBars({ data }: Props) {
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-on-surface-variant">
        No mastery data yet. Answer more questions to see topic breakdown.
      </div>
    );
  }

  const sorted = [...data]
    .filter((d) => d.attempted >= 3)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 10);

  const chartData = sorted.map((d) => ({
    topic: d.topicName.length > 14 ? d.topicName.slice(0, 14) + '…' : d.topicName,
    pct: Math.round(d.mastery * 100),
    attempted: d.attempted,
  }));

  const getColor = (pct: number) =>
    pct >= 70 ? '#006141' : pct >= 40 ? '#0048c9' : '#ba1a1a';

  return (
    <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 36)}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 32, bottom: 4, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5eeff" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#434655' }} unit="%" />
        <YAxis type="category" dataKey="topic" width={110} tick={{ fontSize: 11, fill: '#434655' }} />
        <Tooltip formatter={(v: any, _: any, props: any) => [`${v}% (${props.payload.attempted} Qs)`, 'Mastery']} contentStyle={{ borderRadius: '12px', border: '1px solid #e5eeff' }} />
        <Bar dataKey="pct" radius={[0, 6, 6, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={index} fill={getColor(entry.pct)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}