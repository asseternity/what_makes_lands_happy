import { AccordionFooter } from './Accordion';
import { CorrelationBarChart } from './charts/CorrelationBarChart';

type MetricCorrelationObject = {
  metric: string;
  weight_signed: number;
  weight_magnitude: number;
};

type MetricCorrelationData = {
  weightData: MetricCorrelationObject[];
};

export default function About({ weightData }: MetricCorrelationData) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-2/3 m-5">
        <h1 className="font-bold text-primary text-2xl">
          How "Expected" and "% Away from Expected" Work
        </h1>

        <h2 className="font-bold text-accent text-xl">
          1. What the project is doing
        </h2>
        <p>
          It combines many datasets (happiness, health, economy, etc.) into one
          table for each country. For every metric (like salaries, CO₂, life
          expectancy), it estimates what value we’d <strong>expect</strong> a
          country to have based on its happiness score. It then compares the
          country’s <em>actual</em> number to that <em>expected</em> number, and
          shows the difference as a percentage.
        </p>

        <h2 className="font-bold text-accent text-xl mt-3">
          2. How “expected value” is found
        </h2>
        <ul>
          <li>Line up all countries by happiness score (lowest to highest).</li>
          <li>
            Turn happiness scores into “percentiles” (like bottom 10%, top 50%,
            etc.).
          </li>
          <li>
            Draw a simple trend line between happiness percentiles and metric
            values.
          </li>
          <li>
            For a country, check where its happiness falls on that line → that
            gives the “expected” metric value.
          </li>
        </ul>

        <div className="highlight">
          <strong>In short:</strong> Expected value = what most countries with
          similar happiness tend to have for that metric.
        </div>

        <h2 className="font-bold text-accent text-xl mt-3">
          3. How “% away from expected” is calculated
        </h2>
        <p>Formula:</p>
        <i>(Actual – Expected) ÷ Expected × 100</i>
        <ul>
          <li>
            <strong>Positive %</strong> → the country has{' '}
            <em>more than expected</em>.
          </li>
          <li>
            <strong>Negative %</strong> → the country has{' '}
            <em>less than expected</em>.
          </li>
        </ul>
        <p>
          <em>Example:</em> Expected life expectancy = 75 years, Actual = 80
          years → +6.7% (better than expected).
        </p>

        <h2 className="font-bold text-accent text-xl mt-3">
          4. How to read it
        </h2>
        <ul>
          <li>
            <strong>Strengths</strong>: actual {'>'} expected by a good margin.
          </li>
          <li>
            <strong>Weaknesses</strong>: actual {'<'} expected.
          </li>
          <li>±5% → basically “on track”.</li>
          <li>±20% or more → clear strength or weakness.</li>
        </ul>

        <h2 className="font-bold text-accent text-xl mt-3">
          5. Things to be careful about
        </h2>
        <ul>
          <li>
            <strong>Not cause and effect</strong>: higher or lower than expected
            doesn’t prove it caused happiness.
          </li>
          <li>
            <strong>Direction matters</strong>: higher is good for income, bad
            for pollution.
          </li>
        </ul>

        <div className="highlight">
          ✅ In plain English:
          <ul>
            <li>
              “Expected” = what a country’s number <em>should</em> look like
              given its happiness score, based on world patterns.
            </li>
            <li>
              “% away from expected” = how much higher or lower the country
              actually is compared to that expectation.
            </li>
            <li>Positive = above expected, Negative = below expected.</li>
          </ul>
          <h2 className="font-bold text-accent text-xl mt-3">
            6. Full Correlation Chart
          </h2>
          <CorrelationBarChart correlation_data={weightData} />
          <h2 className="font-bold text-accent text-xl mt-3">7. FAQ</h2>
        </div>
        <AccordionFooter />
      </div>
    </div>
  );
}
