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
import CountryProfile from './CountryProfile';
import type { CountryStats } from './ExpectedLevelCalculator';
import type { AbsoluteMetricData } from './AbsoluteMetricData';
import { MetricBarChart } from './charts/MetricBarChart';
import { MultiMetricLineChart } from './charts/MultiMetricLineChart';
import { MetricsTable } from './charts/MetricsTable';

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
  countryMetrics: CountryStats | undefined | null; // all metrics for our country
  absoluteStatistics: AbsoluteMetricData[]; // highest/lowest/average/our/expected for all metrics
};

export function CarouselOfCards({
  flash = false,
  countryName,
  countryMetrics,
  absoluteStatistics,
}: countryData) {
  const slideNumber = countryMetrics ? 3 : 1;

  return (
    <Carousel className="w-2/3 max-w-xs" opts={{ loop: true }}>
      <CarouselContent>
        {Array.from({ length: slideNumber }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card
                className={`bg-accent transition-transform-colors duration-300 ${flash ? 'scale-90 bg-primary' : ''}`}
              >
                <CardHeader>
                  {index === 0 && <CardTitle>Happy Countries</CardTitle>}
                  {index === 1 && <CardTitle>{`tbd`}</CardTitle>}
                  {index === 2 && <CardTitle>{`tbd`}</CardTitle>}
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-4 max-h-60">
                  {index === 0 ? (
                    <>
                      {countryMetrics && (
                        <>
                          <p>
                            {titleCase(countryName)} has the happiness rate of{' '}
                            {countryMetrics.Happiness}
                          </p>
                          {countryMetrics ? (
                            <div>
                              <Progress
                                value={countryMetrics.Happiness * 10}
                                className="mb-5"
                              />
                              <div>Chart goes here</div>
                            </div>
                          ) : (
                            <Progress value={0} className="mb-5" />
                          )}
                        </>
                      )}
                      {!countryMetrics && (
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
                  {index === 1 && (
                    <div>
                      {countryMetrics ? (
                        <p>{`data found: tbd`}</p>
                      ) : (
                        <p>No data</p>
                      )}
                    </div>
                  )}
                  {index === 2 && (
                    <div>
                      {countryMetrics ? (
                        <p>{`data found: tbd`}</p>
                      ) : (
                        <p>No data</p>
                      )}
                    </div>
                  )}
                </CardContent>
                {index === 0 && (
                  <CardFooter className="mt-auto flex-col gap-2">
                    <CountryProfile
                      Country={countryName}
                      disabled={!countryMetrics}
                      flash={flash}
                    />
                  </CardFooter>
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
