"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@szum-tech/design-system";
import { FAQ_ITEMS } from "~/features/marketing/constants";

export function PricingFAQ() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {FAQ_ITEMS.map((item, index) => (
        <AccordionItem key={index} value={`faq-${index}`}>
          <AccordionTrigger className="group-hover:text-primary text-left font-semibold transition-colors">
            {item.question}
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-body-sm text-muted-foreground leading-relaxed">{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
