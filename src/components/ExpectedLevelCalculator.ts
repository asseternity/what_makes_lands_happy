type CountryStats = {
  Country: string;
  Country_clean: string;
  Region: string;
  'Happiness (score 0-10)': number | null;
  'Median Salary (USD/year)': number | null;
  'Average Salary (USD/year)': number | null;
  'Lowest Salary (USD/year)': number | null;
  'Highest Salary (USD/year)': number | null;
  'IQAir_AQI (AQI index)': number | null;
  'Infant Survival Rate (per 1000 births)': number | null;
  'Alcohol Consumption Rate (liters per capita per year)': number | null;
  'Life Expectancy (years)': number | null;
  Netflix: number | null;
  'Women Safety Index (score 0-1)': number | null;
  'Average Winter Temperature (°C)': number | null;
  'Average Summer Temperature (°C)': number | null;
  'Population (people)': number | null;
  'Energy Per Capita (kWh per capita)': number | null;
  '% of Power from Fossil Fuels (%)': number | null;
  '% of Power from Nuclear (%)': number | null;
  '% of Power from Renewables (%)': number | null;
  '% of Agricultural Land (%)': number | null;
  '% of Forest Land (%)': number | null;
  'Territory (sq km)': number | null;
  'Average Rainfall (mm/year)': number | null;
  'Corruption (std score)': number | null;
  'Wheat Production (tonnes)': number | null;
  'Rye Production (tonnes)': number | null;
  'Potatoes Production (tonnes)': number | null;
  'Meat, Chicken Production (tonnes)': number | null;
  'Avocados Production (tonnes)': number | null;
  'Petrol Price (USD/liter)': number | null;
  'Daily Oil Consumption (barrels/day)': number | null;
  'CO2 Emissions (tonnes per capita)': number | null;
  'Price per Square Meter to Buy Apartment in City Centre (USD/sqm)':
    | number
    | null;
  'Fitness Club, Monthly Fee for 1 Adult (USD/month)': number | null;
  'Internet (60 Mbps or More, Unlimited Data, Cable/ADSL) (USD/month)':
    | number
    | null;
  'Coke/Pepsi (0.33 liter bottle, in restaurants) (USD/bottle)': number | null;
  'Meal for 2 People, Mid-range Restaurant, Three-course (USD/meal)':
    | number
    | null;
  'GDP Per Capita (USD/year)': number | null;
  'Military Expenditure (USD/year)': number | null;
  'Yearly Homicide Rate (% per 100,000 people) (per 100,000 people)':
    | number
    | null;
  'Average Age (years)': number | null;
  'Inflation Rate (year, %)': number | null;
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
  const raw = (value - min) / (max - min);
  // clamp to [0,1]
  if (raw < 0) return 0;
  if (raw > 1) return 1;
  return raw;
}

function expectedLevel(
  data: CountryStatsArray,
  happiness: number,
  metricName: keyof CountryStats
): number {
  const EPS = 1e-6;

  const pairs = data
    .map((d) => ({
      h: d['Happiness (score 0-10)'],
      m: d[metricName] as number | null,
    }))
    .filter(
      (p): p is { h: number; m: number } =>
        typeof p.h === 'number' && typeof p.m === 'number' && !isNaN(p.h)
    );

  if (pairs.length === 0) return NaN;

  const n = pairs.length;
  const sortedH = pairs
    .map((p) => p.h)
    .slice()
    .sort((a, b) => a - b);

  // map each unique happiness value to its average percentile [0..1]
  const pctMap = new Map<number, number>();
  const uniqH = Array.from(new Set(sortedH));
  for (const v of uniqH) {
    const first = sortedH.indexOf(v);
    const last = sortedH.lastIndexOf(v);
    const avgIndex = (first + last) / 2;
    const pct = n === 1 ? 0.5 : avgIndex / (n - 1);
    pctMap.set(v, pct);
  }

  // regression on rank (percentile) -> raw metric
  const reg = pairs.map((p) => ({ r: pctMap.get(p.h) as number, m: p.m }));
  const meanR = reg.reduce((s, x) => s + x.r, 0) / n;
  const meanM = reg.reduce((s, x) => s + x.m, 0) / n;

  let cov = 0;
  let varR = 0;
  for (const p of reg) {
    const dr = p.r - meanR;
    cov += dr * (p.m - meanM);
    varR += dr * dr;
  }

  if (varR < EPS) {
    return meanM;
  }

  const slope = cov / varR;
  const intercept = meanM - slope * meanR;

  // get percentile for input happiness (interpolate if necessary)
  let r0 = pctMap.get(happiness);
  if (r0 === undefined) {
    if (n === 1) r0 = 0.5;
    else if (happiness <= sortedH[0]) r0 = 0;
    else if (happiness >= sortedH[n - 1]) r0 = 1;
    else {
      let idx = sortedH.findIndex((v) => v >= happiness);
      if (idx === -1) idx = n - 1;
      if (idx === 0) r0 = 0;
      else {
        const lo = sortedH[idx - 1];
        const hi = sortedH[idx];
        const loPct = pctMap.get(lo) as number;
        const hiPct = pctMap.get(hi) as number;
        const t = (happiness - lo) / (hi - lo);
        r0 = loPct + t * (hiPct - loPct);
      }
    }
  }

  const predictedM = intercept + slope * r0;
  return predictedM;
}

export { EPS, expectedLevel, normalizeValue, getMetricRange };
export type { CountryStats };
