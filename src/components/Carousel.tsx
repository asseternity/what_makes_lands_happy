import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

type countryData = {
  countryName: string;
  happiness: number | undefined | null;
  countryStrength: string;
  countryWeakness: string;
};

export function CarouselOfCards({
  countryName,
  happiness,
  countryStrength,
  countryWeakness,
}: countryData) {
  return (
    <Carousel className="w-2/3 max-w-xs" opts={{ loop: true }}>
      <CarouselContent>
        {Array.from({ length: 3 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardHeader>
                  {index === 0 && <CardTitle>Happy Countries</CardTitle>}
                  {index === 1 && <CardTitle>Strengths</CardTitle>}
                  {index === 2 && <CardTitle>Weaknesses</CardTitle>}
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-4 max-h-60">
                  {index === 0 ? (
                    <>
                      {happiness && (
                        <>
                          <p>
                            {titleCase(countryName)} has the happiness rate of{' '}
                            {happiness}
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
                    </>
                  ) : (
                    <></>
                  )}
                  {index === 1 && <p>+15% from expected</p>}
                  {index === 2 && <p>-15% from expected</p>}
                </CardContent>
                {index === 0 ? (
                  <CardFooter className="mt-auto flex-col gap-2">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!happiness}
                    >
                      Profile
                    </Button>
                  </CardFooter>
                ) : (
                  <></>
                )}
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
