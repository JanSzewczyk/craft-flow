export const Plan = {
  BASIC: "basic",
  STANDARD: "standard",
  PREMIUM: "premium"
} as const;

export type Plan = (typeof Plan)[keyof typeof Plan];

export type PlanConfig = {
  id: Plan;
  name: string;
  price: number;
  currency: string;
  features: string[];
  hasBranding: boolean;
  isRecommended: boolean;
};

export const PLANS: PlanConfig[] = [
  {
    id: Plan.BASIC,
    name: "Basic",
    price: 79,
    currency: "PLN",
    features: ["5 projektów / miesiąc", "2 szablony etapów", "Branding CraftFlow"],
    hasBranding: false,
    isRecommended: false
  },
  {
    id: Plan.STANDARD,
    name: "Standard",
    price: 149,
    currency: "PLN",
    features: ["20 projektów / miesiąc", "10 szablonów", "Własny branding", "Jakość HD"],
    hasBranding: true,
    isRecommended: true
  },
  {
    id: Plan.PREMIUM,
    name: "Premium",
    price: 299,
    currency: "PLN",
    features: ["Nieograniczone projekty", "White-label e-mail", "Jakość 4K", "Priorytetowy czat wsparcia"],
    hasBranding: true,
    isRecommended: false
  }
];

export function planHasBranding(planId: Plan): boolean {
  const plan = PLANS.find((p) => p.id === planId);
  return plan?.hasBranding ?? false;
}

/**
 * Clerk plan slugs — must match slugs configured in Clerk Dashboard > Billing > Plans.
 * Used by `detectClerkPlan()` to map Clerk subscriptions to our Plan enum.
 */
export const CLERK_PLAN_SLUGS: Record<Plan, string> = {
  [Plan.BASIC]: "basic",
  [Plan.STANDARD]: "standard",
  [Plan.PREMIUM]: "premium"
} as const;
