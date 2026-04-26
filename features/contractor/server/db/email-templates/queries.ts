import { and, eq } from "drizzle-orm";

import { createLogger } from "~/lib/logger";
import { db, type DbClient } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { emailTemplates, type EmailTemplate, type EmailTemplateType } from "./schema";

const logger = createLogger({ module: "email-templates-db" });
const RESOURCE_NAME = "EmailTemplate";

export async function getEmailTemplatesByContractor({
  contractorId,
  dbClient = db
}: {
  contractorId: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<EmailTemplate[]>> {
  try {
    const rows = await dbClient.select().from(emailTemplates).where(eq(emailTemplates.contractorId, contractorId));
    return [null, rows];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to get email templates");
    return [serviceError, null];
  }
}

export async function getEmailTemplateByType({
  contractorId,
  type,
  dbClient = db
}: {
  contractorId: string;
  type: EmailTemplateType;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<EmailTemplate>> {
  try {
    const rows = await dbClient
      .select()
      .from(emailTemplates)
      .where(and(eq(emailTemplates.contractorId, contractorId), eq(emailTemplates.type, type)));
    const row = rows[0];

    if (!row) {
      const error = SupabaseServiceError.notFound(RESOURCE_NAME);
      logger.error({ contractorId, type, errorCode: error.code }, "Email template not found");
      return [error, null];
    }

    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ contractorId, type, errorCode: serviceError.code }, "Failed to get email template");
    return [serviceError, null];
  }
}
