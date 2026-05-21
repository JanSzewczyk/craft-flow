import { expect } from "storybook/test";
import { paginationMetaBuilder } from "../../tests/builders/pagination.builder";
import { type PaginationMeta } from "~/types/pagination";

import { PaginationNav } from "./pagination-nav";

import preview from "~/.storybook/preview";

const firstPagePagination: PaginationMeta = paginationMetaBuilder.one({ traits: "firstPage" });
const middlePagePagination: PaginationMeta = paginationMetaBuilder.one({ traits: "middlePage" });
const lastPagePagination: PaginationMeta = paginationMetaBuilder.one({ traits: "lastPage" });
const singlePagePagination: PaginationMeta = paginationMetaBuilder.one({ traits: "singlePage" });

const meta = preview.meta({
  title: "Components/Pagination Nav",
  component: PaginationNav,
  parameters: {
    layout: "padded",
    nextjs: {
      navigation: {
        pathname: "/app/projects"
      }
    }
  },
  args: {
    pagination: firstPagePagination
  }
});

export const FirstPage = meta.story({});

FirstPage.test("Renders first page state correctly", async ({ canvas, step, args }) => {
  await step("Shows correct page indicator", async () => {
    await expect(
      canvas.getByText(`Strona ${args.pagination.currentPage} z ${args.pagination.totalPages}`)
    ).toBeVisible();
  });

  await step("Previous button is disabled", async () => {
    await expect(canvas.getByRole("button", { name: /Poprzednia strona/i })).toBeDisabled();
  });

  await step("Next button is enabled", async () => {
    await expect(canvas.getByRole("button", { name: /Następna strona/i })).not.toBeDisabled();
  });
});

export const MiddlePage = meta.story({
  args: { pagination: middlePagePagination }
});

MiddlePage.test("Shows correct page indicator", async ({ canvas, args }) => {
  await expect(canvas.getByText(`Strona ${args.pagination.currentPage} z ${args.pagination.totalPages}`)).toBeVisible();
});

MiddlePage.test("Both navigation buttons are enabled on middle page", async ({ canvas, step }) => {
  await step("Previous button is enabled", async () => {
    await expect(canvas.getByRole("button", { name: /Poprzednia strona/i })).not.toBeDisabled();
  });

  await step("Next button is enabled", async () => {
    await expect(canvas.getByRole("button", { name: /Następna strona/i })).not.toBeDisabled();
  });
});

export const LastPage = meta.story({
  args: { pagination: lastPagePagination }
});

LastPage.test("Renders last page state correctly", async ({ canvas, step, args }) => {
  await step("Shows correct page indicator", async () => {
    await expect(
      canvas.getByText(`Strona ${args.pagination.currentPage} z ${args.pagination.totalPages}`)
    ).toBeVisible();
  });

  await step("Next button is disabled", async () => {
    await expect(canvas.getByRole("button", { name: /Następna strona/i })).toBeDisabled();
  });

  await step("Previous button is enabled", async () => {
    await expect(canvas.getByRole("button", { name: /Poprzednia strona/i })).not.toBeDisabled();
  });
});

export const SinglePage = meta.story({
  args: { pagination: singlePagePagination }
});

SinglePage.test("Renders nothing when there is only one page", async ({ canvas }) => {
  await expect(canvas.queryByRole("button", { name: /Poprzednia strona/i })).toBeNull();
  await expect(canvas.queryByRole("button", { name: /Następna strona/i })).toBeNull();
});
