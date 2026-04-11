import { expect } from "storybook/test";

import preview from "~/.storybook/preview";

import { ProjectProgressBar } from "./project-progress-bar";

const meta = preview.meta({
  title: "Features/Projects/Project Progress Bar",
  component: ProjectProgressBar,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    )
  ]
});

export const NoSteps = meta.story({
  args: { totalSteps: 0, completedSteps: 0 }
});

NoSteps.test("Shows Brak kroków text when no steps", async ({ canvas }) => {
  await expect(canvas.getByText("Brak kroków")).toBeVisible();
});

export const InProgress = meta.story({
  args: { totalSteps: 10, completedSteps: 3 }
});

InProgress.test("Shows step count text", async ({ canvas }) => {
  await expect(canvas.getByText("3/10")).toBeVisible();
});

export const HalfDone = meta.story({
  args: { totalSteps: 10, completedSteps: 5 }
});

HalfDone.test("Shows half-done step count text", async ({ canvas }) => {
  await expect(canvas.getByText("5/10")).toBeVisible();
});

export const Complete = meta.story({
  args: { totalSteps: 10, completedSteps: 10 }
});

Complete.test("Shows completed step count text", async ({ canvas }) => {
  await expect(canvas.getByText("10/10")).toBeVisible();
});
