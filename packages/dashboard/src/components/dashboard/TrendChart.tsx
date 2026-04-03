import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { ProjectTrendPoint } from '../../api/projects.api';

interface TrendChartProps {
  data: ProjectTrendPoint[];
  days?: number;
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatCost = (value: number) => {
  return `$${(value / 100).toFixed(2)}`;
};

export function TrendChart({ data, days = 7 }: TrendChartProps) {
  const sliced = days ? data.slice(-days) : data;
  const chartData = sliced.map((point) => ({
    ...point,
    label: formatDate(point.date),
  }));

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{days}-Day Cost Trend</h3>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v: number) => `$${(v / 100).toFixed(0)}`}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              width={50}
            />
            <Tooltip
              formatter={(value: number | undefined) => [formatCost(value ?? 0), 'Cost']}
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '13px',
              }}
              labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
            />
            <Line
              type="monotone"
              dataKey="cost"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 3, fill: '#4f46e5', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#4f46e5', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
