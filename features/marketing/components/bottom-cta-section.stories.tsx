import { expect } from "storybook/test";

import { BottomCtaSection } from "./bottom-cta-section";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Marketing/Bottom CTA Section",
  component: BottomCtaSection,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Bottom call-to-action section with primary/secondary buttons, social proof, urgency message, and optional note."
      }
    }
  },
  tags: ["autodocs"],
  args: {
    heading: "Gotowy, by usprawnić swój workflow?",
    ctaLabel: "Rozpocznij za darmo",
    ctaHref: "/sign-up"
  }
});

/**
 * Minimal variant with only required props: heading and primary CTA.
 */
export const MinimalCta = meta.story({});

MinimalCta.test("Renders heading, primary CTA, and no optional elements", async ({ canvas, step }) => {
  await step("Renders heading and primary CTA link with correct href", async () => {
    await expect(canvas.getByRole("heading", { name: /gotowy, by usprawnić swój workflow/i })).toBeVisible();
    const ctaLink = canvas.getByRole("button", { name: "Rozpocznij za darmo" });
    await expect(ctaLink).toBeVisible();
    await expect(ctaLink).toHaveAttribute("href", "/sign-up");
  });

  await step("Does not render optional elements when props are omitted", async () => {
    const links = canvas.getAllByRole("button");
    await expect(links).toHaveLength(1);
    await expect(canvas.queryByText(/dołącz/i)).toBeNull();
    await expect(canvas.queryByText(/korzysta/i)).toBeNull();
    await expect(canvas.queryByText(/oferta/i)).toBeNull();
    await expect(canvas.queryByText(/kredytowej/i)).toBeNull();
  });
});

/**
 * Full variant with all optional props: subheading, secondary CTA,
 * social proof, urgency message, and note.
 */
export const FullCta = meta.story({
  args: {
    subheading: "Dołącz do tysięcy firm, które już korzystają z CraftFlow.",
    secondaryCtaLabel: "Zobacz demo",
    secondaryCtaHref: "/demo",
    note: "Nie wymagamy karty kredytowej",
    urgencyMessage: "Oferta kończy się za 48h!",
    socialProofCount: "2 500+",
    socialProofLabel: "Firm już korzysta:"
  }
});

FullCta.test("Renders all expected content and CTA links", async ({ canvas, step }) => {
  await step("Renders all content sections", async () => {
    await expect(canvas.getByRole("heading", { name: /gotowy, by usprawnić swój workflow/i })).toBeVisible();
    await expect(canvas.getByText(/dołącz do tysięcy firm/i)).toBeVisible();
    await expect(canvas.getByText("Firm już korzysta:")).toBeVisible();
    await expect(canvas.getByText("2 500+")).toBeVisible();
    await expect(canvas.getByText("Oferta kończy się za 48h!")).toBeVisible();
    await expect(canvas.getByText("Nie wymagamy karty kredytowej")).toBeVisible();
  });

  await step("Renders primary and secondary CTA links with correct hrefs", async () => {
    const primaryLink = canvas.getByRole("button", { name: "Rozpocznij za darmo" });
    await expect(primaryLink).toHaveAttribute("href", "/sign-up");

    const secondaryLink = canvas.getByRole("button", { name: "Zobacz demo" });
    await expect(secondaryLink).toBeVisible();
    await expect(secondaryLink).toHaveAttribute("href", "/demo");
  });
});
