import { expect } from "storybook/test";

import { ProjectDetailTabsNav } from "./project-detail-tabs-nav";

import preview from "~/.storybook/preview";

const projectId = "proj-123";
const timelinePath = `/app/projects/${projectId}`;
const filesPath = `/app/projects/${projectId}/files`;

const meta = preview.meta({
  title: "Features/Projects/Project Detail Tabs Nav",
  component: ProjectDetailTabsNav,
  args: {
    projectId,
    children: null
  }
});

export const TimelineTab = meta.story({
  parameters: {
    nextjs: {
      navigation: {
        pathname: timelinePath
      }
    }
  }
});

TimelineTab.test("Renders both tab links", async ({ canvas }) => {
  await expect(canvas.getByRole("tab", { name: "Oś czasu" })).toBeVisible();
  await expect(canvas.getByRole("tab", { name: "Wszystkie pliki" })).toBeVisible();
});

TimelineTab.test("Timeline tab is active when on timeline path", async ({ canvas }) => {
  await expect(canvas.getByRole("tab", { name: "Oś czasu" })).toHaveAttribute("data-state", "active");
  await expect(canvas.getByRole("tab", { name: "Wszystkie pliki" })).toHaveAttribute("data-state", "inactive");
});

export const FilesTab = meta.story({
  parameters: {
    nextjs: {
      navigation: {
        pathname: filesPath
      }
    }
  }
});

FilesTab.test("Files tab is active when on files path", async ({ canvas }) => {
  await expect(canvas.getByRole("tab", { name: "Wszystkie pliki" })).toHaveAttribute("data-state", "active");
  await expect(canvas.getByRole("tab", { name: "Oś czasu" })).toHaveAttribute("data-state", "inactive");
});
