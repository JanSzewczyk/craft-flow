import { expect } from "storybook/test";

import { LegalBreadcrumbs } from "./legal-breadcrumbs";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Marketing/Legal/LegalBreadcrumbs",
  component: LegalBreadcrumbs,
  args: {
    label: "Regulamin"
  },
  parameters: {
    layout: "padded",
    nextjs: {
      appDirectory: true
    }
  }
});

export const Default = meta.story({ name: "Default" });
Default.test("renders breadcrumb nav with home link and current page", async ({ canvas, step }) => {
  await step("Verify nav with aria-label=breadcrumb is present", async () => {
    const nav = canvas.getByRole("navigation", { name: /breadcrumb/i });
    await expect(nav).toBeInTheDocument();
  });

  await step("Verify home link exists", async () => {
    const homeLink = canvas.getByRole("link");
    await expect(homeLink).toBeInTheDocument();
    await expect(homeLink).toHaveAttribute("href", "/");
  });

  await step("Verify current item has aria-current=page", async () => {
    const current = canvas.getByText("Regulamin");
    await expect(current).toHaveAttribute("aria-current", "page");
  });
});
