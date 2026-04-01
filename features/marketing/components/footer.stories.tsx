import { expect } from "storybook/test";

import preview from "~/.storybook/preview";

import { MarketingFooter } from "./footer";

const meta = preview.meta({
  title: "Marketing/Footer",
  component: MarketingFooter,
  parameters: {
    layout: "fullscreen"
  }
});

export const MarketingFooterStory = meta.story({ name: "Footer" });

MarketingFooterStory.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Renders BrandLogo link to / with CraftFlow text", async () => {
    const brandLink = canvas.getByRole("link", { name: /craftflow/i });
    await expect(brandLink).toBeVisible();
    await expect(brandLink).toHaveAttribute("href", "/");
  });

  await step("Renders PRODUKT column with correct links", async () => {
    const produktLinks = [
      { name: "Funkcje", href: "/features" },
      { name: "Cennik", href: "/pricing" },
      { name: "Logowanie", href: "/login" }
    ];

    for (const { name, href } of produktLinks) {
      const link = canvas.getByRole("link", { name });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", href);
    }
  });

  await step("Renders FIRMA column with correct links", async () => {
    const firmaLinks = [
      { name: "O nas", href: "/about-us" },
      { name: "Kontakt", href: "/contact" }
    ];

    for (const { name, href } of firmaLinks) {
      const link = canvas.getByRole("link", { name });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", href);
    }
  });

  await step("Renders social media links with correct aria-labels and target _blank", async () => {
    const socialLinks = [
      { label: "Facebook", href: "https://facebook.com/craftflow" },
      { label: "Twitter", href: "https://twitter.com/craftflow" },
      { label: "LinkedIn", href: "https://linkedin.com/company/craftflow" }
    ];

    for (const { label, href } of socialLinks) {
      const link = canvas.getByRole("link", { name: label });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", href);
      await expect(link).toHaveAttribute("target", "_blank");
    }
  });

  await step('Renders "Zacznij już teraz" section with signup link', async () => {
    const signupLink = canvas.getByRole("button", { name: "Wypróbuj bez opłat" });
    await expect(signupLink).toBeVisible();
    await expect(signupLink).toHaveAttribute("href", "/signup");
  });

  await step("Renders copyright text with current year", async () => {
    const year = new Date().getFullYear();
    const copyright = canvas.getByText(new RegExp(`Copyright © ${year} CraftFlow`));
    await expect(copyright).toBeVisible();
  });

  await step("Renders legal links with target _blank", async () => {
    const legalLinks = [
      { name: "Regulamin", href: "/terms" },
      { name: "Polityka prywatności", href: "/privacy" }
    ];

    for (const { name, href } of legalLinks) {
      const link = canvas.getByRole("link", { name });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", href);
      await expect(link).toHaveAttribute("target", "_blank");
    }
  });
});
