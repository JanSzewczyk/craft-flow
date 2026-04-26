import { fn } from "storybook/test";

export const updateCompanyProfileAction = fn(
  async () => ({ success: false as const, error: "Nie udało się zaktualizować danych firmy" }) as unknown as never
).mockName("updateCompanyProfileAction");
