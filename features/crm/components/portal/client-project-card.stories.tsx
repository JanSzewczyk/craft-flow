import { expect } from "storybook/test";
import { clientProjectListItemBuilder } from "~/features/projects/test/builders";
import { type ClientProjectListItem } from "~/features/projects/types/project";

import { ClientProjectCard } from "./client-project-card";

import preview from "~/.storybook/preview";

const draftProject: ClientProjectListItem = clientProjectListItemBuilder.one();
const activeProject: ClientProjectListItem = clientProjectListItemBuilder.one({ traits: "active" });
const completedProject: ClientProjectListItem = clientProjectListItemBuilder.one({ traits: "completed" });
const archivedProject: ClientProjectListItem = clientProjectListItemBuilder.one({ traits: "archived" });

const meta = preview.meta({
  title: "Features/CRM/Portal/Client Project Card",
  component: ClientProjectCard,
  parameters: {
    layout: "padded"
  },
  args: {
    project: draftProject
  }
});

export const DraftProject = meta.story({});

DraftProject.test("Renders all expected content", async ({ canvas, step, args }) => {
  await step("Project name is visible", async () => {
    await expect(canvas.getByText(args.project.name)).toBeVisible();
  });

  await step("Contractor company name is visible", async () => {
    await expect(canvas.getByText(args.project.contractorCompanyName)).toBeVisible();
  });

  await step("Details link is visible", async () => {
    await expect(canvas.getByRole("link", { name: /szczegóły/i })).toBeVisible();
  });
});

DraftProject.test("Does not show date info when no dates are set", async ({ canvas }) => {
  await expect(canvas.queryByText(/zakończono/i)).toBeNull();
  await expect(canvas.queryByText(/rozpoczęto/i)).toBeNull();
});

export const ActiveProject = meta.story({
  args: { project: activeProject }
});

ActiveProject.test("Renders active project content", async ({ canvas, step, args }) => {
  await step("Project name is visible", async () => {
    await expect(canvas.getByText(args.project.name)).toBeVisible();
  });

  await step("Contractor company name is visible", async () => {
    await expect(canvas.getByText(args.project.contractorCompanyName)).toBeVisible();
  });

  await step("Shows started date info", async () => {
    await expect(canvas.getByText(/rozpoczęto/i)).toBeVisible();
  });
});

export const CompletedProject = meta.story({
  args: { project: completedProject }
});

CompletedProject.test("Renders completed project content", async ({ canvas, step, args }) => {
  await step("Project name is visible", async () => {
    await expect(canvas.getByText(args.project.name)).toBeVisible();
  });

  await step("Shows completed date info", async () => {
    await expect(canvas.getByText(/zakończono/i)).toBeVisible();
  });
});

export const ArchivedProject = meta.story({
  args: { project: archivedProject }
});

ArchivedProject.test("Renders archived project content", async ({ canvas, step, args }) => {
  await step("Project name is visible", async () => {
    await expect(canvas.getByText(args.project.name)).toBeVisible();
  });

  await step("Contractor company name is visible", async () => {
    await expect(canvas.getByText(args.project.contractorCompanyName)).toBeVisible();
  });

  await step("Details link is visible", async () => {
    await expect(canvas.getByRole("link", { name: /szczegóły/i })).toBeVisible();
  });
});
