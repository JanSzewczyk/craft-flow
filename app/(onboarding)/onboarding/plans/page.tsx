"use client";

import { PricingTable } from "@clerk/nextjs";

export default function PlansPage() {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="text-center">
        <h1 className="text-heading-h1 text-foreground">Wybierz plan</h1>
        <p className="text-muted-foreground text-body-lg mt-2">14 dni testów za darmo</p>
      </div>

      <div className="w-full">
        <PricingTable newSubscriptionRedirectUrl="/onboarding/company-details" />
      </div>
    </div>
  );
}
