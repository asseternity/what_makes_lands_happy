import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import weightData from '../dummy/happiness_corr.json';
import { normalizeValue } from './ExpectedLevelCalculator';
import CountryProfile from './CountryProfile';
import type { CountryStats } from './ExpectedLevelCalculator';
import type { AbsoluteMetricData } from './AbsoluteMetricData';
import { MetricBarChart } from './charts/MetricBarChart';
import { MultiMetricLineChart } from './charts/MultiMetricLineChart';
import { MetricsTable } from './charts/MetricsTable';
import { useEffect, useState } from 'react';

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

type countryData = {
  flash?: boolean;
  countryName: string;
  countryMetrics: CountryStats | undefined | null; // all metrics for our country
  absoluteStatistics: AbsoluteMetricData[]; // highest/lowest/average/our/expected for all metrics
};

export function AllCards({
  flash = false,
  countryName,
  countryMetrics,
  absoluteStatistics,
}: countryData) {
  const [strength, setStrength] = useState<AbsoluteMetricData>();
  const [weakness, setWeakness] = useState<AbsoluteMetricData>();

  useEffect(() => {
    if (!absoluteStatistics || absoluteStatistics.length === 0) {
      setStrength(undefined);
      setWeakness(undefined);
      return;
    }

    // build quick lookup for signed weight per metric (case-insensitive)
    const weightMap = new Map<string, number>();
    (weightData as { metric: string; weight_signed: number }[]).forEach((w) =>
      weightMap.set(w.metric.toLowerCase(), w.weight_signed)
    );

    // score each metric:
    // score = (normalized_actual - normalized_expected) * weight_signed
    // positive score means the country is better than expected in the direction
    // that correlates with higher happiness. negative means worse.
    let best: { metric?: AbsoluteMetricData; score: number } = {
      metric: undefined,
      score: -Infinity,
    };
    let worst: { metric?: AbsoluteMetricData; score: number } = {
      metric: undefined,
      score: Infinity,
    };

    for (const metric of absoluteStatistics) {
      const actual = metric.currentCountryMetric;
      const expected = metric.expectedForHappinessValue;
      const min = metric.lowestValue ?? Number.NaN;
      const max = metric.highestValue ?? Number.NaN;

      if (
        typeof actual !== 'number' ||
        typeof expected !== 'number' ||
        Number.isNaN(min) ||
        Number.isNaN(max)
      ) {
        continue;
      }

      // normalize using observed min/max for that metric
      const actualNorm = normalizeValue(actual, min, max);
      const expectedNorm = normalizeValue(expected, min, max);
      const diff = actualNorm - expectedNorm;

      const weightSigned =
        weightMap.get(String(metric.metricName).toLowerCase()) ?? 0;

      const score = diff * weightSigned;

      if (score > best.score) {
        best = { metric, score };
      }
      if (score < worst.score) {
        worst = { metric, score };
      }
    }

    setStrength(best.metric);
    setWeakness(worst.metric);
  }, [absoluteStatistics, countryName, countryMetrics]);

  return (
    <div className="w-full flex flex-row justify-center items-center gap-4">
      <Card
        className={`bg-accent transition-transform-colors-opacity duration-300 ${flash ? 'scale-90 bg-primary' : ''} ${countryMetrics ? '' : 'opacity-0'}`}
      >
        <CardHeader>
          <CardTitle>{`tbd`}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-4 max-h-60">
          {countryMetrics ? <p>{`data found: tbd`}</p> : <p>tbd</p>}
        </CardContent>
      </Card>
      <Card
        className={`bg-accent transition-transform-colors duration-300 ${flash ? 'scale-90 bg-primary' : ''}`}
      >
        <CardHeader>
          <CardTitle>Happy Countries</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-4 max-h-60">
          {countryMetrics && (
            <>
              <p>
                {titleCase(countryName)} has the happiness rate of{' '}
                {countryMetrics.Happiness}
              </p>
              {countryMetrics ? (
                <div>
                  <Progress
                    value={countryMetrics.Happiness * 10}
                    className="mb-5"
                  />
                  <div className="">
                    <MetricBarChart
                      country={countryName}
                      metric={strength?.metricName}
                      expected={strength?.expectedForHappinessValue}
                      actual={strength?.currentCountryMetric}
                      average={strength?.averageValue}
                      top={{
                        country: strength?.highestCountryName,
                        value: strength?.highestValue,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <Progress value={0} className="mb-5" />
              )}
            </>
          )}
          {!countryMetrics && (
            <>
              {countryName ? (
                <p>No data for {titleCase(countryName)}</p>
              ) : (
                <p>Click on the map to see happiness data!</p>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="mt-auto flex-col gap-2">
          <CountryProfile
            Country={countryName}
            disabled={!countryMetrics}
            flash={flash}
          />
        </CardFooter>
      </Card>
      <Card
        className={`bg-accent transition-transform-colors duration-300 ${flash ? 'scale-90 bg-primary' : ''} ${countryMetrics ? '' : 'opacity-0'}`}
      >
        <CardHeader>
          <CardTitle>{`tbd`}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-4 max-h-60">
          {countryMetrics ? <p>{`data found: tbd`}</p> : <p>tbd</p>}
        </CardContent>
      </Card>
    </div>
  );
}
