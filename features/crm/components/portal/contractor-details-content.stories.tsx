import { expect } from "storybook/test";

import { clientContractorListItemBuilder } from "~/features/projects/test/builders";
import { type ClientContractorListItem } from "~/features/projects/types/contractor";

import preview from "~/.storybook/preview";

import { ContractorDetailsContent } from "./contractor-details-content";

const minimalContractor: ClientContractorListItem = clientContractorListItemBuilder.one();
const contractorWithPhone: ClientContractorListItem = clientContractorListItemBuilder.one({
  traits: "withPhone"
});
const contractorWithAddress: ClientContractorListItem = clientContractorListItemBuilder.one({
  traits: "withAddress"
});
const fullDetailsContractor: ClientContractorListItem = clientContractorListItemBuilder.one({
  traits: ["withPhone", "withAddress", "withBranding"]
});

const meta = preview.meta({
  title: "Features/CRM/Portal/Contractor Details Content",
  component: ContractorDetailsContent,
  parameters: {
    layout: "padded"
  },
  args: {
    contractor: minimalContractor
  }
});

export const WithMinimalInfo = meta.story({});

WithMinimalInfo.test("Renders industry and email", async ({ canvas, args }) => {
  await expect(canvas.getByText(args.contractor.industry)).toBeVisible();
  await expect(canvas.getByText(args.contractor.email)).toBeVisible();
});

WithMinimalInfo.test("Does not render phone when absent", async ({ canvas }) => {
  await expect(canvas.queryByText("Telefon")).toBeNull();
});

WithMinimalInfo.test("Does not render address when absent", async ({ canvas }) => {
  await expect(canvas.queryByText("Adres")).toBeNull();
});

WithMinimalInfo.test("Renders project counts", async ({ canvas, args }) => {
  await expect(canvas.getByText(String(args.contractor.activeProjectCount))).toBeVisible();
  await expect(canvas.getByText(String(args.contractor.projectCount))).toBeVisible();
});

export const WithPhone = meta.story({
  args: { contractor: contractorWithPhone }
});

WithPhone.test("Renders phone number", async ({ canvas, args }) => {
  await expect(canvas.getByText("Telefon")).toBeVisible();
  await expect(canvas.getByText(args.contractor.phone!)).toBeVisible();
});

export const WithAddress = meta.story({
  args: { contractor: contractorWithAddress }
});

WithAddress.test("Renders address section", async ({ canvas, args }) => {
  await expect(canvas.getByText("Adres")).toBeVisible();
  await expect(canvas.getByText(args.contractor.address!.street)).toBeVisible();
  await expect(canvas.getByText(args.contractor.address!.country)).toBeVisible();
});

export const WithFullDetails = meta.story({
  args: { contractor: fullDetailsContractor }
});

WithFullDetails.test("Renders industry, email, phone and address", async ({ canvas, args }) => {
  await expect(canvas.getByText(args.contractor.industry)).toBeVisible();
  await expect(canvas.getByText(args.contractor.email)).toBeVisible();
  await expect(canvas.getByText(args.contractor.phone!)).toBeVisible();
  await expect(canvas.getByText(args.contractor.address!.street)).toBeVisible();
});

WithFullDetails.test("Renders project count cards", async ({ canvas, args }) => {
  await expect(canvas.getByText(String(args.contractor.activeProjectCount))).toBeVisible();
  await expect(canvas.getByText(String(args.contractor.projectCount))).toBeVisible();
});
