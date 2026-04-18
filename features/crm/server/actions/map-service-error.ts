import { type BaseServiceError } from "~/lib/services/errors";

export function mapClientServiceError(error: BaseServiceError): { success: false; error: string } {
  if (error.isPermissionDenied) {
    return { success: false, error: "Brak uprawnień" };
  }

  switch (error.code) {
    case "fk_constraint":
      return {
        success: false,
        error:
          "Nie możesz usunąć tego klienta, ponieważ posiada on przypisane projekty. Najpierw usuń lub zarchiwizuj jego projekty."
      };
    case "not_found":
      return { success: false, error: "Klient nie istnieje" };
    case "already_exists":
      return { success: false, error: "Klient o tym adresie e-mail już istnieje" };
    case "validation":
      return { success: false, error: "Nie można edytować adresu e-mail zarejestrowanego klienta" };
    default:
      return { success: false, error: "Wystąpił błąd serwera. Spróbuj ponownie." };
  }
}
