import z from "zod";

export const addressSchema = z.object({
  street: z.string(),
  postalCode: z.string(),
  city: z.string(),
  country: z.string().default("Polska"),
  additionalInfo: z.string().nullable()
});
