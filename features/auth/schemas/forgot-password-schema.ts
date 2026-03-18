import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email({ message: "Podaj prawidłowy adres e-mail" })
});

export type ForgotPasswordFormData = z.output<typeof forgotPasswordSchema>;

export const forgotPasswordVerifySchema = z
  .object({
    code: z
      .string()
      .length(6, { message: "Kod musi mieć dokładnie 6 cyfr" })
      .regex(/^\d+$/, { message: "Kod może zawierać tylko cyfry" }),
    password: z.string().min(8, { message: "Hasło musi mieć co najmniej 8 znaków" }),
    confirmPassword: z.string().min(1, { message: "Potwierdzenie hasła jest wymagane" })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są zgodne",
    path: ["confirmPassword"]
  });

export type ForgotPasswordVerifyFormData = z.output<typeof forgotPasswordVerifySchema>;
