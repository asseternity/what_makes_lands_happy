import { useState, useRef, useEffect } from 'react';
import logo from '/world-map-svgrepo-com.svg';
import data from '../dummy/happiness_df.json';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import WorldMap from './WorldMap';
import { AccordionFooter } from './Accordion';
import { CarouselOfCards } from './Carousel';
import { AllCards } from './AllCards';

type CountryData = {
  Country_clean: string;
  Happiness: number;
};

function MainContent() {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [justChanged, setJustChanged] = useState<boolean>(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (selectedCountry) {
      const found =
        data.find((d) => d.Country_clean === selectedCountry) || null;
      setCountryData(found);
    }

    setJustChanged(true);
    window.clearTimeout(timerRef.current ?? undefined);
    timerRef.current = window.setTimeout(() => {
      setJustChanged(false);
    }, 800);

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
          countryStrength="Strength"
          countryWeakness="Weakness"
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
          countryStrength="Strength"
          countryWeakness="Weakness"
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
            countryStrength="Strength"
            countryWeakness="Weakness"
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
