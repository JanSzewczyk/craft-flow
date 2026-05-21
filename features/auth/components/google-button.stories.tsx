import { expect, fn } from "storybook/test";

import { GoogleButton } from "./google-button";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Auth/Google Button",
  component: GoogleButton,
  args: {
    onClick: fn(),
    children: "Kontynuuj z Google"
  },
  parameters: {
    layout: "centered"
  }
});

export const GoogleButtonStory = meta.story({ name: "Google Button" });

GoogleButtonStory.test("Renders button with children text", async ({ canvas }) => {
  const button = canvas.getByRole("button", { name: /kontynuuj z google/i });
  await expect(button).toBeVisible();
  await expect(button).toHaveTextContent(/kontynuuj z google/i);
});

GoogleButtonStory.test("Button is disabled", async ({ canvas }) => {
  const button = canvas.getByRole("button", { name: /kontynuuj z google/i });
  await expect(button).toBeDisabled();
});

GoogleButtonStory.test("Renders Google SVG icon inside button", async ({ canvasElement }) => {
  const button = canvasElement.querySelector("button");
  const svg = button?.querySelector("svg");
  await expect(svg).toBeInTheDocument();
});
