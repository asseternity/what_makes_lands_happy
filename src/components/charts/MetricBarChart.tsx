import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';

function titleCase(s: string | undefined): string {
  if (typeof s === 'string') {
    return s
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } else return '';
}

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
    { name: titleCase(country), value: actual },
    { name: 'Expected', value: expected },
    { name: 'Average', value: average },
    { name: `Top: ${titleCase(top.country)}`, value: top.value },
  ];

  const colors = ['#8884d8', '#006994', '#ffc658', '#ff7300'];

  return (
    <div className="w-full h-40">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index} ${entry}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {actual && expected && top.country && (
        <p className="text-xs mt-2 text-center">
          {titleCase(country)}'s' {metric} is {actual}, which is{' '}
          {(((actual - expected) / expected) * 100).toFixed(1)}% from expected.
          Highest is {titleCase(top.country)} at {top.value}.
        </p>
      )}
    </div>
  );
}
