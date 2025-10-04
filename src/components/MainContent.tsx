import { useState, useRef, useEffect } from 'react';
import logo from '/world-map-svgrepo-com.svg';
import data from '../data/happiness_df.json';
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
  const [mapMode, setMapMode] = useState<boolean>(true);
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
      <div className="myHeader bg-primary text-primary-foreground flex flex-row justify-between items-center gap-4 p-3 w-full h-12">
        <div className="flex flex-row justify-start items-center gap-2">
          <a href="" target="_blank">
            <img src={logo} className="logo h-10" alt="Vite logo" />
          </a>
          <h1>Happiness Data</h1>
        </div>
        <div className="flex w-full max-w-sm items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className={
              mapMode
                ? 'bg-secondary text-white border border-secondary'
                : 'bg-primary text-gray-700 border border-gray-300'
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
                ? 'bg-secondary text-white border border-secondary'
                : 'bg-primary text-gray-700 border border-gray-300'
            }
            onClick={() => setMapMode(false)}
          >
            About
          </Button>

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
          <div className="flex flex-col justify-center items-center gap-5 p-5">
            {countryData ? (
              <div className="flex flex-row justify-center items-center gap-3 w-2/3 h-20 lg:h-12">
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
              flash={justChanged}
              countryName={selectedCountry}
              countryMetrics={countryData}
              absoluteStatistics={absoluteStatistics}
            />
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-2/3 m-5">
            <h1 className="font-bold text-primary text-2xl">
              How "Expected" and "% Away from Expected" Work
            </h1>

            <h2 className="font-bold text-accent text-xl">
              1. What the project is doing
            </h2>
            <p>
              It combines many datasets (happiness, health, economy, etc.) into
              one table for each country. For every metric (like salaries, CO₂,
              life expectancy), it estimates what value we’d{' '}
              <strong>expect</strong> a country to have based on its happiness
              score. It then compares the country’s <em>actual</em> number to
              that <em>expected</em> number, and shows the difference as a
              percentage.
            </p>

            <h2 className="font-bold text-accent text-xl mt-3">
              2. How “expected value” is found
            </h2>
            <ul>
              <li>
                Line up all countries by happiness score (lowest to highest).
              </li>
              <li>
                Turn happiness scores into “percentiles” (like bottom 10%, top
                50%, etc.).
              </li>
              <li>
                Draw a simple trend line between happiness percentiles and
                metric values.
              </li>
              <li>
                For a country, check where its happiness falls on that line →
                that gives the “expected” metric value.
              </li>
            </ul>

            <div className="highlight">
              <strong>In short:</strong> Expected value = what most countries
              with similar happiness tend to have for that metric.
            </div>

            <h2 className="font-bold text-accent text-xl mt-3">
              3. How “% away from expected” is calculated
            </h2>
            <p>Formula:</p>
            <i>(Actual – Expected) ÷ Expected × 100</i>
            <ul>
              <li>
                <strong>Positive %</strong> → the country has{' '}
                <em>more than expected</em>.
              </li>
              <li>
                <strong>Negative %</strong> → the country has{' '}
                <em>less than expected</em>.
              </li>
            </ul>
            <p>
              <em>Example:</em> Expected life expectancy = 75 years, Actual = 80
              years → +6.7% (better than expected).
            </p>

            <h2 className="font-bold text-accent text-xl mt-3">
              4. How to read it
            </h2>
            <ul>
              <li>
                <strong>Strengths</strong>: actual {'>'} expected by a good
                margin.
              </li>
              <li>
                <strong>Weaknesses</strong>: actual {'<'} expected.
              </li>
              <li>±5% → basically “on track”.</li>
              <li>±20% or more → clear strength or weakness.</li>
            </ul>

            <h2 className="font-bold text-accent text-xl mt-3">
              5. Things to be careful about
            </h2>
            <ul>
              <li>
                <strong>Not cause and effect</strong>: higher or lower than
                expected doesn’t prove it caused happiness.
              </li>
              <li>
                <strong>Direction matters</strong>: higher is good for income,
                bad for pollution.
              </li>
            </ul>

            <div className="highlight">
              ✅ In plain English:
              <ul>
                <li>
                  “Expected” = what a country’s number <em>should</em> look like
                  given its happiness score, based on world patterns.
                </li>
                <li>
                  “% away from expected” = how much higher or lower the country
                  actually is compared to that expectation.
                </li>
                <li>Positive = above expected, Negative = below expected.</li>
              </ul>
              <h2 className="font-bold text-accent text-xl mt-3">6. FAQ</h2>
            </div>
            <AccordionFooter />
          </div>
        </div>
      )}
    </div>
  );
}

export default MainContent;
