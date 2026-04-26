import { type BaseServiceError } from "~/lib/services/errors";

export function mapClientServiceError(error: BaseServiceError): { success: false; error: string } {
  if (error.isPermissionDenied) {
    return { success: false, error: "Brak uprawnień" };
  }

  if (error.isFkConstraint) {
    return {
      success: false,
      error:
        "Nie możesz usunąć tego klienta, ponieważ posiada on przypisane projekty. Najpierw usuń lub zarchiwizuj jego projekty."
    };
  }

  if (error.isNotFound) {
    return { success: false, error: "Klient nie istnieje" };
  }

  if (error.isAlreadyExists) {
    return { success: false, error: "Klient o tym adresie e-mail już istnieje" };
  }

  if (error.isValidation) {
    return { success: false, error: "Nie można edytować adresu e-mail zarejestrowanego klienta" };
  }

  return { success: false, error: "Wystąpił błąd serwera. Spróbuj ponownie." };
}
