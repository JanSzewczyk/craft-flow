import { SidebarProvider } from "@szum-tech/design-system";
import { expect } from "storybook/test";

import preview from "~/.storybook/preview";

import { ClientHeader } from "./client-header";

const meta = preview.meta({
  title: "Features/CRM/Portal/Client Header",
  component: ClientHeader,
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

export const ClientHeaderStory = meta.story({
  name: "Client Header"
});

ClientHeaderStory.test("Renders header with sidebar trigger", async ({ canvas }) => {
  const trigger = canvas.getByRole("button", { name: /toggle sidebar/i });
  await expect(trigger).toBeInTheDocument();
});
