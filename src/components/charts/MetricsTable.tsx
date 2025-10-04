import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

type Row = {
  metric: string;
  actual: number;
  expected: number;
  average: number;
  top: number;
};

type Props = {
  country: string;
  rows: Row[];
};

export function MetricsTable({ country, rows }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Metric</TableHead>
          <TableHead>{titleCase(country)}</TableHead>
          <TableHead>Average</TableHead>
          <TableHead>Top</TableHead>
          <TableHead>Expected</TableHead>
          <TableHead>Over/Under Expected</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r, i) => {
          const isHappiness = r.metric.toLowerCase().includes('happiness');
          const diffPct =
            !isHappiness && r.expected !== 0
              ? ((r.actual - r.expected) / r.expected) * 100
              : 0;

          return (
            <TableRow key={i}>
              <TableCell>{r.metric}</TableCell>
              <TableCell>{r.actual.toFixed(2)}</TableCell>
              <TableCell>{r.average.toFixed(2)}</TableCell>
              <TableCell>{r.top.toFixed(2)}</TableCell>
              <TableCell>
                {isHappiness ? '--' : r.expected.toFixed(2)}
              </TableCell>
              <TableCell>
                {isHappiness ? '--' : diffPct.toFixed(1) + '%'}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
