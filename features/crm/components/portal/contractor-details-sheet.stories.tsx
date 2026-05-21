import { expect, screen, waitFor, within } from "storybook/test";

import { clientContractorListItemBuilder } from "~/features/projects/test/builders";
import { type ClientContractorListItem } from "~/features/projects/types/contractor";

import preview from "~/.storybook/preview";

import { ContractorDetailsSheet } from "./contractor-details-sheet";

const defaultContractor: ClientContractorListItem = clientContractorListItemBuilder.one();
const fullDetailsContractor: ClientContractorListItem = clientContractorListItemBuilder.one({
  traits: ["withPhone", "withAddress", "withBranding"]
});

const meta = preview.meta({
  title: "Features/CRM/Portal/Contractor Details Sheet",
  component: ContractorDetailsSheet,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true }
  },
  args: {
    contractor: defaultContractor
  }
});

export const Default = meta.story({});

Default.test("Renders company name in sheet title", async ({ args }) => {
  const canvas = within(await screen.findByRole("dialog"));

  await waitFor(async () => {
    await expect(canvas.getByText(args.contractor.companyName)).toBeVisible();
  });
});

Default.test("Renders contractor ID prefix in description", async ({ args }) => {
  const canvas = within(await screen.findByRole("dialog"));

  await expect(canvas.getByText(`ID Wykonawcy: ${args.contractor.id.slice(0, 8)}`)).toBeVisible();
});

export const WithFullDetails = meta.story({
  args: { contractor: fullDetailsContractor }
});

WithFullDetails.test("Renders company name in sheet title", async ({ args }) => {
  const canvas = within(await screen.findByRole("dialog"));

  await waitFor(async () => {
    await expect(canvas.getByText(args.contractor.companyName)).toBeVisible();
  });
});

WithFullDetails.test("Renders phone and address inside sheet", async ({ args }) => {
  const canvas = within(await screen.findByRole("dialog"));

  await expect(canvas.getByText(args.contractor.phone!)).toBeVisible();
  await expect(canvas.getByText(args.contractor.address!.street)).toBeVisible();
});
