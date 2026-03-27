import { z } from "zod";

export const brandingSchema = z.object({
  logoUrl: z.url().nullable(),
  brandColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Nieprawidłowy kolor HEX")
});

export type BrandingFormData = z.output<typeof brandingSchema>;
