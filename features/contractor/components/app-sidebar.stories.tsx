import { SidebarProvider } from "@szum-tech/design-system";
import { expect } from "storybook/test";

import { AppSidebar } from "./app-sidebar";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Contractor/App Sidebar",
  component: AppSidebar,
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
      </SidebarProvider>
    )
  ],
  parameters: {
    layout: "fullscreen"
  }
});

export const DashboardActive = meta.story({
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/app/dashboard"
      }
    }
  }
});

DashboardActive.test("Renders all navigation content", async ({ canvas, step }) => {
  await step("Shows logo and brand name", async () => {
    await expect(canvas.getByText("CraftFlow")).toBeVisible();
  });

  await step("Shows main navigation items with correct hrefs", async () => {
    await expect(canvas.getByText("Panel sterowania")).toBeVisible();
    await expect(canvas.getByText("Projekty")).toBeVisible();
    await expect(canvas.getByText("Klienci")).toBeVisible();
    await expect(canvas.getByText("Szablony")).toBeVisible();
    await expect(canvas.getByRole("link", { name: /projekty/i })).toHaveAttribute("href", "/app/projects");
  });

  await step("Shows bottom navigation items", async () => {
    await expect(canvas.getByText("Ustawienia")).toBeVisible();
    await expect(canvas.getByText("Pomoc")).toBeVisible();
  });
});

// Visual story showing the sidebar with the Projects item active
export const ProjectsActive = meta.story({
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/app/projects"
      }
    }
  }
});
