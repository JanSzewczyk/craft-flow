import { SidebarProvider } from "@szum-tech/design-system";
import { expect } from "storybook/test";

import { AppHeader } from "./app-header";

import preview from "~/.storybook/preview";

/*
 * Test plan:
 * 1. AppHeaderStory — renders the header with sidebar trigger and user button area
 *    - Header element is present
 *    - Sidebar trigger button is rendered
 */

const meta = preview.meta({
  title: "Features/Contractor/App Header",
  component: AppHeader,
  parameters: {
    layout: "fullscreen"
  },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
      </SidebarProvider>
    )
  ]
});

export const AppHeaderStory = meta.story({
  name: "App Header"
});

AppHeaderStory.test("Renders header with sidebar trigger", async ({ canvas }) => {
  const trigger = canvas.getByRole("button", { name: /toggle sidebar/i });
  await expect(trigger).toBeInTheDocument();
});
