import { ArrowRight, Shield, Users } from "lucide-react";

import { expect } from "storybook/test";

import { FeatureSection } from "./feature-section";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Marketing/Features/Feature Section",
  component: FeatureSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
});

export const MinimalFeature = meta.story({
  args: {
    heading: "Zarządzaj swoim warsztatem",
    illustration: <div>Illustration placeholder</div>
  }
});

MinimalFeature.test("Renders heading, illustration, and no optional elements", async ({ canvas, step }) => {
  await step("Renders heading and illustration", async () => {
    await expect(canvas.getByRole("heading", { name: "Zarządzaj swoim warsztatem" })).toBeVisible();
    await expect(canvas.getByText("Illustration placeholder")).toBeVisible();
  });

  await step("Does not render optional elements when props are omitted", async () => {
    await expect(canvas.queryByRole("list", { name: "Szczegóły funkcji" })).toBeNull();
    await expect(canvas.queryByRole("link")).toBeNull();
  });
});

export const FullFeature = meta.story({
  args: {
    heading: "Portal dla Twoich klientów",
    description: "Daj klientom wgląd w postępy projektu w czasie rzeczywistym.",
    badge: { label: "Nowość", icon: Users, variant: "primary" },
    featurePoints: [
      { icon: Users, title: "Zarządzanie klientami", description: "Pełna baza klientów" },
      { icon: Shield, title: "Bezpieczeństwo danych", description: "Szyfrowanie end-to-end" }
    ],
    stats: [
      { value: "500+", label: "Aktywnych warsztatów" },
      { value: "98%", label: "Zadowolonych klientów" }
    ],
    ctaLabel: "Rozpocznij teraz",
    ctaHref: "/sign-up",
    ctaIcon: <ArrowRight className="size-4" />,
    illustration: <div>Full illustration</div>,
    layout: "reversed"
  }
});

FullFeature.test("Renders all expected content and CTA link", async ({ canvas, step }) => {
  await step("Renders heading, description, badge, features, and stats", async () => {
    await expect(canvas.getByRole("heading", { name: "Portal dla Twoich klientów" })).toBeVisible();
    await expect(canvas.getByText("Daj klientom wgląd w postępy projektu w czasie rzeczywistym.")).toBeVisible();
    await expect(canvas.getByText("Nowość")).toBeVisible();
    await expect(canvas.getByText("Zarządzanie klientami")).toBeVisible();
    await expect(canvas.getByText("Bezpieczeństwo danych")).toBeVisible();
    await expect(canvas.getByText("500+")).toBeVisible();
    await expect(canvas.getByText("Aktywnych warsztatów")).toBeVisible();
    await expect(canvas.getByText("98%")).toBeVisible();
    await expect(canvas.getByText("Zadowolonych klientów")).toBeVisible();
  });

  await step("Renders CTA button with correct href", async () => {
    const ctaLink = canvas.getByRole("link", { name: "Rozpocznij teraz" });
    await expect(ctaLink).toBeVisible();
    await expect(ctaLink).toHaveAttribute("href", "/sign-up");
  });
});
