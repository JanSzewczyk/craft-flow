import { expect } from "storybook/test";

import { PaginationNav } from "./pagination-nav";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Components/UI/Pagination Nav",
  component: PaginationNav,
  parameters: {
    layout: "padded",
    nextjs: { appDirectory: true }
  }
});

export const FirstPage = meta.story({
  args: {
    pagination: {
      totalCount: 25,
      totalPages: 3,
      currentPage: 1,
      perPage: 10,
      hasNextPage: true,
      hasPrevPage: false
    }
  }
});

FirstPage.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Page indicator is visible", async () => {
    await expect(canvas.getByText("Strona 1 z 3")).toBeVisible();
  });

  await step("Previous button is disabled and next button is enabled", async () => {
    await expect(canvas.getByRole("button", { name: /poprzednia strona/i })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: /następna strona/i })).not.toBeDisabled();
  });
});

export const MiddlePage = meta.story({
  args: {
    pagination: {
      totalCount: 25,
      totalPages: 3,
      currentPage: 2,
      perPage: 10,
      hasNextPage: true,
      hasPrevPage: true
    }
  }
});

MiddlePage.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Page indicator is visible", async () => {
    await expect(canvas.getByText("Strona 2 z 3")).toBeVisible();
  });

  await step("Both pagination buttons are enabled", async () => {
    await expect(canvas.getByRole("button", { name: /poprzednia strona/i })).not.toBeDisabled();
    await expect(canvas.getByRole("button", { name: /następna strona/i })).not.toBeDisabled();
  });
});

export const LastPage = meta.story({
  args: {
    pagination: {
      totalCount: 25,
      totalPages: 3,
      currentPage: 3,
      perPage: 10,
      hasNextPage: false,
      hasPrevPage: true
    }
  }
});

LastPage.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Page indicator is visible", async () => {
    await expect(canvas.getByText("Strona 3 z 3")).toBeVisible();
  });

  await step("Previous button is enabled and next button is disabled", async () => {
    await expect(canvas.getByRole("button", { name: /poprzednia strona/i })).not.toBeDisabled();
    await expect(canvas.getByRole("button", { name: /następna strona/i })).toBeDisabled();
  });
});

export const SinglePage = meta.story({
  args: {
    pagination: {
      totalCount: 5,
      totalPages: 1,
      currentPage: 1,
      perPage: 10,
      hasNextPage: false,
      hasPrevPage: false
    }
  }
});

SinglePage.test("Renders nothing when there is only one page", async ({ canvas }) => {
  const buttons = canvas.queryAllByRole("button");
  await expect(buttons).toHaveLength(0);
});
