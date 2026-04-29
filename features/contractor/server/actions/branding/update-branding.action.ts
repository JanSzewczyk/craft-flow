"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { type BrandingFormData } from "~/features/contractor/schemas/branding-schema";
import { type BrandingData, updateBranding } from "~/features/contractor/server/services/branding.service";
import { type ActionResponse } from "~/lib/action-types";

import { logger } from "./logger";
import { mapBrandingServiceError } from "./map-service-error";

export async function updateBrandingAction(data: BrandingFormData): ActionResponse<BrandingData> {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.warn({ operation: "updateBrandingAction" }, "Unauthenticated access attempt");
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const [error, branding] = await updateBranding({ contractorId: userId, data });
  if (error) return mapBrandingServiceError(error);

  revalidatePath("/app/branding");
  return { success: true, data: branding, message: "Branding został zaktualizowany" };
}
