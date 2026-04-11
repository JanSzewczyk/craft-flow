import { expect } from "storybook/test";

import preview from "~/.storybook/preview";

import { ProjectsSearch } from "./projects-search";

const meta = preview.meta({
  title: "Features/Projects/Projects Search",
  component: ProjectsSearch,
  parameters: {
    layout: "centered",
    nextjs: {
      navigation: {
        pathname: "/app/projects"
      }
    }
  }
});

export const Empty = meta.story({
  args: { defaultValue: "" }
});

Empty.test("Renders search input correctly", async ({ canvas, step }) => {
  await step("Input is visible with correct placeholder", async () => {
    await expect(canvas.getByPlaceholderText("Szukaj projektu lub klienta...")).toBeVisible();
  });

  await step("Input is empty by default", async () => {
    await expect(canvas.getByRole("searchbox")).toHaveValue("");
  });
});

export const WithValue = meta.story({
  args: { defaultValue: "Jan" }
});

WithValue.test("Input displays pre-filled value", async ({ canvas }) => {
  const input = canvas.getByRole("searchbox");
  await expect(input).toHaveValue("Jan");
});
