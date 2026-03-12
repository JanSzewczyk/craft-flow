"use server";

import { Resend } from "resend";

import { env } from "~/data/env/server";
import { createLogger } from "~/lib/logger";
import { contactFormSchema, type ContactFormData } from "~/features/contact/schemas/contact-schema";

const logger = createLogger({ module: "contact" });

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildEmailHtml(data: ContactFormData): string {
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeSubject = escapeHtml(data.subject);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, "<br>");

  return `
    <!DOCTYPE html>
    <html lang="pl">
      <head>
        <meta charset="UTF-8" />
        <title>Nowa wiadomość z formularza kontaktowego</title>
      </head>
      <body style="font-family: sans-serif; color: #222; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="margin-bottom: 16px;">Nowa wiadomość z formularza kontaktowego</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; background: #f4f4f5; border: 1px solid #e4e4e7; white-space: nowrap;">Imię i nazwisko</td>
            <td style="padding: 8px 12px; border: 1px solid #e4e4e7;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; background: #f4f4f5; border: 1px solid #e4e4e7; white-space: nowrap;">Adres e-mail</td>
            <td style="padding: 8px 12px; border: 1px solid #e4e4e7;">${safeEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; background: #f4f4f5; border: 1px solid #e4e4e7; white-space: nowrap;">Temat</td>
            <td style="padding: 8px 12px; border: 1px solid #e4e4e7;">${safeSubject}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; background: #f4f4f5; border: 1px solid #e4e4e7; vertical-align: top; white-space: nowrap;">Wiadomość</td>
            <td style="padding: 8px 12px; border: 1px solid #e4e4e7;">${safeMessage}</td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export async function sendContactEmail(
  data: ContactFormData
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = contactFormSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: "Nieprawidłowe dane formularza" };
  }

  const resend = new Resend(env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: "CraftFlow <kontakt@craftflow.pl>",
      to: env.CONTACT_EMAIL_TO,
      subject: `[CraftFlow] ${parsed.data.subject}`,
      html: buildEmailHtml(parsed.data)
    });

    if (error) {
      logger.error({ error }, "Failed to send contact email");
      return {
        success: false,
        error: "Nie udało się wysłać wiadomości. Spróbuj ponownie później."
      };
    }

    return { success: true };
  } catch (error) {
    logger.error({ error }, "Failed to send contact email");
    return {
      success: false,
      error: "Nie udało się wysłać wiadomości. Spróbuj ponownie później."
    };
  }
}
