import { useState } from 'react';
import reactLogo from '/react.svg';
import viteLogo from '/vite.svg';
import './index.css';
import data from './dummy/happiness_df.json';

function App() {
  const [count, setCount] = useState(0);

  if (count > data.length) {
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
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          The current country is {data[count].Country} with the happiness of{' '}
          {data[count].Happiness}
        </p>
      </div>
    </>
  );
}

export default App;
