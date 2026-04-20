export type EmailVariable = {
  placeholder: string;
  description: string;
};

export const EMAIL_VARIABLES: EmailVariable[] = [
  { placeholder: "{{clientName}}", description: "Imię i nazwisko klienta" },
  { placeholder: "{{projectName}}", description: "Nazwa projektu" },
  { placeholder: "{{companyName}}", description: "Nazwa Twojej firmy" },
  { placeholder: "{{date}}", description: "Data bieżąca" }
];
