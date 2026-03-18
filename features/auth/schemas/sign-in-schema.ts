import { z } from "zod";

export const signInSchema = z.object({
  email: z.email({ message: "Podaj prawidłowy adres e-mail" }),
  password: z.string().min(1, { message: "Hasło jest wymagane" })
});

export type SignInFormData = z.output<typeof signInSchema>;
