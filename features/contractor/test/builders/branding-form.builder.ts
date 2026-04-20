import { build, oneOf } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { type BrandingFormData } from "~/features/contractor/schemas/branding-schema";

const BRAND_COLORS = ["#2563EB", "#DC2626", "#16A34A", "#9333EA", "#EA580C", "#0891B2"] as const;

/**
 * Builder for BrandingFormData test data.
 *
 * @example
 * const data = brandingFormBuilder.one();
 *
 * @example
 * const data = brandingFormBuilder.one({
 *   overrides: { brandColor: "#FF0000" }
 * });
 */
export const brandingFormBuilder = build<BrandingFormData>({
  fields: {
    logoUrl: () => faker.image.url(),
    brandColor: oneOf(...BRAND_COLORS)
  }
});
