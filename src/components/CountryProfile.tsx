import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { CountryStats } from './ExpectedLevelCalculator';
import type { AbsoluteMetricData } from './AbsoluteMetricData';
import { MetricsTable } from './charts/MetricsTable';
import { useMemo } from 'react';

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

type Props = {
  flash?: boolean;
  disabled?: boolean;
  Country: CountryStats | undefined | null;
  AllCountries: AbsoluteMetricData[];
};

export default function CountryProfile({
  Country,
  AllCountries,
  disabled = false,
  flash = false,
}: Props) {
  const rows = useMemo(() => {
    if (!Country || !AllCountries || AllCountries.length === 0) return [];

    return AllCountries.filter(
      (m) => String(m.metricName).toLowerCase() !== 'happiness'
    ).map((m) => {
      // coerce to numbers; may be undefined/null
      const actual =
        typeof m.currentCountryMetric === 'number'
          ? m.currentCountryMetric
          : NaN;
      const expected =
        typeof m.expectedForHappinessValue === 'number'
          ? m.expectedForHappinessValue
          : NaN;
      const average = typeof m.averageValue === 'number' ? m.averageValue : NaN;
      const top = typeof m.highestValue === 'number' ? m.highestValue : NaN;
      const bottom = typeof m.lowestValue === 'number' ? m.lowestValue : NaN;

      return {
        metric: m.metricName,
        actual,
        expected,
        average,
        top,
        bottom,
      };
    });
  }, [Country, AllCountries]);

  return (
    <Dialog>
      {disabled ? (
        <Button
          className={`w-full ${flash ? 'disabled:!text-primary disabled:!bg-primary' : 'disabled:!text-accent disabled:!bg-accent'} disabled:opacity-100`}
          type="button"
          disabled
        >
          Data Table
        </Button>
      ) : (
        <DialogTrigger asChild>
          <Button
            className={`w-20 ${flash ? 'text-primary' : ''}`}
            type="button"
          >
            Data Table
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="[&>button:last-child]:hidden w-full max-w-6xl md:max-w-4xl sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogDescription>
            <MetricsTable
              country={Country ? Country.Country_clean : ''}
              rows={rows}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
