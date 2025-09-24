import { useState, useRef, useEffect } from 'react';
import logo from '/world-map-svgrepo-com.svg';
import data from '../dummy/happiness_df.json';
import weightData from '../dummy/happiness_corr.json';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import WorldMap from './WorldMap';
import { AccordionFooter } from './Accordion';
import { CarouselOfCards } from './Carousel';
import { AllCards } from './AllCards';
import {
  expectedLevel,
  normalizeValue,
  getMetricRange,
} from './ExpectedLevelCalculator';
import type { CountryStats } from './ExpectedLevelCalculator';
import MetricData from './MetricData';
import OutlierData from './Outlier';

function MainContent() {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [countryData, setCountryData] = useState<CountryStats | null>(null);
  const [strength, setStrength] = useState<OutlierData | null>();
  const [weakness, setWeakness] = useState<OutlierData | null>();
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

    let metrics: MetricData[] = [];

    // iterate over object keys to get actual metrics vs expected metrics
    // gather ranges for normalization once
    const metricRanges: Record<string, { min: number; max: number }> = {};
    for (const key in found) {
      const typedKey = key as keyof CountryStats;
      if (typeof found[typedKey] === 'number') {
        metricRanges[typedKey] = getMetricRange(data, typedKey);
      }
    }

    for (let key in found) {
      if (found.hasOwnProperty(key)) {
        const typedKey = key as keyof CountryStats;
        const val = found[typedKey];
        if (typeof val === 'number' && !isNaN(val)) {
          const range = metricRanges[typedKey];
          const actualNorm = normalizeValue(val, range.min, range.max);
          const expectedNorm = expectedLevel(data, found.Happiness, typedKey);
          metrics.push(new MetricData(typedKey, actualNorm, expectedNorm));
        }
      }
    }

    // assign weights to metrics
    type MetricWeightData = {
      metric: string;
      weight_signed?: number;
      weight_magnitude?: number;
      weight?: number; // optional fallback for older files
    };
    type MetricWeightArray = MetricWeightData[];
    const weight: MetricWeightArray = weightData as MetricWeightArray;

    for (let i = 0; i < metrics.length; i++) {
      for (let j = 0; j < weight.length; j++) {
        if (metrics[i].MetricName === weight[j].metric) {
          // prefer explicit signed/magnitude fields, fallback to 'weight' if present
          const signed = weight[j].weight_signed ?? weight[j].weight ?? 0;
          const magnitude =
            weight[j].weight_magnitude ?? Math.abs(weight[j].weight ?? signed);
          metrics[i].Weight = signed;
          metrics[i].WeightMagnitude = magnitude;
          break;
        }
      }
    }

    // find outlier metrics
    if (metrics.length > 0) {
      const strongest = metrics.reduce((best, cur) =>
        cur.WeightedDifference > best.WeightedDifference ? cur : best
      );
      setStrength(
        new OutlierData(
          true,
          false,
          strongest.MetricName,
          Math.round(strongest.PercentAwayFromExpected * 10) / 10, // display rounded
          strongest.WeightedDifference
        )
      );

      const weakest = metrics.reduce((worst, cur) =>
        cur.WeightedDifference < worst.WeightedDifference ? cur : worst
      );
      setWeakness(
        new OutlierData(
          false,
          true,
          weakest.MetricName,
          Math.round(weakest.PercentAwayFromExpected * 10) / 10,
          weakest.WeightedDifference
        )
      );
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
          countryStats={data}
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
