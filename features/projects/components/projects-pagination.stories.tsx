import { expect } from "storybook/test";

import { ProjectsPagination } from "./projects-pagination";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Projects/Projects Pagination",
  component: ProjectsPagination,
  parameters: {
    layout: "padded",
    nextjs: {
      navigation: {
        pathname: "/app/projects"
      }
    }
  }
});

export const FirstPage = meta.story({
  args: {
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalPages: 5,
      totalCount: 50,
      hasNextPage: true,
      hasPrevPage: false
    }
  }
});

FirstPage.test("Renders first page state correctly", async ({ canvas, step }) => {
  await step("Shows correct page indicator", async () => {
    await expect(canvas.getByText("Strona 1 z 5")).toBeVisible();
  });

  await step("Previous button is disabled", async () => {
    await expect(canvas.getByRole("button", { name: /Poprzednia strona/i })).toBeDisabled();
  });

  await step("Next button is enabled", async () => {
    await expect(canvas.getByRole("button", { name: /Następna strona/i })).not.toBeDisabled();
  });
});

export const MiddlePage = meta.story({
  args: {
    pagination: {
      currentPage: 3,
      perPage: 10,
      totalPages: 5,
      totalCount: 50,
      hasNextPage: true,
      hasPrevPage: true
    }
  }
});

MiddlePage.test("Shows correct page indicator", async ({ canvas }) => {
  await expect(canvas.getByText("Strona 3 z 5")).toBeVisible();
});

MiddlePage.test("Both navigation buttons are enabled on middle page", async ({ canvas, step }) => {
  await step("Previous button is enabled", async () => {
    const prevButton = canvas.getByRole("button", { name: /Poprzednia strona/i });
    await expect(prevButton).not.toBeDisabled();
  });

  await step("Next button is enabled", async () => {
    const nextButton = canvas.getByRole("button", { name: /Następna strona/i });
    await expect(nextButton).not.toBeDisabled();
  });
});

export const LastPage = meta.story({
  args: {
    pagination: {
      currentPage: 5,
      perPage: 10,
      totalPages: 5,
      totalCount: 50,
      hasNextPage: false,
      hasPrevPage: true
    }
  }
});

LastPage.test("Renders last page state correctly", async ({ canvas, step }) => {
  await step("Shows correct page indicator", async () => {
    await expect(canvas.getByText("Strona 5 z 5")).toBeVisible();
  });

  await step("Next button is disabled", async () => {
    await expect(canvas.getByRole("button", { name: /Następna strona/i })).toBeDisabled();
  });

  await step("Previous button is enabled", async () => {
    await expect(canvas.getByRole("button", { name: /Poprzednia strona/i })).not.toBeDisabled();
  });
});

export const SinglePage = meta.story({
  args: {
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
      totalCount: 5,
      hasNextPage: false,
      hasPrevPage: false
    }
  }
});

SinglePage.test("Shows correct page indicator", async ({ canvas }) => {
  await expect(canvas.getByText("Strona 1 z 1")).toBeVisible();
});

SinglePage.test("Both navigation buttons are disabled on single page", async ({ canvas, step }) => {
  await step("Previous button is disabled", async () => {
    const prevButton = canvas.getByRole("button", { name: /Poprzednia strona/i });
    await expect(prevButton).toBeDisabled();
  });

  await step("Next button is disabled", async () => {
    const nextButton = canvas.getByRole("button", { name: /Następna strona/i });
    await expect(nextButton).toBeDisabled();
  });
});
