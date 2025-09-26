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
            A data-driven explorer of national wellbeing that combines public
            datasets to show what correlates with — and typically accompanies —
            a country’s happiness score.
          </p>
          <ul>
            <li>
              <strong>Main goal:</strong> Explain which measurable factors line
              up with happiness.
            </li>
            <li>
              <strong>What we do:</strong> gather, clean and merge many
              datasets; compute correlations; predict an “expected” value for
              each metric given a country’s happiness.
            </li>
            <li>
              <strong>Output:</strong> country profiles that highlight the
              biggest strengths and weaknesses versus expectation.
            </li>
            <li>
              <strong>Quick caveat:</strong> these are statistical associations
              — not proof of cause and effect.
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How to read the map</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            The map visualizes the official happiness score and provides entry
            points to each country’s deeper profile.
          </p>
          <ul>
            <li>
              <strong>Colors:</strong> represent the happiness score (green =
              higher, red = lower).
            </li>
            <li>
              <strong>Hover:</strong> shows top metrics for that country at a
              glance.
            </li>
            <li>
              <strong>Click:</strong> opens the country profile with charts,
              expected vs actual values, and outlier cards.
            </li>
            <li>
              <strong>Search / keyboard:</strong> use the search box or press
              Enter on a selected country name.
            </li>
            <li>
              <strong>Tip:</strong> use the legend and zoom controls to inspect
              small countries or regions.
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Data tables</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            Each country profile exposes per-metric details so you can compare
            actual performance to what we’d expect for that country’s happiness
            level.
          </p>
          <ul>
            <li>
              <strong>Top 3 strengths:</strong> metrics where the country is
              noticeably above expected.
            </li>
            <li>
              <strong>Top 3 weaknesses:</strong> metrics where the country is
              noticeably below expected.
            </li>
            <li>
              <strong>Shown columns:</strong> actual value, expected value, %
              away from expected, global average, top country and year/source.
            </li>
            <li>
              <strong>How % away works (plain):</strong> (Actual − Expected) ÷
              Expected × 100 — positive means higher than expected, negative
              means lower.
            </li>
            <li>
              <strong>Edge cases:</strong> when the expected value is near zero
              we show absolute differences or a normalized score to avoid
              misleading huge percentages.
            </li>
            <li>
              <strong>Export:</strong> you can download raw tables as JSON/CSV
              from the exports area for further analysis.
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>Data sources</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            All figures come from public or curated data files. Every country
            detail page links to the original source and the year used for that
            metric.
          </p>
          <ul>
            <li>
              <strong>Types of sources:</strong> international reports, open
              datasets (CSV), and curated Kaggle files.
            </li>
            <li>
              <strong>Traceability:</strong> source name, file name and
              extraction year are listed on each country page.
            </li>
            <li>
              <strong>Licensing & attribution:</strong> sources keep their
              original licenses — check the linked source file for terms.
            </li>
            <li>
              <strong>Update cadence:</strong> datasets are refreshed
              periodically; version and extraction date are shown with each
              source link.
            </li>
            <li>
              <strong>Got a correction?</strong> report source errors via the
              repository / issue tracker (links provided on the project page).
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
