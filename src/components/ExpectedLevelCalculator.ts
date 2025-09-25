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
    .map((d) => ({ h: d.Happiness, m: d[metricName] as number | null }))
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
