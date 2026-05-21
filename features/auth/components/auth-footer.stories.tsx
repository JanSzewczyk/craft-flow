import { expect } from "storybook/test";

import { AuthFooter } from "./auth-footer";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Auth/Auth Footer",
  component: AuthFooter,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/"
      }
    }
  }
});

export const AuthFooterStory = meta.story({ name: "Auth Footer" });

AuthFooterStory.test("Renders all footer links", async ({ canvas, step }) => {
  await step("Renders Regulamin link", async () => {
    const link = canvas.getByRole("link", { name: "Regulamin" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/terms");
  });

  await step("Renders Prywatnosc link", async () => {
    const link = canvas.getByRole("link", { name: "Prywatność" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/privacy");
  });

  await step("Renders Kontakt link", async () => {
    const link = canvas.getByRole("link", { name: "Kontakt" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/contact");
  });

  await step("Renders exactly three links", async () => {
    const links = canvas.getAllByRole("link");
    await expect(links).toHaveLength(3);
  });
});
