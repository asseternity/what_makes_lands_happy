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
            A data-driven explorer of national wellbeing. It combines public
            datasets to show what correlates with and drives a country’s
            happiness score. Each country page highlights its biggest positive
            and negative outliers.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How to read the map</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            Colors show the official happiness score. Hover to see top metrics.
            Click a country to open its profile with charts and outlier cards.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Country profile</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            Each profile shows three biggest strengths and three biggest
            weaknesses. Strengths are metrics where the country scores far above
            its expected value. Weaknesses are metrics where it scores far below
            expectations.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>Data sources</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            Data comes from public sources and curated datasets. Every country
            detail page links to the original source files and the year used.
            Source names, file names, and extraction dates can be found here.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
