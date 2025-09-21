import { useState, useRef } from 'react';
import logo from '/world-map-svgrepo-com.svg';
import data from '../dummy/happiness_df.json';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import WorldMap from './WorldMap';

function MainContent() {
  const [count, setCount] = useState<number>(1);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  if (count - 1 > data.length) {
    setCount(0);
  }

  return (
    <div className="container w-full h-screen bg-primary-foreground font-display">
      <div className="bg-primary text-primary-foreground flex flex-row justify-start items-center gap-4 p-3 w-full h-20">
        <a href="" target="_blank">
          <img src={logo} className="logo h-16" alt="Vite logo" />
        </a>
        <h1>Happiness Report</h1>
      </div>
      <div
        className="card m-5 p-4 flex flex-col justify-center items-center gap-4 relative"
        ref={mapContainerRef}
      >
        <WorldMap mapContainerRef={mapContainerRef} />
      </div>
      <div className="card m-5 p-4 flex flex-col justify-center items-center gap-4">
        <Collapsible>
          <CollapsibleTrigger>What is this project?</CollapsibleTrigger>
          <CollapsibleContent>
            Every place hums with its own rhythm—some promise opportunity,
            others serenity, some quietly drain the soul. The art lies in
            discerning what truly matters when choosing where to root yourself.
          </CollapsibleContent>
        </Collapsible>
        <Button
          onClick={() => setCount((count) => count + 1)}
          className="w-14 bg-accent"
        >
          NEXT
        </Button>
        <Card className="w-50">
          <CardHeader>
            <CardTitle>Happy Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              The number {count} happiest country is {data[count - 1].Country}{' '}
              with the happiness of {data[count].Happiness}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MainContent;
