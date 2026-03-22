import { z } from "zod";

export const planSelectionSchema = z.object({
  planId: z.enum(["basic", "standard", "premium"])
});

export type PlanSelectionFormData = z.output<typeof planSelectionSchema>;
