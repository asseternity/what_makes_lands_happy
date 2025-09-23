import { useState, useRef, useEffect } from 'react';
import logo from '/world-map-svgrepo-com.svg';
import data from '../dummy/happiness_df.json';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import WorldMap from './WorldMap';
import { AccordionFooter } from './Accordion';
import { CarouselOfCards } from './Carousel';
import { AllCards } from './AllCards';
import ExpectedLevel from './ExpectedLevelCalculator';

type CountryData = {
  Country: string;
  Country_clean: string;
  Region: string;
  Happiness: number;
  'Median Salary': number | null;
  'Average Salary': number | null;
  'Lowest Salary': number | null;
  'Highest Salary': number | null;
  'Infant Survival Rate': number | null;
  'Alcohol Consumption Rate': number | null;
  'Life Expectancy': number | null;
  'Netflix (USD/month)': number | null;
  'Women Safety Index': number | null;
  'Average Winter Temperature': number | null;
  'Average Summer Temperature': number | null;
  Population: number | null;
  'Energy Per Capita': number | null;
  '% of Power from Fossil Fuels': number | null;
  '% of Power from Nuclear': number | null;
  '% of Power from Renewables': number | null;
  '% of Agricultural Land': number | null;
  '% of Forest Land': number | null;
  Territory: number | null;
  'Average Rainfall': number | null;
  Corruption: number | null;
  'Wheat Production (tonnes)': number | null;
  'Rye Production (tonnes)': number | null;
  'Potatoes Production (tonnes)': number | null;
  'Meat, chicken Production (tonnes)': number | null;
  'Avocados Production (tonnes)': number | null;
  'Petrol Price (USD/liter)': number | null;
  'Daily Oil Consumption (Barrels)': number | null;
  'CO2 Emissions (ton per capita)': number | null;
};

function MainContent() {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [strength, setStrength] = useState<string | null>();
  const [weakness, setWeakness] = useState<string | null>();
  const [justChanged, setJustChanged] = useState<boolean>(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!selectedCountry) return;

    const found = data.find((d) => d.Country_clean === selectedCountry) || null;
    setCountryData(found);

    if (!found) return;

    setJustChanged(true);
    window.clearTimeout(timerRef.current ?? undefined);
    timerRef.current = window.setTimeout(() => {
      setJustChanged(false);
    }, 800);

    class MetricData {
      MetricName: string;
      ActualValue: number;
      ExpectedValue: number;
      Difference: number;

      constructor(
        metricName: string,
        actualValue: number,
        expectedValue: number
      ) {
        this.MetricName = metricName;
        this.ActualValue = actualValue;
        this.ExpectedValue = expectedValue;
        this.Difference = this.ActualValue - this.ExpectedValue;
      }
    }

    let metrics: MetricData[] = [];

    for (let key in found) {
      if (found.hasOwnProperty(key)) {
        const typedKey = key as keyof CountryData;
        if (typeof found[typedKey] === 'number') {
          const currentCountryData = {
            name: found.Country_clean,
            happiness: found.Happiness,
            metricName: typedKey,
            metricValue: found[typedKey]!,
          };
          const expectedLevel = ExpectedLevel(data, currentCountryData);
          metrics.push(
            new MetricData(typedKey, found[typedKey]!, expectedLevel)
          );
        }
      }
    }

    if (metrics.length > 0) {
      const biggestStrength = metrics.reduce((prev, curr) =>
        curr.Difference > prev.Difference ? curr : prev
      );
      setStrength(biggestStrength.MetricName);

      const biggestWeakness = metrics.reduce((prev, curr) =>
        curr.Difference > prev.Difference ? prev : curr
      );
      setWeakness(biggestWeakness.MetricName);
    } else {
      setStrength(null);
      setWeakness(null);
    }

    return () => {
      window.clearTimeout(timerRef.current ?? undefined);
    };
  }, [selectedCountry]);

  return (
    <div className="container w-full h-screen bg-primary-foreground font-display">
      <div className="bg-primary text-primary-foreground flex flex-row justify-between items-center gap-4 p-3 w-full h-20">
        <div className="flex flex-row justify-start items-center gap-4">
          <a href="" target="_blank">
            <img src={logo} className="logo h-14" alt="Vite logo" />
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
        className="card m-5 p-4 flex flex-col justify-center items-center gap-4 relative rounded-full h-1/3"
        ref={mapContainerRef}
      >
        <WorldMap
          mapContainerRef={mapContainerRef}
          callback={setSelectedCountry}
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-4 md:hidden">
        <CarouselOfCards
          flash={justChanged}
          countryName={selectedCountry}
          happiness={countryData?.Happiness}
          countryStrength={strength}
          countryWeakness={weakness}
        />
        <div className="px-10 mb-5 w-full flex flex-row justify-center items-center">
          <div className="w-60">
            <h2>About</h2>
            <AccordionFooter />
          </div>
        </div>
      </div>
      <div className="hidden md:flex lg:hidden flex-row justify-center items-center gap-15">
        <CarouselOfCards
          countryName={selectedCountry}
          happiness={countryData?.Happiness}
          countryStrength={strength}
          countryWeakness={weakness}
        />
        <div className="flex-1 max-w-70">
          <h2>About</h2>
          <AccordionFooter />
        </div>
      </div>
      <div className="hidden lg:flex flex-row justify-center items-center gap-15">
        <div className="flex-1 max-w-xl">
          <AllCards
            flash={justChanged}
            countryName={selectedCountry}
            happiness={countryData?.Happiness}
            countryStrength={strength}
            countryWeakness={weakness}
          />
        </div>
        <div className="flex-1 max-w-70 xl:max-w-1/2">
          <h2>About</h2>
          <AccordionFooter />
        </div>
      </div>
    </div>
  );
}

export default MainContent;
