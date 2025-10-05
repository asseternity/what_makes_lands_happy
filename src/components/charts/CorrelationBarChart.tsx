import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';

type MetricCorrelationObject = {
  metric: string;
  weight_signed: number;
  weight_magnitude: number;
};

type MetricCorrelationData = {
  correlation_data: MetricCorrelationObject[];
};

export function CorrelationBarChart({
  correlation_data,
}: MetricCorrelationData) {
  const data = [...correlation_data].sort(
    (a, b) => b.weight_magnitude - a.weight_magnitude
  );
  const blue = '#0096FF';
  const red = '#ff000d';

  return (
    <div className="w-full h-300">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" tick={{ fontSize: 10 }} />
          <YAxis
            dataKey="metric"
            type="category"
            tick={{ fontSize: 10 }}
            width={150}
          />
          <Tooltip />
          <Bar dataKey="weight_magnitude" fill="#8884d8">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.weight_signed > 0 ? blue : red}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
