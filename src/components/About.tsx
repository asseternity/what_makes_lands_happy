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
        <h1 className="font-bold text-primary text-2xl">About this project</h1>

        <h2 className="font-bold text-accent text-xl mt-4">Goal</h2>
        <p>
          Build a compact, evidence-backed dashboard that explains which
          measurable national attributes tend to appear in happier countries.
          The site is an exploratory tool. It highlights patterns. It does not
          prove cause and effect.
        </p>

        <h2 className="font-bold text-accent text-xl mt-4">
          What's in the data
        </h2>
        <ul>
          <li>Multiple public datasets merged per country with provenance.</li>
          <li>
            Metrics include economy, health, environment, demographics and
            prices.
          </li>
          <li>
            Numeric columns are used for correlation and predictive views.
          </li>
        </ul>

        <h2 className="font-bold text-accent text-xl mt-4">
          How we measure association (correlation)
        </h2>
        <p>
          For each numeric metric we compute the Pearson correlation with the
          Happiness score across all countries. Results range from −1 to +1.
          Positive means higher values tend to appear with higher happiness.
          Negative means the opposite. The absolute value is used to rank
          metrics by strength.
        </p>
        <p className="mt-2">
          Interpretation guidance:
          <ul>
            <li>|r| &lt; 0.2 — weak or no linear association.</li>
            <li>0.2 ≤ |r| &lt; 0.5 — moderate association.</li>
            <li>|r| ≥ 0.5 — strong association.</li>
          </ul>
        </p>

        <h2 className="font-bold text-accent text-xl mt-4">
          What “Expected” means
        </h2>
        <p>
          Expected value is a data-driven prediction of what a country’s metric
          would typically be given its Happiness score. It is computed as:
        </p>
        <ol>
          <li>Rank countries by Happiness and convert ranks to percentiles.</li>
          <li>
            Use the observed metric values and corresponding happiness
            percentiles to fit a simple linear trend (percentile → metric).
          </li>
          <li>
            For any country, find its happiness percentile then use the trend
            line to predict the metric. That prediction is the expected value.
          </li>
        </ol>
        <p>
          The method handles tied happiness scores and falls back to the metric
          mean when there is no spread.
        </p>

        <h2 className="font-bold text-accent text-xl mt-4">
          % Away From Expected
        </h2>
        <p>
          Calculated as <em>(Actual − Expected) ÷ Expected × 100</em>. Positive
          means the country has more than expected. Negative means less than
          expected. Example: Expected life expectancy 75, actual 80 → +6.7%.
        </p>
        <p>
          Practical thresholds used on the site:
          <ul>
            <li>Within ±5% — on track.</li>
            <li>±5–20% — notable difference.</li>
            <li>±20% or more — strong outlier (worth deeper investigation).</li>
          </ul>
        </p>

        <h2 className="font-bold text-accent text-xl mt-4">
          How to read strengths and weaknesses
        </h2>
        <ul>
          <li>
            "Strength" = metric is substantially higher than expected for that
            happiness level.
          </li>
          <li>"Weakness" = metric is substantially lower than expected.</li>
          <li>
            Direction matters. Higher is not always better. For example higher
            income is usually positive. Higher pollution is negative. Check the
            metric meaning before judging the sign.
          </li>
        </ul>

        <h2 className="font-bold text-accent text-xl mt-4">
          What this is useful for
        </h2>
        <ul>
          <li>
            Quickly identify a country's biggest relative strengths and
            weaknesses.
          </li>
          <li>
            Compare countries with similar happiness to find unexpected
            differences.
          </li>
          <li>
            Generate hypotheses for researchers or journalists to investigate
            further.
          </li>
          <li>
            Provide high-level guidance for people evaluating potential places
            to live.
          </li>
        </ul>

        <h2 className="font-bold text-accent text-xl mt-4">
          Limitations and cautions
        </h2>
        <ul>
          <li>
            <strong>Correlation ≠ causation.</strong> Associations may reflect
            confounders or shared drivers, not direct causes.
          </li>
          <li>
            <strong>Data quality and coverage.</strong> Missing values and
            measurement differences across sources affect results.
          </li>
          <li>
            <strong>Scale and meaning.</strong> Some metrics are per-capita,
            others are totals. Some metrics where higher is worse must be read
            with care.
          </li>
          <li>Use this tool as a starting point, not a final judgment.</li>
        </ul>

        <h2 className="font-bold text-accent text-xl mt-4">
          Full correlation chart
        </h2>
        <p className="mb-2">Signed Pearson correlations sorted by magnitude.</p>
        <CorrelationBarChart correlation_data={weightData} />

        <h2 className="font-bold text-accent text-xl mt-4">FAQ</h2>
        <p>
          The FAQ below addresses common interpretation questions and links to
          the code paths that compute expected values and correlations.
        </p>

        <AccordionFooter />
      </div>
    </div>
  );
}
