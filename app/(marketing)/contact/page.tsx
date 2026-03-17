import { type Metadata } from "next";

import { ContactHeader, ContactSection } from "~/features/contact";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Masz pytanie do CraftFlow? Napisz do nas – odpowiemy w ciągu 24 godzin.",
  openGraph: {
    title: "Kontakt – CraftFlow",
    description: "Skontaktuj się z zespołem CraftFlow.",
    type: "website"
  }
};

export default function ContactPage() {
  return (
    <>
      <ContactHeader title="Skontaktuj się z nami" description="Masz pytanie? Chętnie odpowiemy." />
      <ContactSection />
    </>
  );
}
