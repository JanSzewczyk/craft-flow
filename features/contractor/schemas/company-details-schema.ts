import { z } from "zod";

import { addressSchema } from "~/features/shared/schemas";

export const companyDetailsSchema = z
  .object({
    companyName: z.string().min(2, "Nazwa firmy musi mieć co najmniej 2 znaki"),
    industry: z.string().min(1, "Wybierz branżę"),
    phone: z
      .string()
      .regex(/^\+?[\d\s\-()/]{7,20}$/, "Nieprawidłowy numer telefonu")
      .nullable(),
    nip: z.string().nullable(),
    regon: z.string().nullable(),
    email: z.email("Nieprawidłowy adres email"),
    address: addressSchema.nullable()
  })
  .superRefine((data, ctx) => {
    if (!data.address) return;

    const { street, postalCode, city } = data.address;
    const anyFilled = !!(street || postalCode || city);
    if (!anyFilled) return;
    if (!street)
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Ulica jest wymagana", path: ["address", "street"] });
    if (!postalCode)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Kod pocztowy jest wymagany",
        path: ["address", "postalCode"]
      });
    if (!city)
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Miasto jest wymagane", path: ["address", "city"] });
  });

export type CompanyDetailsFormData = z.output<typeof companyDetailsSchema>;
