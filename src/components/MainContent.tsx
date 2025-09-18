import { useState } from 'react';
import reactLogo from '/react.svg';
import viteLogo from '/vite.svg';
import data from '../dummy/happiness_df.json';
import { Button, Text, Card, Space } from '@mantine/core';

function MainContent() {
  const [count, setCount] = useState(1);

  if (count - 1 > data.length) {
    setCount(0);
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>What Makes Lands Happy?</h1>
      <div className="card">
        <Text>
          Every place hums with its own rhythm—some promise opportunity, others
          serenity, some quietly drain the soul. The art lies in discerning what
          truly matters when choosing where to root yourself.
        </Text>
        <Button onClick={() => setCount((count) => count + 1)} m={20}>
          NEXT
        </Button>
        <Card m={20} shadow="sm" padding="lg" radius="md" withBorder>
          <p>
            The number {count} happiest country is {data[count - 1].Country}{' '}
            with the happiness of {data[count].Happiness}
          </p>
        </Card>
      </div>
    </>
  );
}

export default MainContent;
