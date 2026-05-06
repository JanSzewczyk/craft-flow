import { expect } from "storybook/test";
import { ProjectStatus } from "~/features/projects/server/db/schema";
import { projectStepBuilder } from "~/features/projects/test/builders";

import { ProjectTimeline } from "./project-timeline";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Projects/Project Timeline",
  component: ProjectTimeline,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    )
  ]
});

export const EmptyTimeline = meta.story({
  args: {
    steps: [],
    projectId: "proj-123",
    projectStatus: ProjectStatus.ACTIVE
  }
});

EmptyTimeline.test("Shows empty state message when no steps", async ({ canvas }) => {
  await expect(canvas.getByText("Brak etapów w tym projekcie")).toBeVisible();
});

const incompleteSteps = projectStepBuilder.many(3);
const mixedSteps = [
  ...projectStepBuilder.many(2, { overrides: { isCompleted: true, completedAt: new Date("2024-01-10") } }),
  ...projectStepBuilder.many(2)
];

export const ActiveTimeline = meta.story({
  args: {
    steps: incompleteSteps,
    projectId: "proj-123",
    projectStatus: ProjectStatus.ACTIVE
  }
});

ActiveTimeline.test("Renders all steps in the timeline", async ({ canvas, args }) => {
  const buttons = canvas.getAllByRole("button");
  await expect(buttons).toHaveLength(args.steps.length);
});

ActiveTimeline.test("Incomplete steps show their order number", async ({ canvas }) => {
  await expect(canvas.getByText("1")).toBeVisible();
  await expect(canvas.getByText("2")).toBeVisible();
  await expect(canvas.getByText("3")).toBeVisible();
});

ActiveTimeline.test("Incomplete step buttons are not disabled for active project", async ({ canvas }) => {
  const buttons = canvas.getAllByRole("button");
  for (const button of buttons) {
    await expect(button).not.toBeDisabled();
  }
});

export const MixedTimeline = meta.story({
  args: {
    steps: mixedSteps,
    projectId: "proj-123",
    projectStatus: ProjectStatus.ACTIVE
  }
});

MixedTimeline.test("Completed steps show check icon button label", async ({ canvas }) => {
  const completedButtons = canvas.getAllByRole("button", { name: "Oznacz jako nieukończone" });
  await expect(completedButtons).toHaveLength(2);
});

MixedTimeline.test("Incomplete steps show toggle button label", async ({ canvas }) => {
  const incompleteButtons = canvas.getAllByRole("button", { name: "Oznacz jako ukończone" });
  await expect(incompleteButtons).toHaveLength(2);
});

export const LockedTimeline = meta.story({
  args: {
    steps: mixedSteps,
    projectId: "proj-123",
    projectStatus: ProjectStatus.COMPLETED
  }
});

LockedTimeline.test("All step buttons are disabled when project is completed", async ({ canvas }) => {
  const buttons = canvas.getAllByRole("button");
  for (const button of buttons) {
    await expect(button).toBeDisabled();
  }
});
