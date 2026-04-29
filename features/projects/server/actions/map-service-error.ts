import { type BaseServiceError } from "~/lib/services/errors";

export function mapProjectServiceError(error: BaseServiceError): { success: false; error: string } {
  if (error.isPermissionDenied) {
    return { success: false, error: "Brak uprawnień do wykonania tej operacji" };
  }

  if (error.isNotFound) {
    return { success: false, error: "Nie znaleziono wymaganego zasobu" };
  }

  if (error.isAlreadyExists) {
    return { success: false, error: "Klient o tym adresie e-mail już istnieje" };
  }

  if (error.isValidation) {
    return { success: false, error: "Dane są nieprawidłowe" };
  }

  if (error.isLimitExceeded) {
    return { success: false, error: "Przekroczono limit projektów dla aktualnego planu" };
  }

  return { success: false, error: "Wystąpił błąd serwera. Spróbuj ponownie." };
}
