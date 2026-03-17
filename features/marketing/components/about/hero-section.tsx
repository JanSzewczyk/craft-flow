import { SparklesIcon } from "lucide-react";

import { Status } from "@szum-tech/design-system";

export function AboutHeroSection() {
  return (
    <section className="py-16 text-center md:py-24">
      <div className="container">
        <Status variant="primary">
          <SparklesIcon className="size-4" aria-hidden="true" />
          The Trust Builder
        </Status>

        <h1 className="text-display-lg mb-6">Dlaczego stworzyliśmy CraftFlow?</h1>

        <p className="text-body-xl text-muted-foreground mx-auto max-w-2xl">
          Przywracamy rzemieślnikom czas na rzemiosło.
        </p>
      </div>
    </section>
  );
}
