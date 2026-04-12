import { expect, screen, waitFor, within } from "storybook/test";

import { MarketingHeader } from "./header";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Marketing/Header",
  component: MarketingHeader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Main navigation header for the marketing site. Features responsive design, theme toggle, and auth state detection."
      }
    }
  },
  tags: ["autodocs"]
});

/**
 * Desktop navigation state showing the full header with logo, nav links,
 * theme toggle, and action buttons.
 */
export const DesktopNav = meta.story({});

DesktopNav.test("Renders all expected navigation content", async ({ canvas, step }) => {
  await step("Renders BrandLogo link to homepage", async () => {
    const brandLink = canvas.getByRole("link", { name: /craftflow/i });
    await expect(brandLink).toBeVisible();
    await expect(brandLink).toHaveAttribute("href", "/");
  });

  await step("Renders all navigation links with correct hrefs", async () => {
    const navLinks = [
      { name: "Funkcje", href: "/features" },
      { name: "Cennik", href: "/pricing" },
      { name: "O nas", href: "/about-us" },
      { name: "Kontakt", href: "/contact" }
    ];

    for (const { name, href } of navLinks) {
      const link = canvas.getByRole("link", { name });
      await expect(link).toHaveAttribute("href", href);
    }
  });

  await step("Renders theme toggle and no active link on homepage", async () => {
    await expect(canvas.getByRole("button", { name: /current:/i })).toBeVisible();

    for (const name of ["Funkcje", "Cennik", "O nas", "Kontakt"]) {
      const link = canvas.getByRole("link", { name });
      await expect(link).not.toHaveAttribute("aria-current", "page");
    }
  });
});

/**
 * Story showing the header with an active navigation link (Cennik/Pricing page).
 */
export const ActiveLink = meta.story({
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/pricing"
      }
    }
  }
});

ActiveLink.test("Cennik link is active, other nav links are not", async ({ canvas }) => {
  const cennikLink = canvas.getByRole("link", { name: "Cennik" });
  await expect(cennikLink).toHaveAttribute("aria-current", "page");

  for (const name of ["Funkcje", "O nas", "Kontakt"]) {
    const link = canvas.getByRole("link", { name });
    await expect(link).not.toHaveAttribute("aria-current", "page");
  }
});

/**
 * Story showing the header on mobile viewport.
 * Hides desktop navigation and shows mobile menu button.
 */
export const Mobile = meta.story({
  globals: {
    viewport: { value: "mobile2", isRotated: false }
  }
});

Mobile.test("Mobile menu opens with all links and closes on Escape", async ({ canvas, userEvent }) => {
  const menuButton = canvas.getByRole("button", { name: "Open menu" });
  await expect(menuButton).toBeVisible();

  await userEvent.click(menuButton);

  const dialog = await screen.findByRole("dialog");
  const dialogScope = within(dialog);

  await waitFor(async () => {
    for (const name of ["Funkcje", "Cennik", "O nas", "Kontakt"]) {
      await expect(dialogScope.getByRole("link", { name })).toBeVisible();
    }
  });

  await expect(dialogScope.getByRole("link", { name: "Rozpocznij okres próbny" })).toBeVisible();
  await expect(dialogScope.getByRole("link", { name: "Zaloguj się" })).toBeVisible();

  // Use Escape to close — clicking a nav link causes real browser navigation
  // which disconnects Vitest's WebSocket connection in headless Chromium
  await userEvent.keyboard("{Escape}");
  await waitFor(async () => {
    await expect(screen.queryByRole("dialog")).toBeNull();
  });
});
