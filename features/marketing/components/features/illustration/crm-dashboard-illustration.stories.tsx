import { expect } from "storybook/test";

import preview from "~/.storybook/preview";

import { CrmDashboardIllustration } from "./crm-dashboard-illustration";

const meta = preview.meta({
  title: "Marketing/Features/CRM Dashboard Illustration",
  component: CrmDashboardIllustration,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  }
});

export const CrmDashboardIllustrationStory = meta.story({ name: "CRM Dashboard" });

CrmDashboardIllustrationStory.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Renders table header", async () => {
    await expect(canvas.getByText("Baza Klientów")).toBeVisible();
  });

  await step("Renders table column headers", async () => {
    await expect(canvas.getByText("Klient")).toBeVisible();
    await expect(canvas.getByText("Status")).toBeVisible();
    await expect(canvas.getByText("Ostatnia realizacja")).toBeVisible();
    await expect(canvas.getByText("Wartość")).toBeVisible();
  });

  await step("Renders all customer names", async () => {
    await expect(canvas.getByText("Anna Kowalska")).toBeVisible();
    await expect(canvas.getByText("Jan Nowak")).toBeVisible();
    await expect(canvas.getByText("Katarzyna Zielona")).toBeVisible();
    await expect(canvas.getByText("Marek Wiśniewski")).toBeVisible();
  });

  await step("Renders customer statuses", async () => {
    const staleKlientElements = canvas.getAllByText("Stały Klient");
    await expect(staleKlientElements).toHaveLength(2);
    await expect(canvas.getByText("W trakcie")).toBeVisible();
    await expect(canvas.getByText("Nowy")).toBeVisible();
  });

  await step("Renders project names and values", async () => {
    await expect(canvas.getByText("Renowacja szafy")).toBeVisible();
    await expect(canvas.getByText("Stół dębowy Loft")).toBeVisible();
    await expect(canvas.getByText("4 200 PLN")).toBeVisible();
    await expect(canvas.getByText("7 800 PLN")).toBeVisible();
    await expect(canvas.getByText("28 500 PLN")).toBeVisible();
  });
});
