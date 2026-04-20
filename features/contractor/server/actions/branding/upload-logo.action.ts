"use server";

import { auth } from "@clerk/nextjs/server";
import { type ActionResponse } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";
import { getPublicUrl, uploadFile } from "~/lib/supabase/storage";

const logger = createLogger({ module: "branding-actions" });

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/svg+xml"];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export async function uploadLogoAction(formData: FormData): ActionResponse<{ url: string }> {
  const { userId, isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { success: false, error: "Brak pliku" };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: "Dozwolone formaty: PNG, JPG, SVG" };
  }

  if (file.size > MAX_SIZE) {
    return { success: false, error: "Maksymalny rozmiar pliku to 2MB" };
  }

  const buffer = await file.arrayBuffer();
  const extension = file.name.split(".").pop() ?? "png";
  const path = `${userId}/logo.${extension}`;

  const [error] = await uploadFile("logos", path, buffer, {
    contentType: file.type,
    upsert: true
  });

  if (error) {
    logger.error({ userId, errorCode: error.code }, "Failed to upload logo");
    return { success: false, error: "Nie udało się przesłać logo" };
  }

  const url = getPublicUrl("logos", path);
  logger.info({ userId }, "Logo uploaded successfully");
  return { success: true, data: { url } };
}
