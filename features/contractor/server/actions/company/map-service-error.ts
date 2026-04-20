import { type BaseServiceError } from "~/lib/services/errors";

export function mapCompanyServiceError(error: BaseServiceError): { success: false; error: string } {
  if (error.isPermissionDenied) {
    return { success: false, error: "Brak uprawnień" };
  }

  switch (error.code) {
    case "not_found":
      return { success: false, error: "Profil firmy nie istnieje" };
    default:
      return { success: false, error: "Wystąpił błąd serwera. Spróbuj ponownie." };
  }
}
