import { useState, useRef, useEffect } from 'react';
import logo from '/world-map-svgrepo-com.svg';
import data from '../dummy/happiness_df.json';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import WorldMap from './WorldMap';

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
      <div className="bg-primary text-primary-foreground flex flex-row justify-start items-center gap-4 p-3 w-full h-20">
        <a href="" target="_blank">
          <img src={logo} className="logo h-14" alt="Vite logo" />
        </a>
        <h1>Happiness Report</h1>
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
        <div className="card m-5 p-4 flex flex-row justify-center items-center gap-4">
          <Card className="w-50 h-40">
            <CardHeader>
              <CardTitle>Strength</CardTitle>
            </CardHeader>
            <CardContent>
              <p>+15%</p>
            </CardContent>
          </Card>
          <Card className="w-50 h-40">
            <CardHeader>
              <CardTitle>Happy Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {countryData ? (
                  `${titleCase(selectedCountry)} has the happiness rate of ${countryData?.Happiness}`
                ) : (
                  <div>
                    {firstLoad
                      ? `Click on the map to see happiness data!`
                      : `No data for ${titleCase(selectedCountry)}`}
                  </div>
                )}
              </p>
            </CardContent>
          </Card>
          <Card className="w-50 h-40">
            <CardHeader>
              <CardTitle>Weakness</CardTitle>
            </CardHeader>
            <CardContent>
              <p>-15%</p>
            </CardContent>
          </Card>
        </div>
        <Collapsible>
          <CollapsibleTrigger>What is this project?</CollapsibleTrigger>
          <CollapsibleContent>
            Every place hums with its own rhythm—some promise opportunity,
            others serenity, some quietly drain the soul. The art lies in
            discerning what truly matters when choosing where to root yourself.
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

export default MainContent;
