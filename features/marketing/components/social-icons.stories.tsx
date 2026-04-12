import { expect } from "storybook/test";

import { FacebookIcon, LinkedInIcon } from "./social-icons";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Marketing/Social Icons",
  parameters: { layout: "centered" }
});

export const LinkedInIconStory = meta.story({
  name: "LinkedIn Icon",
  render: () => <LinkedInIcon className="size-6" />
});

LinkedInIconStory.test("Renders LinkedIn SVG icon", async ({ canvas }) => {
  const svg = canvas.getByRole("img");
  await expect(svg).toBeVisible();
});

export const FacebookIconStory = meta.story({
  name: "Facebook Icon",
  render: () => <FacebookIcon className="size-6" />
});

FacebookIconStory.test("Renders Facebook SVG icon", async ({ canvas }) => {
  const svg = canvas.getByRole("img");
  await expect(svg).toBeVisible();
});
