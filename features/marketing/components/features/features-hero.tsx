import { User, LayoutList, Palette } from "lucide-react";

import { Status } from "@szum-tech/design-system";

export function FeaturesHero() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-display-lg text-foreground mx-auto max-w-200">Funkcje stworzone dla Twojego warsztatu.</h1>
        <div className="mt-8 flex flex-wrap justify-center gap-3 md:gap-6">
          <Status variant="primary">
            <User className="size-4" aria-hidden="true" /> Portal Klienta
          </Status>
          <Status variant="primary">
            <LayoutList className="size-4" aria-hidden="true" /> Zarządzanie Projektami
          </Status>
          <Status variant="primary">
            <Palette className="size-4" aria-hidden="true" /> Branding Firmowy
          </Status>
        </div>
      </div>
    </section>
  );
}
