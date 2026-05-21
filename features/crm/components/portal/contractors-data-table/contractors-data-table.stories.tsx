/*
 * Test plan — ContractorsDataTable
 *
 * 1. Default — 3 contractors → table headers, rows, company names, contact links
 * 2. Empty — 0 items → only header row visible
 * 3. WithManyContractors — 10 items → correct row count
 *    NOTE: pagination is not implemented in this component layer; it operates on raw `items` prop only
 */

import { expect } from "storybook/test";

import preview from "~/.storybook/preview";

import { clientContractorListItemBuilder, contractorListResultBuilder } from "~/features/projects/test/builders";
import { type ContractorListResult } from "~/features/projects/types/contractor";

import { ContractorsDataTable } from "./contractors-data-table";

const meta = preview.meta({
  title: "Features/CRM/Portal/Contractors Data Table",
  component: ContractorsDataTable,
  parameters: {
    layout: "padded"
  }
});

export const Default = meta.story({
  args: {
    items: clientContractorListItemBuilder.many(3)
  }
});

Default.test("Renders all expected content", async ({ canvas, step, args }) => {
  await step("Table headers are visible", async () => {
    await expect(canvas.getByRole("columnheader", { name: /wykonawca/i })).toBeVisible();
    await expect(canvas.getByRole("columnheader", { name: /kontakt/i })).toBeVisible();
    await expect(canvas.getByRole("columnheader", { name: /projekty/i })).toBeVisible();
  });

  await step("Correct number of data rows", async () => {
    const rows = canvas.getAllByRole("row");
    await expect(rows).toHaveLength(args.items.length + 1);
  });

  await step("Company names and detail buttons are visible", async () => {
    for (const item of args.items) {
      await expect(canvas.getByText(item.companyName)).toBeVisible();
    }
    const detailLinks = canvas.getAllByRole("link", { name: /szczegóły/i });
    await expect(detailLinks).toHaveLength(args.items.length);
  });
});

Default.test("Renders mail contact link for each contractor", async ({ canvas, args }) => {
  const mailLinks = canvas.getAllByRole("link", { name: /wyślij e-mail/i });
  await expect(mailLinks).toHaveLength(args.items.length);
});

const emptyResult: ContractorListResult = contractorListResultBuilder.one({ traits: "empty" });

export const Empty = meta.story({
  args: {
    items: emptyResult.items
  }
});

Empty.test("Renders only header row when no contractors", async ({ canvas, step }) => {
  await step("Table headers are visible", async () => {
    await expect(canvas.getByRole("columnheader", { name: /wykonawca/i })).toBeVisible();
    await expect(canvas.getByRole("columnheader", { name: /kontakt/i })).toBeVisible();
    await expect(canvas.getByRole("columnheader", { name: /projekty/i })).toBeVisible();
  });

  await step("No data rows are rendered", async () => {
    const rows = canvas.getAllByRole("row");
    await expect(rows).toHaveLength(1);
  });
});

export const WithManyContractors = meta.story({
  args: {
    items: clientContractorListItemBuilder.many(10)
  }
});

WithManyContractors.test("Renders correct number of rows for 10 contractors", async ({ canvas, args }) => {
  const rows = canvas.getAllByRole("row");
  await expect(rows).toHaveLength(args.items.length + 1);
});

// TODO: pagination is not implemented in this component — ContractorsDataTable renders raw items only.
// Pagination controls live at the page/container level, not inside this component.
