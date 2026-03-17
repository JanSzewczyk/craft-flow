"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@szum-tech/design-system";
import { CONTACT_FAQ_ITEMS } from "~/features/contact/constants/contact-faq-items";

export function ContactFAQ() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {CONTACT_FAQ_ITEMS.map((item, index) => (
        <AccordionItem key={index} value={`contact-faq-${index}`}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>
            <p className="text-body-sm text-muted-foreground">{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
