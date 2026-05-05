import "server-only";

import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "projects-email-service" });

type ProjectActivationEmailParams = {
  contractorName: string;
  clientEmail: string;
  clientName: string;
  projectName: string;
  projectPublicToken: string;
};

export const emailService = {
  async sendProjectActivationEmail(params: ProjectActivationEmailParams): Promise<void> {
    logger.info(params, "Wysyłanie emaila aktywacji projektu (mock)");
    // TODO: Integracja z Resend + React Email
  }
};
