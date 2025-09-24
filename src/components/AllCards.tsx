import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import CountryProfile from './CountryProfile';
import OutlierData from './Outlier';

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
  happiness: number | undefined | null;
  countryStrength: OutlierData | undefined | null;
  countryWeakness: OutlierData | undefined | null;
};

export function AllCards({
  flash = false,
  countryName,
  happiness,
  countryStrength,
  countryWeakness,
}: countryData) {
  return (
    <div className="w-full flex flex-row justify-center items-center gap-4">
      <Card
        className={`bg-accent transition-transform-colors duration-300 ${flash ? 'scale-90 bg-primary' : ''}`}
      >
        <CardHeader>
          <CardTitle>{countryStrength?.MetricName}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-4 max-h-60">
          {countryStrength ? (
            <p>{countryStrength?.DisplayPercent}% from expected</p>
          ) : (
            <p>No data</p>
          )}
        </CardContent>
      </Card>
      <Card
        className={`bg-accent transition-transform-colors duration-300 ${flash ? 'scale-90 bg-primary' : ''}`}
      >
        <CardHeader>
          <CardTitle>Happy Countries</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-4 max-h-60">
          {happiness && (
            <>
              <p>
                {titleCase(countryName)} has the happiness rate of {happiness}
              </p>
              {happiness ? (
                <Progress value={happiness * 10} className="mb-5" />
              ) : (
                <Progress value={0} className="mb-5" />
              )}
            </>
          )}
          {!happiness && (
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
            disabled={!happiness}
            flash={flash}
          />
        </CardFooter>
      </Card>
      <Card
        className={`bg-accent transition-transform-colors duration-300 ${flash ? 'scale-90 bg-primary' : ''}`}
      >
        <CardHeader>
          <CardTitle>{countryWeakness?.MetricName}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-4 max-h-60">
          {countryWeakness ? (
            <p>{countryWeakness?.DisplayPercent}% from expected</p>
          ) : (
            <p>No data</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
