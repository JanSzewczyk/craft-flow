import { type BaseServiceError } from "~/lib/services/errors";

export function mapTemplateServiceError(error: BaseServiceError): { success: false; error: string } {
  if (error.isPermissionDenied) {
    return { success: false, error: "Brak uprawnień" };
  }

  if (error.isLimitExceeded) {
    return {
      success: false,
      error: `Osiągnięto limit ${error.meta["max"]} szablonów. Zwiększ plan, aby dodać więcej.`
    };
  }

  if (error.isNotFound) {
    return { success: false, error: "Szablon nie istnieje" };
  }

  return { success: false, error: "Wystąpił błąd serwera. Spróbuj ponownie." };
}
