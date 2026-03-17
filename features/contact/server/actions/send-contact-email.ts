"use server";

import { type CreateEmailResponseSuccess, Resend } from "resend";

import { render } from "@react-email/render";
import { env } from "~/data/env/server";
import { type ContactFormData } from "~/features/contact/schemas/contact-schema";
import { type ActionResponse } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

import { ContactEmail } from "../../components/templates/contact-email";

const logger = createLogger({ module: "contact-action" });

const resend = new Resend(env.RESEND_API_KEY);

export async function sendContactEmail(contactData: ContactFormData): ActionResponse<CreateEmailResponseSuccess> {
  logger.info({ subject: contactData.subject, email: contactData.email }, "Received contact form submission");

  try {
    const emailHtml = await render(ContactEmail({ data: contactData }));
    logger.debug({ htmlLength: emailHtml.length }, "Email HTML rendered successfully");

    const subjectLabels: Record<string, string> = {
      demo: "Prezentacja systemu (Demo)",
      pricing: "Zapytanie o cennik",
      support: "Pomoc techniczna",
      other: "Inne"
    };

    const emailSubject = `[CraftFlow] ${subjectLabels[contactData.subject] || contactData.subject}`;

    logger.debug({ to: env.CONTACT_EMAIL_TO, subject: emailSubject }, "Sending email via Resend");

    const { error, data } = await resend.emails.send({
      from: "CraftFlow <craft-flow-contact@resend.dev>",
      to: env.CONTACT_EMAIL_TO,
      subject: emailSubject,
      html: emailHtml
    });

    if (error) {
      logger.error({ error, statusCode: error.statusCode }, "Resend API returned an error");
      return {
        success: false,
        error: "Nie udało się wysłać wiadomości. Spróbuj ponownie później."
      };
    }

    logger.info({ to: env.CONTACT_EMAIL_TO }, "Contact email sent successfully");
    return { success: true, data };
  } catch (error) {
    logger.error({ error }, "Unexpected error while sending contact email");
    return {
      success: false,
      error: "Nie udało się wysłać wiadomości. Spróbuj ponownie później."
    };
  }
}
