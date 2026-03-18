import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.email({ message: "Podaj prawidłowy adres e-mail" }),
    password: z.string().min(8, { message: "Hasło musi mieć co najmniej 8 znaków" }),
    confirmPassword: z.string().min(1, { message: "Potwierdzenie hasła jest wymagane" })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są zgodne",
    path: ["confirmPassword"]
  });

export type SignUpFormData = z.output<typeof signUpSchema>;
