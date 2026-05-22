/*
 * Test plan — ClientProjectTimeline
 *
 * 1. Empty — no steps → renders empty state with "Brak etapów" heading and description
 * 2. InProgress — mixed steps (1 completed, 2 pending) → shows "Ukończono", "W trakcie", "Oczekuje" badges
 * 3. Completed — all steps completed, status COMPLETED → all badges show "Ukończono"
 */

import { expect } from "storybook/test";

import preview from "~/.storybook/preview";

import { clientProjectDetailBuilder, clientProjectStepBuilder } from "~/features/projects/test/builders";
import { type ClientProjectDetail } from "~/features/projects/types/project";

import { ClientProjectTimeline } from "./client-project-timeline";

const meta = preview.meta({
  title: "Features/CRM/Portal/Client Project Timeline",
  component: ClientProjectTimeline,
  parameters: {
    layout: "padded"
  },
  args: {
    project: clientProjectDetailBuilder.one()
  }
});

export const Empty = meta.story({});

Empty.test("Renders empty state content", async ({ canvas, step }) => {
  await step("Empty state heading is visible", async () => {
    await expect(canvas.getByText("Brak etapów")).toBeVisible();
  });

  await step("Empty state description is visible", async () => {
    await expect(canvas.getByText(/ten projekt nie posiada jeszcze żadnych etapów/i)).toBeVisible();
  });
});

const inProgressDetail: ClientProjectDetail = clientProjectDetailBuilder.one({
  traits: "withSteps",
  overrides: {
    steps: [
      clientProjectStepBuilder.one({ traits: "completed", overrides: { orderIndex: 0, title: "Etap pierwszy" } }),
      clientProjectStepBuilder.one({ traits: "pending", overrides: { orderIndex: 1, title: "Etap drugi" } }),
      clientProjectStepBuilder.one({ traits: "pending", overrides: { orderIndex: 2, title: "Etap trzeci" } })
    ],
    completedSteps: 1
  }
});

export const InProgress = meta.story({
  args: {
    project: inProgressDetail
  }
});

InProgress.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Step titles are visible", async () => {
    await expect(canvas.getByText("Etap pierwszy")).toBeVisible();
    await expect(canvas.getByText("Etap drugi")).toBeVisible();
    await expect(canvas.getByText("Etap trzeci")).toBeVisible();
  });

  await step("All three status badges are visible", async () => {
    await expect(canvas.getByText("Ukończono")).toBeVisible();
    await expect(canvas.getByText("W trakcie")).toBeVisible();
    await expect(canvas.getAllByText("Oczekuje")).toHaveLength(1);
  });
});

const completedDetail: ClientProjectDetail = clientProjectDetailBuilder.one({ traits: "withCompletedSteps" });

export const Completed = meta.story({
  args: {
    project: completedDetail
  }
});

Completed.test("Renders all expected content", async ({ canvas, step }) => {
  await step("All step badges show 'Ukończono'", async () => {
    const badges = canvas.getAllByText("Ukończono");
    await expect(badges).toHaveLength(3);
  });

  await step("No 'W trakcie' or 'Oczekuje' badges are shown", async () => {
    await expect(canvas.queryByText("W trakcie")).toBeNull();
    await expect(canvas.queryByText("Oczekuje")).toBeNull();
  });
});
