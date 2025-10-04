import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function AccordionFooter() {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>What is this project?</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance text-sm">
          <p>
            A data explorer that brings together many public datasets to help
            you understand what goes along with a country’s happiness score.
          </p>
          <ul>
            <li>
              <strong>What it contains:</strong> happiness scores plus lots of
              supporting metrics (health, income, energy, population, emissions,
              food, etc.).
            </li>
            <li>
              <strong>What it shows:</strong> for each metric you get the actual
              number, what we’d expect given that country’s happiness, and how
              far the country is from that expectation.
            </li>
            <li>
              <strong>Why useful:</strong> quickly spot where a country is doing
              noticeably better or worse than peers with similar happiness
              levels.
            </li>
            <li>
              <strong>Quick reminder:</strong> these are comparisons and
              patterns — they don’t prove cause and effect.
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How to read the map</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            The map is the main entry point — it colors countries by official
            happiness and helps you jump into each country’s details.
          </p>
          <ul>
            <li>
              <strong>Colors:</strong> show happiness (greens = higher, reds =
              lower).
            </li>
            <li>
              <strong>Click:</strong> opens the country profile with metric
              cards and comparisons.
            </li>
            <li>
              <strong>Search & keyboard:</strong> use the search box or press
              Enter to jump to a country.
            </li>
            <li>
              <strong>Controls:</strong> there are zoom controls to inspect
              small countries or regions.
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Data tables</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            Country pages give both a quick summary and deeper numbers so you
            can understand strengths, weaknesses and the full metric context.
          </p>
          <ul>
            <li>
              <strong>Metric cards:</strong> actual value, expected value (based
              on similar-happiness countries), and the difference.
            </li>
            <li>
              <strong>Context:</strong> global average, top country and range
              for each metric so you can compare easily.
            </li>
            <li>
              <strong>Highlights:</strong> both the biggest positive deviations
              and the biggest negative ones are surfaced — but the page also
              lets you explore every metric, not just the top 3 lists.
            </li>
            <li>
              <strong>Interpretation tip:</strong> positive difference means the
              country is above expectation; negative means below. For some
              metrics (pollution, infant deaths) lower is better — interpret
              accordingly.
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>Data sources</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            World Happiness Report 2024 —
            jainaru/world-happiness-report-2024-yearly-updated (Kaggle)
          </p>
          <p>Global Salary Data — zedataweaver/global-salary-data (Kaggle)</p>
          <p>
            Most Polluted Cities and Countries (IQAir Index) —
            ramjasmaurya/most-polluted-cities-and-countries-iqair-index (Kaggle)
          </p>
          <p>
            Countries Life Expectancy —
            amirhosseinmirzaie/countries-life-expectancy (Kaggle)
          </p>
          <p>
            Netflix subscription fee in different countries —
            prasertk/netflix-subscription-price-in-different-countries (Kaggle)
          </p>
          <p>
            Most Dangerous Countries for Women 2024 —
            arpitsinghaiml/most-dangerous-countries-for-women-2024 (Kaggle)
          </p>
          <p>
            Average Monthly Surface Temperature (1940–2024) —
            samithsachidanandan/average-monthly-surface-temperature-1940-2024
            (Kaggle)
          </p>
          <p>
            World Population Dataset —
            iamsouravbanerjee/world-population-dataset (Kaggle)
          </p>
          <p>
            World Energy Consumption — pralabhpoudel/world-energy-consumption
            (Kaggle)
          </p>
          <p>
            World Bank — World Development Indicators (Kaggle mirror) —
            nicolasgonzalezmunoz/world-bank-world-development-indicators
            (Kaggle)
          </p>
          <p>
            World Food Production — rafsunahmad/world-food-production (Kaggle)
          </p>
          <p>
            Petrol / Gas Prices Worldwide — zusmani/petrolgas-prices-worldwide
            (Kaggle)
          </p>
          <p>
            CO2 Emissions Around the World —
            koustavghosh149/co2-emission-around-the-world (Kaggle)
          </p>
          <p>
            Global Cost of Living (Numbeo scrape) —
            mvieira101/global-cost-of-living (Kaggle)
          </p>
          <p>
            GDP Per Capita (all countries) —
            nitishabharathi/gdp-per-capita-all-countries (Kaggle)
          </p>
          <p>
            Military Expenditure of Countries (1960–2019) —
            nitinsss/military-expenditure-of-countries-19602019 (Kaggle)
          </p>
          <p>
            Countries by Intentional Homicide Rate —
            bilalwaseer/countries-by-intentional-homicide-rate (Kaggle)
          </p>
          <p>
            Average Age of Countries — divyansh22/average-age-of-countries
            (Kaggle)
          </p>
          <p>Inflation, 2022 — meeratif/inflation-2022 (Kaggle)</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
