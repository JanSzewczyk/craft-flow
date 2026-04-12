import { expect } from "storybook/test";

import { WhyCraftFlowSection } from "./why-craft-flow-section";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Marketing/Home/Why CraftFlow Section",
  component: WhyCraftFlowSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
});

export const WhyCraftFlowSectionStory = meta.story({ name: "Why CraftFlow Section" });

WhyCraftFlowSectionStory.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Renders section heading and subtitle", async () => {
    await expect(canvas.getByRole("heading", { name: /Dlaczego CraftFlow\?/i })).toBeVisible();
    await expect(canvas.getByText(/Stworzyliśmy system, który oszczędza Twój czas i buduje zaufanie/i)).toBeVisible();
  });

  await step("Renders all three feature card titles", async () => {
    await expect(canvas.getByText("Mniej telefonów")).toBeVisible();
    await expect(canvas.getByText("Profesjonalny wizerunek")).toBeVisible();
    await expect(canvas.getByText("Porządek w plikach")).toBeVisible();
  });

  await step("Renders feature card descriptions", async () => {
    await expect(canvas.getByText(/Klienci sami sprawdzają status zlecenia online/i)).toBeVisible();
    await expect(canvas.getByText(/Buduj zaufanie dzięki nowoczesnemu systemowi/i)).toBeVisible();
    await expect(canvas.getByText(/Wszystkie zdjęcia z naprawy, kosztorysy/i)).toBeVisible();
  });
});
