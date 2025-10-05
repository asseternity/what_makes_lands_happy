import { useState, useRef, useEffect } from 'react';
import logo from '/world-map-svgrepo-com.svg';
import data from '../data/happiness_df.json';
import weightData from '../data/happiness_corr.json';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Combobox } from './Combobox';
import WorldMap from './WorldMap';
import { CarouselOfCards } from './Carousel';
import About from './About';
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
  const [mapMode, setMapMode] = useState<boolean>(true);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [absoluteStatistics, setAbsoluteStatistics] = useState<
    AbsoluteMetricData[]
  >([]);
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
              found['Happiness (score 0-10)'],
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
    <div className="myMainContainer container w-full min-h-screen flex flex-col bg-primary-foreground font-display relative">
      <div className="myHeader bg-primary text-primary-foreground flex flex-row justify-between items-center gap-2 p-3 md:gap-4 md:p-3 w-full h-12">
        <div className="flex flex-row justify-start items-center gap-0 md:gap-2">
          <a href="" target="_blank">
            <img
              src={logo}
              className="logo hidden md:block h-10"
              alt="Vite logo"
            />
          </a>
          <h1 className="text-xs md:text-lg">Happiness Data</h1>
        </div>
        <div className="flex max-w-sm items-center gap-1">
          <Button
            type="button"
            variant="outline"
            className={
              mapMode
                ? 'bg-secondary text-white border border-secondary text-xs p-2'
                : 'bg-primary text-white border border-gray-300 text-xs p-2'
            }
            onClick={() => setMapMode(true)}
          >
            Map
          </Button>
          <Button
            type="button"
            variant="outline"
            className={
              !mapMode
                ? 'bg-secondary text-white border border-secondary text-xs p-2'
                : 'bg-primary text-white border border-gray-300 text-xs p-2'
            }
            onClick={() => setMapMode(false)}
          >
            Methods
          </Button>
          <Combobox data={data} onSelect={setSelectedCountry} />
        </div>
      </div>
      {mapMode ? (
        <div className="myMainContentContainer flex-1 flex flex-col lg:flex-row w-full h-full justify-center items-center">
          <div className="p-5 w-full lg:w-auto flex-1 h-full rounded-full max-h-full">
            <div
              className="card flex flex-col justify-center items-center gap-4 relative rounded-full h-full max-h-full"
              ref={mapContainerRef}
            >
              <WorldMap
                mapContainerRef={mapContainerRef}
                callback={setSelectedCountry}
                countryStats={data}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-5 p-3">
            {countryData ? (
              <div className="flex flex-row justify-center items-center gap-3 w-full h-20 lg:h-12">
                <div className="flex-1 flex flex-col">
                  <div>
                    {titleCase(selectedCountry)} has the happiness rate of{' '}
                    <span className="font-bold text-primary">
                      {countryData?.['Happiness (score 0-10)']}
                    </span>
                  </div>
                  <Progress
                    value={(countryData?.['Happiness (score 0-10)'] ?? 0) * 10}
                  />
                </div>
                <div>
                  <CountryProfile
                    Country={countryData}
                    AllCountries={absoluteStatistics}
                    disabled={!countryData}
                    flash={justChanged}
                  />
                </div>
              </div>
            ) : (
              <div className="h-12"></div>
            )}
            <CarouselOfCards
              weightData={weightData}
              flash={justChanged}
              countryName={selectedCountry}
              countryMetrics={countryData}
              absoluteStatistics={absoluteStatistics}
            />
          </div>
        </div>
      ) : (
        <About weightData={weightData} />
      )}
    </div>
  );
}

export default MainContent;
