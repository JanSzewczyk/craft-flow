import { createLogger } from "~/lib/logger";
import { db, type DbClient } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { emailTemplates, type EmailTemplate, type EmailTemplateType } from "./schema";

const logger = createLogger({ module: "email-templates-db" });
const RESOURCE_NAME = "EmailTemplate";

type UpsertEmailTemplateData = {
  type: EmailTemplateType;
  subject: string;
  body: string;
};

export async function upsertEmailTemplate({
  contractorId,
  data,
  dbClient = db
}: {
  contractorId: string;
  data: UpsertEmailTemplateData;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<EmailTemplate>> {
  try {
    const rows = await dbClient
      .insert(emailTemplates)
      .values({ contractorId, ...data, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: [emailTemplates.contractorId, emailTemplates.type],
        set: { subject: data.subject, body: data.body, updatedAt: new Date() }
      })
      .returning();

    const row = rows[0];
    if (!row) {
      const error = SupabaseServiceError.unknown(`Failed to upsert ${RESOURCE_NAME} — no row returned`);
      logger.error({ contractorId, errorCode: error.code }, "Upsert returned no rows");
      return [error, null];
    }

    logger.info({ contractorId, type: data.type }, "Upserted email template");
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to upsert email template");
    return [serviceError, null];
  }
}
