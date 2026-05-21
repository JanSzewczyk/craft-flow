import { SidebarProvider } from "@szum-tech/design-system";
import { expect } from "storybook/test";

import preview from "~/.storybook/preview";

import { ClientSidebar } from "./client-sidebar";

const meta = preview.meta({
  title: "Features/CRM/Portal/Client Sidebar",
  component: ClientSidebar,
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

export const DefaultView = meta.story({
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/client"
      }
    }
  }
});

DefaultView.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Shows CraftFlow logo", async () => {
    const svg = canvas.getByRole("link", { name: /craftflow/i });
    await expect(svg).toBeInTheDocument();
  });

  await step("Shows Portal Klienta label", async () => {
    await expect(canvas.getByText("Portal Klienta")).toBeVisible();
  });

  await step("Shows all navigation items", async () => {
    await expect(canvas.getByText("Moje Projekty")).toBeVisible();
    await expect(canvas.getByText("Historia")).toBeVisible();
    await expect(canvas.getByText("Wykonawcy")).toBeVisible();
  });

  await step("Shows sign out button", async () => {
    await expect(canvas.getByText("Wyloguj się")).toBeVisible();
  });
});

DefaultView.test("Moje Projekty item is active on /client path", async ({ canvas }) => {
  const mojeProjectyLink = canvas.getByRole("link", { name: /moje projekty/i });
  await expect(mojeProjectyLink).toHaveAttribute("href", "/client");
});

export const HistoryView = meta.story({
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/client/history"
      }
    }
  }
});

HistoryView.test("Historia link points to correct href", async ({ canvas }) => {
  const historiaLink = canvas.getByRole("link", { name: /historia/i });
  await expect(historiaLink).toHaveAttribute("href", "/client/history");
});

export const ContractorsView = meta.story({
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/client/contractors"
      }
    }
  }
});

ContractorsView.test("Wykonawcy link points to correct href", async ({ canvas }) => {
  const wykonawcyLink = canvas.getByRole("link", { name: /wykonawcy/i });
  await expect(wykonawcyLink).toHaveAttribute("href", "/client/contractors");
});
