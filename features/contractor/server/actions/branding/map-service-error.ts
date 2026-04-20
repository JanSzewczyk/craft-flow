import { type BaseServiceError } from "~/lib/services/errors";

export function mapBrandingServiceError(error: BaseServiceError): { success: false; error: string } {
  if (error.isPermissionDenied) {
    return { success: false, error: "Branding wymaga planu Standard lub wyższego" };
  }

  switch (error.code) {
    case "not_found":
      return { success: false, error: "Profil nie istnieje" };
    default:
      return { success: false, error: "Wystąpił błąd serwera. Spróbuj ponownie." };
  }
}
