import { expect, fn, screen, waitFor } from "storybook/test";
import { clientBuilder } from "~/features/crm/test/builders";
import { type Project } from "~/features/projects/server/db/schema";
import { projectBuilder } from "~/features/projects/test/builders";

import { ProjectSidebar } from "./project-sidebar";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Projects/Project Sidebar",
  component: ProjectSidebar,
  args: {
    onUpdateStatusAction: fn().mockResolvedValue({ success: true, data: undefined }),
    onDeleteAction: fn().mockResolvedValue(undefined)
  },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    )
  ]
});

export const DraftProject = meta.story({
  args: { project: projectBuilder.one({ traits: "draftWithSteps" }) as Project }
});

DraftProject.test("Renders client info section", async ({ canvas, args }) => {
  await expect(canvas.getByText("Klient")).toBeVisible();
  await expect(canvas.getByText(args.project.client.name)).toBeVisible();
  await expect(canvas.getByText(args.project.client.email)).toBeVisible();
});

DraftProject.test("Renders project status card", async ({ canvas }) => {
  await expect(canvas.getByText("Status projektu")).toBeVisible();
  await expect(canvas.getByText("Szkic")).toBeVisible();
});

DraftProject.test("Shows activate button for draft project", async ({ canvas }) => {
  await expect(canvas.getByRole("button", { name: "Aktywuj projekt" })).toBeVisible();
});

DraftProject.test("Shows more options menu button for draft project", async ({ canvas }) => {
  await expect(canvas.getByRole("button", { name: "Więcej opcji" })).toBeVisible();
});

DraftProject.test("Opens activate confirmation dialog on button click", async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: "Aktywuj projekt" }));
  await waitFor(async () => {
    await expect(screen.getByRole("alertdialog")).toBeVisible();
    await expect(screen.getByText("Aktywować projekt?")).toBeVisible();
  });
});

DraftProject.test("Opens delete confirmation via dropdown menu", async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: "Więcej opcji" }));
  await waitFor(async () => {
    await expect(screen.getByText("Usuń projekt")).toBeVisible();
  });
  await userEvent.click(screen.getByText("Usuń projekt"));
  await waitFor(async () => {
    await expect(screen.getByText("Usunąć projekt?")).toBeVisible();
  });
});

export const ActiveProject = meta.story({
  args: { project: projectBuilder.one({ traits: "activeWithMixedSteps" }) as Project }
});

ActiveProject.test("Shows active status badge", async ({ canvas }) => {
  await expect(canvas.getByText("Aktywny")).toBeVisible();
});

ActiveProject.test("Shows complete project button for active project", async ({ canvas }) => {
  await expect(canvas.getByRole("button", { name: "Zakończ projekt" })).toBeVisible();
});

ActiveProject.test("Shows more options menu for active project", async ({ canvas }) => {
  await expect(canvas.getByRole("button", { name: "Więcej opcji" })).toBeVisible();
});

ActiveProject.test("Opens complete confirmation dialog on button click", async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: "Zakończ projekt" }));
  await waitFor(async () => {
    await expect(screen.getByRole("alertdialog")).toBeVisible();
    await expect(screen.getByText("Zakończyć projekt?")).toBeVisible();
  });
});

ActiveProject.test("Shows copy link option in dropdown for active project", async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: "Więcej opcji" }));
  await waitFor(async () => {
    await expect(screen.getByText("Kopiuj link dla klienta")).toBeVisible();
  });
});

export const CompletedProject = meta.story({
  args: { project: projectBuilder.one({ traits: "completedWithSteps" }) as Project }
});

CompletedProject.test("Shows completed status badge", async ({ canvas }) => {
  await expect(canvas.getByText("Zakończony")).toBeVisible();
});

CompletedProject.test("Shows copy link button for completed project", async ({ canvas }) => {
  await expect(canvas.getByRole("button", { name: "Kopiuj link dla klienta" })).toBeVisible();
});

export const ProjectWithoutPhone = meta.story({
  args: {
    project: projectBuilder.one({
      traits: "activeWithSteps",
      overrides: { client: clientBuilder.one({ traits: "noPhone" }) }
    }) as Project
  }
});

ProjectWithoutPhone.test("Does not render phone link when client has no phone", async ({ canvas, args }) => {
  await expect(canvas.getByText(args.project.client.email)).toBeVisible();
  const phoneLink = canvas.queryByText(
    (_, element) => element?.tagName === "A" && !!element.getAttribute("href")?.startsWith("tel:")
  );
  await expect(phoneLink).not.toBeInTheDocument();
});
