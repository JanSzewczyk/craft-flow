import "server-only";

import { createClient } from "@supabase/supabase-js";
import { env } from "~/data/env/server";
import { SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export async function uploadFile(
  bucket: string,
  path: string,
  file: Buffer | ArrayBuffer,
  options: { contentType: string; upsert?: boolean }
): Promise<SupabaseServiceResult<{ path: string }>> {
  const { data, error } = await supabaseAdmin.storage.from(bucket).upload(path, file, {
    contentType: options.contentType,
    cacheControl: "3600",
    upsert: options.upsert ?? false
  });

  if (error) {
    return [
      new SupabaseServiceError({
        code: "storage_upload",
        message: error.message,
        isRetryable: false,
        cause: error
      }),
      null
    ];
  }
  return [null, data];
}

export async function deleteFile(bucket: string, paths: string[]): Promise<SupabaseServiceResult<void>> {
  const { error } = await supabaseAdmin.storage.from(bucket).remove(paths);
  if (error) {
    return [
      new SupabaseServiceError({
        code: "storage_delete",
        message: error.message,
        isRetryable: false,
        cause: error
      }),
      null
    ];
  }
  return [null, undefined];
}

export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Extracts the file path from a Supabase public URL for a given bucket.
 * e.g. "https://...supabase.co/storage/v1/object/public/logos/user123/logo.png" → "user123/logo.png"
 */
export function getPathFromPublicUrl(url: string, bucket: string): string | null {
  try {
    const pathname = new URL(url).pathname;
    const segments = pathname.split(`/${bucket}/`);
    return segments[1] ?? null;
  } catch {
    return null;
  }
}
