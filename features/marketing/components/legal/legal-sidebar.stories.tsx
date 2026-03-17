import * as React from "react";

import { FileTextIcon, InfoIcon, UserIcon } from "lucide-react";

import { expect } from "storybook/test";

import { type LegalSidebarSection, LegalSidebar } from "./legal-sidebar";

import preview from "~/.storybook/preview";

const SAMPLE_SECTIONS: readonly LegalSidebarSection[] = [
  { id: "postanowienia-ogolne", number: 1, title: "Postanowienia ogólne", icon: <FileTextIcon className="size-4" /> },
  { id: "definicje", number: 2, title: "Definicje", icon: <InfoIcon className="size-4" /> },
  { id: "rejestracja-i-konto", number: 3, title: "Rejestracja i konto", icon: <UserIcon className="size-4" /> }
];

const meta = preview.meta({
  title: "Marketing/Legal/LegalSidebar",
  component: LegalSidebar,
  args: {
    sections: SAMPLE_SECTIONS
  },
  parameters: {
    layout: "padded"
  }
});

export const Default = meta.story({ name: "Default" });
Default.test("renders TOC heading and all section links", async ({ canvas, step }) => {
  await step("Verify Spis treści heading is present", async () => {
    const heading = canvas.getByText("Spis treści");
    await expect(heading).toBeVisible();
  });

  await step("Verify TOC buttons render with section titles", async () => {
    const btn1 = canvas.getByRole("button", { name: /§1\. Postanowienia ogólne/i });
    await expect(btn1).toBeVisible();

    const btn2 = canvas.getByRole("button", { name: /§2\. Definicje/i });
    await expect(btn2).toBeVisible();

    const btn3 = canvas.getByRole("button", { name: /§3\. Rejestracja/i });
    await expect(btn3).toBeVisible();
  });

  await step("Verify help card is absent when helpEmail not provided", async () => {
    const helpCard = canvas.queryByText(/Masz pytania/i);
    await expect(helpCard).not.toBeInTheDocument();
  });
});

export const WithHelpEmail = meta.story({
  name: "With Help Email",
  args: {
    helpEmail: "legal@craftflow.com"
  }
});
WithHelpEmail.test("renders help card when helpEmail is provided", async ({ canvas, step }) => {
  await step("Verify help card heading is visible", async () => {
    const helpHeading = canvas.getByText(/Masz pytania/i);
    await expect(helpHeading).toBeVisible();
  });

  await step("Verify email link is present", async () => {
    const emailLink = canvas.getByRole("link", { name: /legal@craftflow\.com/i });
    await expect(emailLink).toBeInTheDocument();
    await expect(emailLink).toHaveAttribute("href", "mailto:legal@craftflow.com");
  });
});
