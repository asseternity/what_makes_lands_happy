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

type CountryData = {
  name: string;
  happiness: number;
  metricName: string;
  metricValue: number;
};

export default function ExpectedLevel(
  data: CountryStatsArray,
  countryData: CountryData
): number {
  // set up vars and their types
  let targetCountryName: string | null = countryData.name;
  let targetCountryHappiness: number | null = countryData.happiness;
  let targetMetricName: string | null = countryData.metricName;
  let targetMetricValue: number | null = countryData.metricValue;

  // grab the whole json, find the best and last happiest country
  let happiestCountry = data.reduce((prev, curr) =>
    curr.Happiness > prev.Happiness ? curr : prev
  );
  let highestHappiness: number = happiestCountry.Happiness;
  let saddestCountry = data.reduce((prev, curr) =>
    curr.Happiness > prev.Happiness ? prev : curr
  );
  let lowestHappiness: number = saddestCountry.Happiness;

  // grab the highest and lowest values for the metric
  let bestMetricCountry = data.reduce((prev, curr) =>
    (curr as any)[targetMetricName] > (prev as any)[targetMetricName]
      ? curr
      : prev
  );
  let highestMetric: number = (bestMetricCountry as any)[targetMetricName];
  let worstMetricCountry = data.reduce((prev, curr) =>
    (curr as any)[targetMetricName] > (prev as any)[targetMetricName]
      ? prev
      : curr
  );
  let lowestMetric: number = (worstMetricCountry as any)[targetMetricName];

  // considering our happiness (1) rank and (2) numerical median / mean / weighted / average value, what is the EXPECTED metric
  // how far are we off? (1) by rank, (2) by  numerical median / mean / weighted / average value
  // basically it's a question of: (1) what total rank of happiness are we, and (2) how for up or down is this metric?

  // normalize happiness to 0–1
  let happinessRatio =
    (targetCountryHappiness - lowestHappiness) /
    (highestHappiness - lowestHappiness);

  // expected metric by interpolation
  let expectedMetric =
    lowestMetric + happinessRatio * (highestMetric - lowestMetric);

  return expectedMetric;
}
