import { expect, fn } from "storybook/test";
import { type Project } from "~/features/projects/server/db/schema";
import { projectBuilder } from "~/features/projects/test/builders";

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

export const EmptyTimeline = meta.story({
  args: { project: projectBuilder.one({ traits: "active" }) as Project }
});

EmptyTimeline.test("Shows empty state message when no steps", async ({ canvas }) => {
  await expect(canvas.getByText("Brak etapów")).toBeVisible();
});

export const DraftTimeline = meta.story({
  args: { project: projectBuilder.one({ traits: "draftWithSteps" }) as Project }
});

DraftTimeline.test("Renders all steps for draft project", async ({ canvas, args }) => {
  const items = canvas.getAllByRole("listitem");
  await expect(items).toHaveLength(args.project.steps.length);
});

DraftTimeline.test("No status badges shown for draft project", async ({ canvas }) => {
  await expect(canvas.queryByText("W trakcie")).not.toBeInTheDocument();
  await expect(canvas.queryByText("Ukończono")).not.toBeInTheDocument();
});

export const ActiveTimeline = meta.story({
  args: { project: projectBuilder.one({ traits: "activeWithSteps" }) as Project }
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
  args: { project: projectBuilder.one({ traits: "activeWithMixedSteps" }) as Project }
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

export const AllStepsCompletedActiveProject = meta.story({
  args: { project: projectBuilder.one({ traits: "activeAllDone" }) as Project }
});

AllStepsCompletedActiveProject.test("All steps show completed badge", async ({ canvas, args }) => {
  const completedBadges = canvas.getAllByText("Ukończono");
  await expect(completedBadges).toHaveLength(args.project.steps.length);
});

AllStepsCompletedActiveProject.test("No active badge is shown", async ({ canvas }) => {
  await expect(canvas.queryByText("W trakcie")).not.toBeInTheDocument();
});

AllStepsCompletedActiveProject.test("Complete button is not shown when all steps are done", async ({ canvas }) => {
  await expect(canvas.queryByRole("button", { name: "Oznacz jako ukończone" })).not.toBeInTheDocument();
});

export const LockedTimeline = meta.story({
  args: { project: projectBuilder.one({ traits: "completedWithSteps" }) as Project }
});

LockedTimeline.test("Complete button is not shown when project is completed", async ({ canvas }) => {
  await expect(canvas.queryByRole("button", { name: "Oznacz jako ukończone" })).not.toBeInTheDocument();
});
