import { CheckCircle2, X } from "lucide-react";

import { type ButtonVariantType } from "@szum-tech/design-system";

/**
 * Pricing feature
 */
export type PricingFeature = {
  text: string;
  included: boolean;
};

/**
 * Pricing plan configuration
 */
export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  buttonLabel: string;
  buttonVariant: ButtonVariantType;
  featured: boolean;
  features: PricingFeature[];
};

/**
 * Pricing plans configuration for the pricing page
 */
export const PRICING_PLANS: Array<PricingPlan> = [
  {
    id: "basic",
    name: "Basic",
    description: "Dla rzemieślników startujących z cyfryzacją. 14 dni za darmo.",
    price: 79,
    period: "miesiąc",
    buttonLabel: "Rozpocznij trial",
    buttonVariant: "outline" as const,
    featured: false,
    features: [
      { text: "5 projektów", included: true },
      { text: "Podstawowe wsparcie", included: true },
      { text: "Portal klienta", included: true },
      { text: "Własny branding", included: false }
    ]
  },
  {
    id: "standard",
    name: "Standard",
    description: "Idealny dla rozwijających się warsztatów.",
    price: 149,
    period: "miesiąc",
    buttonLabel: "Wybierz Standard",
    buttonVariant: "default",
    featured: true,
    features: [
      { text: "20 projektów", included: true },
      { text: "Własny branding", included: true },
      { text: "Priorytetowe wsparcie", included: true },
      { text: "Smart links", included: true }
    ]
  },
  {
    id: "premium",
    name: "Premium",
    description: "Pełna moc dla liderów branży.",
    price: 299,
    period: "miesiąc",
    buttonLabel: "Wybierz Premium",
    buttonVariant: "secondary",
    featured: false,
    features: [
      { text: "Nielimitowane projekty", included: true },
      { text: "Zdjęcia 4K quality", included: true },
      { text: "Pełny dostęp API", included: true },
      { text: "Dedykowany opiekun", included: true }
    ]
  }
] as const;

/**
 * Icons for pricing features
 */
export const FEATURE_ICONS = {
  check: CheckCircle2,
  cross: X
} as const;
