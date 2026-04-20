import { z } from "zod";

export const companyDetailsSchema = z.object({
  companyName: z.string().min(2, "Nazwa firmy musi mieć co najmniej 2 znaki"),
  industry: z.string().min(1, "Wybierz branżę"),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()/]{7,20}$/, "Nieprawidłowy numer telefonu")
    .nullable()
});

export type CompanyDetailsFormData = z.output<typeof companyDetailsSchema>;
