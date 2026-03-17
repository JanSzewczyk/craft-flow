import * as React from "react";

export type LegalSectionProps = {
  id: string;
  number: number;
  title: string;
  children: React.ReactNode;
};

export function LegalSection({ id, number, title, children }: LegalSectionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-heading-h2 text-foreground mt-10 mb-4">
        <span className="text-primary">§{number}.</span> {title}
      </h2>
      {children}
    </section>
  );
}
