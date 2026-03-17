import { expect } from "storybook/test";

import { LegalPageHeader } from "./legal-page-header";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Marketing/Legal/Legal Page Header",
  component: LegalPageHeader,
  args: {
    title: "Regulamin usługi CraftFlow",
    lastUpdated: "Ostatnia aktualizacja: marzec 2026"
  },
  parameters: {
    layout: "padded"
  }
});

export const Default = meta.story({ name: "Default" });
Default.test("renders h1 and date badge without download button", async ({ canvas, step }) => {
  await step("Verify h1 renders with title", async () => {
    const heading = canvas.getByRole("heading", { level: 1 });
    await expect(heading).toBeInTheDocument();
    await expect(heading).toHaveTextContent("Regulamin usługi CraftFlow");
  });

  await step("Verify date badge is visible", async () => {
    const badge = canvas.getByText(/marzec 2026/i);
    await expect(badge).toBeVisible();
  });

  await step("Verify download button is absent when downloadHref not provided", async () => {
    const downloadLink = canvas.queryByRole("link", { name: /PDF/i });
    await expect(downloadLink).not.toBeInTheDocument();
  });
});

export const WithDownload = meta.story({
  name: "With Download",
  args: {
    downloadHref: "/regulamin.pdf"
  }
});
WithDownload.test("renders download button when downloadHref is provided", async ({ canvas, step }) => {
  await step("Verify download link is present", async () => {
    const downloadLink = canvas.getByRole("link", { name: /PDF/i });
    await expect(downloadLink).toBeInTheDocument();
    await expect(downloadLink).toHaveAttribute("href", "/regulamin.pdf");
  });
});
