import { type EmailTemplateType } from "~/features/contractor/server/db/email-templates/schema";

export type EmailTemplateTab = {
  label: string;
  type: EmailTemplateType;
  enabled: boolean;
};

export const EMAIL_TEMPLATE_TABS: EmailTemplateTab[] = [{ label: "Powitanie", type: "WELCOME", enabled: true }];
