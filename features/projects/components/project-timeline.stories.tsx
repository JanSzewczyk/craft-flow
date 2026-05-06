import { expect, fn } from "storybook/test";
import { type Project, ProjectStatus } from "~/features/projects/server/db/schema";
import { clientBuilder, projectBuilder, projectStepBuilder } from "~/features/projects/test/builders";

import { ProjectTimeline } from "./project-timeline";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Projects/Project Timeline",
  component: ProjectTimeline,
  args: {
    onUpdateStepAction: fn().mockResolvedValue({ success: true, data: undefined })
  },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    )
  ]
});

const emptyProject = projectBuilder.one({
  overrides: { status: ProjectStatus.ACTIVE, steps: [], client: clientBuilder.one() }
}) as Project;

const incompleteSteps = projectStepBuilder.many(3);
const activeProject = projectBuilder.one({
  overrides: { status: ProjectStatus.ACTIVE, steps: incompleteSteps, client: clientBuilder.one() }
}) as Project;

const mixedSteps = [
  ...projectStepBuilder.many(2, { overrides: { isCompleted: true, completedAt: new Date("2024-01-10") } }),
  ...projectStepBuilder.many(2)
];
const mixedProject = projectBuilder.one({
  overrides: { status: ProjectStatus.ACTIVE, steps: mixedSteps, client: clientBuilder.one() }
}) as Project;

const completedProject = projectBuilder.one({
  overrides: {
    status: ProjectStatus.COMPLETED,
    steps: projectStepBuilder.many(3, { overrides: { isCompleted: true, completedAt: new Date("2024-01-10") } }),
    client: clientBuilder.one()
  }
}) as Project;

export const EmptyTimeline = meta.story({
  args: { project: emptyProject }
});

EmptyTimeline.test("Shows empty state message when no steps", async ({ canvas }) => {
  await expect(canvas.getByText("Brak etapów w tym projekcie")).toBeVisible();
});

export const ActiveTimeline = meta.story({
  args: { project: activeProject }
});

ActiveTimeline.test("Renders all steps in the timeline", async ({ canvas, args }) => {
  const items = canvas.getAllByRole("listitem");
  await expect(items).toHaveLength(args.project.steps.length);
});

ActiveTimeline.test("First step is active and shows complete button", async ({ canvas }) => {
  await expect(canvas.getByText("W trakcie")).toBeVisible();
  await expect(canvas.getByRole("button", { name: "Oznacz jako ukończone" })).toBeVisible();
});

export const MixedTimeline = meta.story({
  args: { project: mixedProject }
});

MixedTimeline.test("Completed steps show success badge", async ({ canvas }) => {
  const successBadges = canvas.getAllByText("Ukończono");
  await expect(successBadges).toHaveLength(2);
});

MixedTimeline.test("Active step shows primary badge", async ({ canvas }) => {
  await expect(canvas.getByText("W trakcie")).toBeVisible();
});

MixedTimeline.test("Active step shows complete button", async ({ canvas }) => {
  await expect(canvas.getByRole("button", { name: "Oznacz jako ukończone" })).toBeVisible();
});

export const LockedTimeline = meta.story({
  args: { project: completedProject }
});

LockedTimeline.test("Complete button is not shown when project is completed", async ({ canvas }) => {
  const completeButton = canvas.queryByRole("button", { name: "Oznacz jako ukończone" });
  await expect(completeButton).not.toBeInTheDocument();
});
