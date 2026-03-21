import { expect, screen, waitFor } from "storybook/test";

import { CookieBanner } from "./cookie-banner";

import preview from "~/.storybook/preview";

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

const meta = preview.meta({
  title: "Components/Cookie Banner",
  component: CookieBanner,
  parameters: {
    layout: "fullscreen"
  },
  beforeEach: () => {
    deleteCookie("cookieConsent");
    deleteCookie("cookiePreferences");
  }
});

export const CookieBannerStory = meta.story({ name: "Cookie Banner" });

// Content
CookieBannerStory.test("Renders all expected content", async ({ canvas }) => {
  await waitFor(async () => {
    await expect(canvas.getByText("Cenimy Twoją prywatność")).toBeVisible();
    await expect(canvas.getByText(/Używamy plików cookie/i)).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Akceptuję wszystkie" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Ustawienia" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Zamknij" })).toBeVisible();
  });
});

// Interaction: Accept all
CookieBannerStory.test(
  "Clicking accept all hides the banner and sets cookie consent to true",
  async ({ canvas, step, userEvent }) => {
    await step("Click the accept all button", async () => {
      const acceptButton = canvas.getByRole("button", { name: "Akceptuję wszystkie" });
      await userEvent.click(acceptButton);
    });

    await step("Banner is no longer visible", async () => {
      await waitFor(async () => {
        await expect(canvas.queryByText("Cenimy Twoją prywatność")).not.toBeInTheDocument();
      });
    });

    await step("Cookie consent is set to true", async () => {
      await expect(document.cookie).toContain("cookieConsent=true");
    });
  }
);

// Interaction: Close button (X)
CookieBannerStory.test(
  "Clicking close button hides the banner and sets cookie consent to false",
  async ({ canvas, step, userEvent }) => {
    await step("Click the close button", async () => {
      const closeButton = canvas.getByRole("button", { name: "Zamknij" });
      await userEvent.click(closeButton);
    });

    await step("Banner is no longer visible", async () => {
      await waitFor(async () => {
        await expect(canvas.queryByText("Cenimy Twoją prywatność")).not.toBeInTheDocument();
      });
    });

    await step("Cookie consent is set to false", async () => {
      await expect(document.cookie).toContain("cookieConsent=false");
    });
  }
);

// Interaction: Settings opens modal
CookieBannerStory.test("Clicking settings button opens the cookie settings modal", async ({ canvas, userEvent }) => {
  const settingsButton = canvas.getByRole("button", { name: "Ustawienia" });
  await userEvent.click(settingsButton);

  await waitFor(async () => {
    const dialog = screen.getByRole("dialog");
    await expect(dialog).toBeVisible();
  });
});

// Accessibility
CookieBannerStory.test("Close button has an accessible label", async ({ canvas }) => {
  const closeButton = canvas.getByRole("button", { name: "Zamknij" });
  await expect(closeButton).toHaveAccessibleName();
});
