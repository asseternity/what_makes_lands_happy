type CountryStats = {
  Country: string;
  Country_clean: string;
  Region: string;
  Happiness: number;
  'Median Salary': number | null;
  'Average Salary': number | null;
  'Lowest Salary': number | null;
  'Highest Salary': number | null;
  'Infant Survival Rate': number | null;
  'Alcohol Consumption Rate': number | null;
  'Life Expectancy': number | null;
  'Netflix (USD/month)': number | null;
  'Women Safety Index': number | null;
  'Average Winter Temperature': number | null;
  'Average Summer Temperature': number | null;
  Population: number | null;
  'Energy Per Capita': number | null;
  '% of Power from Fossil Fuels': number | null;
  '% of Power from Nuclear': number | null;
  '% of Power from Renewables': number | null;
  '% of Agricultural Land': number | null;
  '% of Forest Land': number | null;
  Territory: number | null;
  'Average Rainfall': number | null;
  Corruption: number | null;
  'Wheat Production (tonnes)': number | null;
  'Rye Production (tonnes)': number | null;
  'Potatoes Production (tonnes)': number | null;
  'Meat, chicken Production (tonnes)': number | null;
  'Avocados Production (tonnes)': number | null;
  'Petrol Price (USD/liter)': number | null;
  'Daily Oil Consumption (Barrels)': number | null;
  'CO2 Emissions (ton per capita)': number | null;
};

type CountryStatsArray = CountryStats[];

const EPS = 1e-6;

function getMetricRange(data: CountryStatsArray, metric: keyof CountryStats) {
  const vals = data
    .map((d) => d[metric] as number | null)
    .filter((v): v is number => typeof v === 'number' && !isNaN(v));
  if (vals.length === 0) return { min: 0, max: 0 };
  return { min: Math.min(...vals), max: Math.max(...vals) };
}

function normalizeValue(value: number, min: number, max: number) {
  if (max - min < EPS) return 0.5; // fallback when no spread
  return (value - min) / (max - min);
}

function happinessRatioFor(data: CountryStatsArray, countryHappiness: number) {
  const hs = data.map((d) => d.Happiness).filter((v) => !isNaN(v));
  const hMin = Math.min(...hs);
  const hMax = Math.max(...hs);
  if (hMax - hMin < EPS) return 0.5;
  return (countryHappiness - hMin) / (hMax - hMin);
}

function expectedLevel(
  data: CountryStatsArray,
  happiness: number
  // metricName: string
): number {
  // const targetMetric = metricName as keyof CountryStats;
  const ratio = happinessRatioFor(data, happiness);
  return ratio;
}

export {
  EPS,
  expectedLevel,
  normalizeValue,
  happinessRatioFor,
  getMetricRange,
};
export type { CountryStats };
