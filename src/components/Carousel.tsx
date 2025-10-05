import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useMemo, useState } from 'react';
import { MetricBarChart } from './charts/MetricBarChart';
import type { CountryStats } from './ExpectedLevelCalculator';
import type { AbsoluteMetricData } from './AbsoluteMetricData';

function titleCase(s: string) {
  return s
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

type MetricCorrelationObject = {
  metric: string;
  weight_signed: number;
  weight_magnitude: number;
};

type Props = {
  weightData: MetricCorrelationObject[];
  flash?: boolean;
  countryName: string;
  countryMetrics: CountryStats | undefined | null;
  absoluteStatistics: AbsoluteMetricData[];
};

export function CarouselOfCards({
  weightData,
  flash = false,
  countryName,
  countryMetrics,
  absoluteStatistics,
}: Props) {
  const [shownMetric, setShownMetric] = useState<
    AbsoluteMetricData | undefined
  >();
  const [slideCount, setSlideCount] = useState<number>(1);
  const [shownMetricWeight, setShownMetricWeight] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // filtered stats (remove Happiness)
  const filteredStatistics = useMemo(
    () =>
      absoluteStatistics.filter(
        (m) =>
          String(m.metricName).toLowerCase() !== 'happiness (score 0-10)' &&
          m.currentCountryMetric !== null &&
          m.currentCountryMetric !== 0 &&
          m.currentCountryMetric !== undefined
      ),
    [absoluteStatistics]
  );

  // memoize weight map
  const weightMap = useMemo(() => {
    const m = new Map<string, number>();
    (weightData as { metric: string; weight_signed: number }[]).forEach((w) =>
      m.set(w.metric.toLowerCase(), w.weight_signed)
    );
    return m;
  }, []);

  const updateShownMetric = (index: number) => {
    if (!filteredStatistics || filteredStatistics.length === 0) {
      setShownMetric(undefined);
      setShownMetricWeight('');
      return;
    }
    const safeIndex =
      ((index % filteredStatistics.length) + filteredStatistics.length) %
      filteredStatistics.length;
    const metric = filteredStatistics[safeIndex];
    setShownMetric(metric);

    const weight = weightMap.get(String(metric.metricName).toLowerCase()) ?? 0;
    setShownMetricWeight(
      `${metric.metricName} has the correlation to happiness of ${Math.round(weight * 100)}%`
    );
  };

  // when filteredStatistics (or country) changes, reset/clamp index and shown metric
  useEffect(() => {
    if (!filteredStatistics || filteredStatistics.length === 0) {
      setSlideCount(1);
      setCurrentIndex(0);
      setShownMetric(undefined);
      setShownMetricWeight('');
      return;
    }
    setSlideCount(filteredStatistics.length);
    // clamp current index to valid range and update shown metric
    const clamped = Math.min(currentIndex, filteredStatistics.length - 1);
    setCurrentIndex(clamped);
    updateShownMetric(clamped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredStatistics]); // intentionally omit currentIndex to avoid loops

  // safe functional handlers
  const handlePrev = () => {
    setCurrentIndex((prev) => {
      if (!filteredStatistics || filteredStatistics.length === 0) return 0;
      const len = filteredStatistics.length;
      const next = (prev - 1 + len) % len;
      updateShownMetric(next);
      return next;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      if (!filteredStatistics || filteredStatistics.length === 0) return 0;
      const len = filteredStatistics.length;
      const next = (prev + 1) % len;
      updateShownMetric(next);
      return next;
    });
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          <CarouselItem key={currentIndex}>
            <div className="p-1">
              <Card
                className={`lg:w-150 h-130 lg:h-120 bg-accent transition-transform-colors duration-300 ${
                  flash ? 'scale-90 bg-primary' : ''
                }`}
              >
                <CardHeader>
                  <CardTitle>
                    {countryMetrics ? `${shownMetricWeight}` : ''}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-4 max-h-100">
                  {countryMetrics && shownMetric ? (
                    <MetricBarChart
                      country={countryName}
                      metric={shownMetric?.metricName}
                      expected={shownMetric?.expectedForHappinessValue}
                      actual={shownMetric?.currentCountryMetric}
                      average={shownMetric?.averageValue}
                      top={{
                        country: shownMetric?.highestCountryName,
                        value: shownMetric?.highestValue,
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      {countryName ? (
                        <p>No data for {titleCase(countryName)}</p>
                      ) : (
                        <p>Click on the map to see happiness data!</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <div className="flex gap-2 mt-3 justify-center">
        <button
          onClick={handlePrev}
          aria-label="Previous metric"
          className="px-3 py-1 border rounded"
        >
          ◀
        </button>
        <div className="flex items-center px-2 text-sm">
          {countryMetrics ? `${currentIndex + 1} / ${slideCount}` : '—'}
        </div>
        <button
          onClick={handleNext}
          aria-label="Next metric"
          className="px-3 py-1 border rounded"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
