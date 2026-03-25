import { PLANS } from "~/features/billing/constants";
import { PricingCard } from "~/features/marketing/components";
import { selectPlan } from "~/features/marketing/server/actions/select-plan";

export function PricingCardsSection() {
  return (
    <section className="container py-16 md:py-24">
      {/* Header */}
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h1 className="text-display-md mb-4">Wybierz plan dla swojego warsztatu</h1>
        <p className="text-lead">
          Wypróbuj plan Basic za darmo przez 14 dni. Nie wymagamy karty płatniczej. Dołącz do tysięcy rzemieślników,
          którzy zaufali CraftFlow.
        </p>
      </div>

      <div className="mb-24 grid grid-cols-1 items-center gap-8 md:grid-cols-3">
        {PLANS.map((plan, index) => (
          <div key={plan.id} className={plan.featured && index === 1 ? "order-first md:order-0" : ""}>
            <PricingCard plan={plan} onSelectAction={selectPlan} />
          </div>
        ))}
      </div>
    </section>
  );
}
