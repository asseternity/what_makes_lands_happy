import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type MetricSeries = {
  name: string;
  us: number;
  top: number;
  bottom: number;
  avg: number;
};

type Props = {
  data: MetricSeries[];
};

export function MultiMetricLineChart({ data }: Props) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="us" stroke="black" strokeWidth={2} />
          <Line type="monotone" dataKey="top" stroke="blue" />
          <Line type="monotone" dataKey="bottom" stroke="red" />
          <Line type="monotone" dataKey="avg" stroke="yellow" />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-sm mt-2 text-center">
        All metrics. Black = selected country, Blue = top, Red = bottom, Yellow
        = average.
      </p>
    </div>
  );
}
