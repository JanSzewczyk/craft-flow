import { expect } from "storybook/test";
import { publicProjectViewBuilder } from "~/features/projects/test/builders";

import { GuestTimeline } from "./guest-timeline";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Projects/Guest Timeline",
  component: GuestTimeline,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    )
  ]
});

export const EmptyGuestTimeline = meta.story({
  args: { project: publicProjectViewBuilder.one({ traits: "active" })! }
});

EmptyGuestTimeline.test("Shows empty state when no steps", async ({ canvas }) => {
  await expect(canvas.getByText("Brak etapów")).toBeVisible();
});

export const ActiveGuestTimeline = meta.story({
  args: { project: publicProjectViewBuilder.one({ traits: "activeWithMixedSteps" })! }
});

ActiveGuestTimeline.test("Shows completed badges", async ({ canvas }) => {
  const completedBadges = canvas.getAllByText("Ukończono");
  await expect(completedBadges).toHaveLength(2);
});

ActiveGuestTimeline.test("Shows active badge for current step", async ({ canvas }) => {
  await expect(canvas.getByText("W trakcie")).toBeVisible();
});

ActiveGuestTimeline.test("Does not show complete button", async ({ canvas }) => {
  await expect(canvas.queryByRole("button", { name: "Oznacz jako ukończone" })).not.toBeInTheDocument();
});

export const CompletedGuestTimeline = meta.story({
  args: { project: publicProjectViewBuilder.one({ traits: "completedWithSteps" })! }
});

CompletedGuestTimeline.test("All steps show completed badge", async ({ canvas, args }) => {
  const completedBadges = canvas.getAllByText("Ukończono");
  await expect(completedBadges).toHaveLength(args.project.steps.length);
});
