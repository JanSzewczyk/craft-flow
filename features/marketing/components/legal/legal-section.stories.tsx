import { expect } from "storybook/test";

import { LegalSection } from "./legal-section";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Marketing/Legal/LegalSection",
  component: LegalSection,
  args: {
    id: "postanowienia-ogolne",
    number: 1,
    title: "Postanowienia ogólne",
    children: (
      <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
        Niniejszy Regulamin określa zasady korzystania z usługi CraftFlow.
      </p>
    )
  },
  parameters: {
    layout: "padded"
  }
});

export const Default = meta.story({ name: "Default" });
Default.test("renders section heading with §N prefix and children", async ({ canvas, step }) => {
  await step("Verify h2 with §1. prefix renders", async () => {
    const heading = canvas.getByRole("heading", { level: 2 });
    await expect(heading).toBeInTheDocument();
    await expect(heading).toHaveTextContent("§1.");
    await expect(heading).toHaveTextContent("Postanowienia ogólne");
  });

  await step("Verify children are visible", async () => {
    const content = canvas.getByText(/Niniejszy Regulamin/i);
    await expect(content).toBeVisible();
  });

  await step("Verify section has correct id attribute", async () => {
    const sectionEl = document.getElementById("postanowienia-ogolne");
    await expect(sectionEl).toBeInTheDocument();
  });
});
