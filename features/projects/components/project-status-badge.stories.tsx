import { expect } from "storybook/test";
import { ProjectStatus } from "~/features/projects/types/project";

import { ProjectStatusBadge } from "./project-status-badge";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Projects/Project Status Badge",
  component: ProjectStatusBadge,
  parameters: { layout: "centered" }
});

export const Draft = meta.story({
  args: { status: ProjectStatus.DRAFT }
});

Draft.test("Renders draft label", async ({ canvas }) => {
  await expect(canvas.getByText("Szkic")).toBeVisible();
});

export const Active = meta.story({
  args: { status: ProjectStatus.ACTIVE }
});

Active.test("Renders active label", async ({ canvas }) => {
  await expect(canvas.getByText("Aktywny")).toBeVisible();
});

export const Completed = meta.story({
  args: { status: ProjectStatus.COMPLETED }
});

Completed.test("Renders completed label", async ({ canvas }) => {
  await expect(canvas.getByText("Zakończony")).toBeVisible();
});

export const Archived = meta.story({
  args: { status: ProjectStatus.ARCHIVED }
});

Archived.test("Renders archived label", async ({ canvas }) => {
  await expect(canvas.getByText("Zarchiwizowany")).toBeVisible();
});

export const UnknownStatus = meta.story({
  args: { status: "UNKNOWN_XYZ" }
});

UnknownStatus.test("Renders raw status string for unknown status", async ({ canvas }) => {
  await expect(canvas.getByText("UNKNOWN_XYZ")).toBeVisible();
});
