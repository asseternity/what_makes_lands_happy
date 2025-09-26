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
        <AccordionContent className="flex flex-col gap-4 text-balance">
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
            Data is pulled from public and curated files. Each country detail
            links to the original source and the year used.
          </p>
          <ul>
            <li>
              <strong>Examples of inputs:</strong> World Happiness, wage data,
              life expectancy, energy and power mix, population, CO₂, food
              production, petrol prices and more.
            </li>
            <li>
              <strong>Updates & versions:</strong> datasets are cached and
              refreshed periodically; references to sources are provided here.
            </li>
            <li>
              <strong>Reporting issues:</strong> if you spot an error, source
              corrections are tracked through the project repo.
            </li>
            <li>
              <strong>Practical caveats:</strong> These are observational
              patterns, not proof of cause. Percent differences can be
              misleading when the expected value is near zero — in those cases
              we show absolute or normalized numbers instead.
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
