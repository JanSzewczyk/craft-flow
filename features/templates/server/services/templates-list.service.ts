import { cache } from "react";

import { getCachedContractorProfile } from "~/features/contractor/server/db";
import {
  getTemplateCountByContractor,
  getTemplateListByContractor,
  type TemplateListOptions,
  type TemplateListResult
} from "~/features/templates/server/db/queries";
import { createLogger } from "~/lib/logger";
import { type SupabaseServiceResult } from "~/lib/supabase/errors";

const logger = createLogger({ module: "templates-list-service" });

const TEMPLATE_LIMIT = 10;

export type TemplateLimits = {
  used: number;
  max: number;
};

async function _getTemplateList(
  userId: string,
  options: TemplateListOptions
): Promise<SupabaseServiceResult<TemplateListResult>> {
  logger.info({ userId, ...options }, "Loading template list");

  const [profileError, profile] = await getCachedContractorProfile(userId);
  if (profileError) {
    logger.error({ userId, errorCode: profileError.code }, "Failed to load contractor profile for template list");
    return [profileError, null];
  }

  return getTemplateListByContractor(profile.id, options);
}

async function _getTemplateLimits(userId: string): Promise<SupabaseServiceResult<TemplateLimits>> {
  logger.info({ userId }, "Loading template limits");

  const [profileError, profile] = await getCachedContractorProfile(userId);
  if (profileError) {
    logger.error({ userId, errorCode: profileError.code }, "Failed to load contractor profile for template limits");
    return [profileError, null];
  }

  const [countError, used] = await getTemplateCountByContractor(profile.id);
  if (countError) {
    logger.error({ userId, errorCode: countError.code }, "Failed to count templates");
    return [countError, null];
  }

  return [null, { used, max: TEMPLATE_LIMIT }];
}

export const getTemplateList = cache(_getTemplateList);
export const getTemplateLimits = cache(_getTemplateLimits);
