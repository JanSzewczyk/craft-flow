import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z.string().min(1, { message: "Imię jest wymagane" }),
  lastName: z.string().min(1, { message: "Nazwisko jest wymagane" }),
  email: z.email({ message: "Podaj prawidłowy adres e-mail" }),
  password: z.string().min(8, { message: "Hasło musi mieć co najmniej 8 znaków" })
});

export type SignUpFormData = z.output<typeof signUpSchema>;
