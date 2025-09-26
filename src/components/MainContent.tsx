import { useState, useRef, useEffect } from 'react';
import logo from '/world-map-svgrepo-com.svg';
import data from '../dummy/happiness_df.json';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import WorldMap from './WorldMap';
import { AccordionFooter } from './Accordion';
import { CarouselOfCards } from './Carousel';
import CountryProfile from './CountryProfile';
import { expectedLevel, getMetricRange } from './ExpectedLevelCalculator';
import type { CountryStats } from './ExpectedLevelCalculator';
import type { AbsoluteMetricData } from './AbsoluteMetricData';

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function MainContent() {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [absoluteStatistics, setAbsoluteStatistics] = useState<
    AbsoluteMetricData[]
  >([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [countryData, setCountryData] = useState<CountryStats | null>(null);
  const [justChanged, setJustChanged] = useState<boolean>(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // --- Prepare absolute metrics for all countries ---
    let absoluteMetrics: AbsoluteMetricData[] = [];

    for (const key in data[0]) {
      const typedKey = key as keyof (typeof data)[0];
      if (typeof data[0][typedKey] === 'number') {
        absoluteMetrics.push({ metricName: key });
      }
    }

    absoluteMetrics.forEach((metric) => {
      // Find highest, lowest, average
      let sum = 0;
      data.forEach((country) => {
        const value = country[
          metric.metricName as keyof typeof country
        ] as number;
        if (typeof value === 'number') {
          sum += value;
          if (
            metric.highestValue === undefined ||
            value > metric.highestValue
          ) {
            metric.highestValue = value;
            metric.highestCountryName = country.Country_clean;
          }
          if (metric.lowestValue === undefined || value < metric.lowestValue) {
            metric.lowestValue = value;
            metric.lowestCountryName = country.Country_clean;
          }
        }
      });
      metric.averageValue = sum / data.length;
    });

    // --- If a country is selected, attach current and expected values ---
    if (selectedCountry) {
      const found =
        data.find((d) => d.Country_clean === selectedCountry) || null;
      setCountryData(found);
      setJustChanged(true);

      window.clearTimeout(timerRef.current ?? undefined);
      timerRef.current = window.setTimeout(() => setJustChanged(false), 400);

      if (found) {
        const metricRanges: Record<string, { min: number; max: number }> = {};
        for (const key in found) {
          const typedKey = key as keyof CountryStats;
          if (typeof found[typedKey] === 'number') {
            metricRanges[typedKey] = getMetricRange(data, typedKey);
          }
        }

        absoluteMetrics.forEach((metric) => {
          const val = found[metric.metricName as keyof CountryStats] as number;
          if (typeof val === 'number' && !isNaN(val)) {
            metric.currentCountryMetric = val;
            metric.expectedForHappinessValue = expectedLevel(
              data,
              found.Happiness,
              metric.metricName as keyof CountryStats
            );
          }
        });
      }
    }

    console.log(absoluteMetrics[12]);

    setAbsoluteStatistics(absoluteMetrics);

    return () => {
      window.clearTimeout(timerRef.current ?? undefined);
    };
  }, [selectedCountry]);

  return (
    <div className="container w-full h-screen bg-primary-foreground font-display">
      <div className="bg-primary text-primary-foreground flex flex-row justify-between items-center gap-4 p-3 w-full h-15">
        <div className="flex flex-row justify-start items-center gap-4">
          <a href="" target="_blank">
            <img src={logo} className="logo h-10" alt="Vite logo" />
          </a>
          <h1>Happiness Report</h1>
        </div>
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input
            type="email"
            placeholder="Find a country"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const found = data.find(
                  (d) =>
                    d.Country_clean.toLowerCase() === searchValue.toLowerCase()
                );
                setSelectedCountry(found ? found.Country_clean : searchValue);
                setSearchValue('');
              }
            }}
            className="placeholder:text-white placeholder:opacity-100"
          />
          <Button
            type="button"
            variant="outline"
            className="bg-primary"
            onClick={() => {
              const found = data.find(
                (d) =>
                  d.Country_clean.toLowerCase() === searchValue.toLowerCase()
              );
              if (found) {
                setSelectedCountry(found.Country_clean);
                setSearchValue('');
              }
            }}
          >
            Search
          </Button>
        </div>
      </div>
      <div
        className="card m-5 p-4 flex flex-col justify-center items-center gap-4 relative rounded-full h-1/4"
        ref={mapContainerRef}
      >
        <WorldMap
          mapContainerRef={mapContainerRef}
          callback={setSelectedCountry}
          countryStats={data}
        />
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-15 p-5">
        <div className="flex-1 flex flex-col items-start max-w-200">
          {countryData ? (
            <div className="flex flex-row justify-center items-center gap-3 w-full h-20 lg:h-12">
              <div className="flex-1 flex flex-col">
                <div>
                  {titleCase(selectedCountry)} has the happiness rate of{' '}
                  <span className="font-bold text-primary">
                    {countryData?.Happiness}
                  </span>
                </div>
                <Progress
                  value={countryData?.Happiness * 10}
                  className="mb-5"
                />
              </div>
              <div className="mb-5">
                <CountryProfile
                  Country={selectedCountry}
                  disabled={!countryData}
                  flash={justChanged}
                />
              </div>
            </div>
          ) : (
            <div className="h-12"></div>
          )}
          <CarouselOfCards
            flash={justChanged}
            countryName={selectedCountry}
            countryMetrics={countryData}
            absoluteStatistics={absoluteStatistics}
          />
        </div>
        <div className="flex-1 max-w-100">
          <h2>About</h2>
          <AccordionFooter />
        </div>
      </div>
    </div>
  );
}

export default MainContent;
