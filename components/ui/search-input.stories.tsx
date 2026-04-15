import { expect } from "storybook/test";

import { SearchInput } from "./search-input";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "UI/Search Input",
  component: SearchInput,
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
  args: { defaultValue: "", placeholder: "Szukaj projektu lub klienta..." }
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
  args: { defaultValue: "Jan", placeholder: "Szukaj projektu lub klienta..." }
});

WithValue.test("Input displays pre-filled value", async ({ canvas }) => {
  const input = canvas.getByRole("searchbox");
  await expect(input).toHaveValue("Jan");
});
