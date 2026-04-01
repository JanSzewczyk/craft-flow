import { expect } from "storybook/test";

import preview from "~/.storybook/preview";

import { HeroSection } from "./hero-section";

const meta = preview.meta({
  title: "Marketing/Home/Hero Section",
  component: HeroSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
});

export const HeroSectionStory = meta.story({ name: "Hero Section" });

HeroSectionStory.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Renders heading and description", async () => {
    await expect(
      canvas.getByRole("heading", {
        name: /Zakończ erę ciągłych telefonów od klientów\./i
      })
    ).toBeVisible();
    await expect(canvas.getByText(/CraftFlow to Twój cyfrowy asystent/i)).toBeVisible();
  });

  await step("Renders CTA links with correct hrefs", async () => {
    const trialLink = canvas.getByRole("link", {
      name: /Rozpocznij 14-dniowy okres próbny/i
    });
    await expect(trialLink).toBeVisible();
    await expect(trialLink).toHaveAttribute("href", "/pricing");

    const featuresLink = canvas.getByRole("link", {
      name: /Zobacz jak to działa/i
    });
    await expect(featuresLink).toBeVisible();
    await expect(featuresLink).toHaveAttribute("href", "/features");
  });

  await step("Renders social proof and smartphone mockup", async () => {
    await expect(canvas.getByText("+500 warsztatów")).toBeVisible();
    await expect(canvas.getByText("Status Zlecenia")).toBeVisible();
    await expect(canvas.getByText("Naprawa układu hamulcowego")).toBeVisible();
  });
});
