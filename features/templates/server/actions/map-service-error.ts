import { type BaseServiceError } from "~/lib/services/errors";

export function mapTemplateServiceError(error: BaseServiceError): { success: false; error: string } {
  if (error.isPermissionDenied) {
    return { success: false, error: "Brak uprawnień" };
  }

  switch (error.code) {
    case "limit_exceeded":
      return {
        success: false,
        error: `Osiągnięto limit ${error.meta["max"]} szablonów. Zwiększ plan, aby dodać więcej.`
      };
    case "not_found":
      return { success: false, error: "Szablon nie istnieje" };
    default:
      return { success: false, error: "Wystąpił błąd serwera. Spróbuj ponownie." };
  }
}
