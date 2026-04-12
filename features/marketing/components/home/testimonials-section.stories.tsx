import { expect } from "storybook/test";

import { TestimonialsSection } from "./testimonials-section";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Marketing/Home/Testimonials Section",
  component: TestimonialsSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
});

export const TestimonialsSectionStory = meta.story({ name: "Testimonials Section" });

TestimonialsSectionStory.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Renders section heading and subtitle", async () => {
    await expect(canvas.getByRole("heading", { name: /Zaufali nam rzemieślnicy z całej Polski/i })).toBeVisible();
    await expect(canvas.getByText(/Prawdziwe opinie od prawdziwych fachowców\./i)).toBeVisible();
  });

  await step("Renders all 3 testimonial names", async () => {
    await expect(canvas.getByText("Marek Wiśniewski")).toBeVisible();
    await expect(canvas.getByText("Piotr Zając")).toBeVisible();
    await expect(canvas.getByText("Tomasz Nowak")).toBeVisible();
  });

  await step("Renders star ratings for all 3 testimonials", async () => {
    const ratings = canvas.getAllByLabelText("Ocena 5 na 5 gwiazdek");
    await expect(ratings).toHaveLength(3);
  });
});
