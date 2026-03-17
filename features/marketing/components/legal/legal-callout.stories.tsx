import { expect } from "storybook/test";

import { LegalCallout } from "./legal-callout";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Marketing/Legal/Legal Callout",
  component: LegalCallout,
  args: {
    children: (
      <p>
        Nowi Użytkownicy mogą skorzystać z <strong>14-dniowego okresu próbnego</strong> Planu Premium bez podawania
        danych karty płatniczej.
      </p>
    )
  },
  parameters: {
    layout: "padded"
  }
});

export const Default = meta.story({ name: "Default" });
Default.test("renders children and callout container", async ({ canvas, step }) => {
  await step("Verify callout container is visible", async () => {
    const callout = canvas.getByText(/14-dniowego okresu próbnego/i).closest("div");
    await expect(callout).toBeInTheDocument();
  });

  await step("Verify children render inside callout", async () => {
    const strong = canvas.getByText(/14-dniowego okresu próbnego/i);
    await expect(strong).toBeVisible();
  });
});
