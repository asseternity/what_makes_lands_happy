import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type Props = {
  country: string;
  metric: string | undefined;
  expected: number | undefined;
  actual: number | undefined;
  average: number | undefined;
  top: { country: string | undefined; value: number | undefined };
};

export function MetricBarChart({
  country,
  metric,
  expected,
  actual,
  average,
  top,
}: Props) {
  const data = [
    { name: 'Expected', value: expected },
    { name: country, value: actual },
    { name: 'Average', value: average },
    { name: `Top: ${top.country}`, value: top.value },
  ];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      {actual && expected && (
        <p className="text-sm mt-2 text-center">
          {country} has {metric} of {actual}, which is{' '}
          {(((actual - expected) / expected) * 100).toFixed(1)}% from expected.
          Highest is {top.country} at {top.value}.
        </p>
      )}
    </div>
  );
}
