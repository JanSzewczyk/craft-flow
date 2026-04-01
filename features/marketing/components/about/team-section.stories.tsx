import { expect } from "storybook/test";

import preview from "~/.storybook/preview";

import { TeamSection } from "./team-section";

const meta = preview.meta({
  title: "Marketing/About/Team Section",
  component: TeamSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
});

export const TeamSectionStory = meta.story({ name: "Team Section" });

TeamSectionStory.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Renders section heading and all team members", async () => {
    await expect(canvas.getByRole("heading", { name: /poznaj nasz zespół/i })).toBeVisible();

    await expect(canvas.getByRole("heading", { name: "Marek Kowalski" })).toBeVisible();
    await expect(canvas.getByText("CEO & Założyciel")).toBeVisible();

    await expect(canvas.getByRole("heading", { name: "Anna Nowak" })).toBeVisible();
    await expect(canvas.getByText("CTO")).toBeVisible();

    await expect(canvas.getByRole("heading", { name: "Tomasz Wiśniewski" })).toBeVisible();
    await expect(canvas.getByText("Lead Designer")).toBeVisible();

    await expect(canvas.getByRole("heading", { name: "Julia Lis" })).toBeVisible();
    await expect(canvas.getByText("Customer Success")).toBeVisible();
  });

  await step("Renders social links with correct aria-labels for all team members", async () => {
    const members = ["Marek Kowalski", "Anna Nowak", "Tomasz Wiśniewski", "Julia Lis"];

    for (const member of members) {
      await expect(canvas.getByRole("link", { name: `${member} na LinkedIn` })).toBeVisible();
      await expect(canvas.getByRole("link", { name: `${member} na Twitter` })).toBeVisible();
    }
  });
});
