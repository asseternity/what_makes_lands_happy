import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import CountryProfile from './CountryProfile';

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
  countryStrength: string;
  countryWeakness: string;
};

export function AllCards({
  flash = false,
  countryName,
  happiness,
}: countryData) {
  return (
    <div className="w-full flex flex-row justify-center items-center gap-4">
      <Card
        className={`bg-accent transition-transform-colors duration-300 ${flash ? 'scale-90 bg-primary' : ''}`}
      >
        <CardHeader>
          <CardTitle>Strengths</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-4 max-h-60">
          <p>+15% from expected</p>
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
          <CardTitle>Weaknesses</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-4 max-h-60">
          <p>-15% from expected</p>
        </CardContent>
      </Card>
    </div>
  );
}
