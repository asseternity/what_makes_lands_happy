import { useState, useRef, useEffect } from 'react';
import logo from '/world-map-svgrepo-com.svg';
import data from '../dummy/happiness_df.json';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import WorldMap from './WorldMap';
import { AccordionFooter } from './Accordion';
import { CarouselOfCards } from './Carousel';

type CountryData = {
  Country_clean: string;
  Happiness: number;
};

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function MainContent() {
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedCountry) {
      const found =
        data.find((d) => d.Country_clean === selectedCountry) || null;
      setCountryData(found);
      setFirstLoad(false);
    }
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
        className="card m-5 p-4 flex flex-col justify-center items-center gap-4 relative rounded-full"
        ref={mapContainerRef}
      >
        <WorldMap
          mapContainerRef={mapContainerRef}
          callback={setSelectedCountry}
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        <CarouselOfCards
          countryName={selectedCountry}
          happiness={countryData?.Happiness}
          countryStrength="Strength"
          countryWeakness="Weakness"
        />
        <div className="px-10 mb-5 w-full">
          <h2>About</h2>
          <AccordionFooter />
        </div>
      </div>
    </div>
  );
}

export default MainContent;
