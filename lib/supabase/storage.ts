import "server-only";

import { createClient } from "@supabase/supabase-js";
import { env } from "~/data/env/server";

const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export async function uploadFile(
  bucket: string,
  path: string,
  file: Buffer | ArrayBuffer,
  options: { contentType: string; upsert?: boolean }
) {
  const { data, error } = await supabaseAdmin.storage.from(bucket).upload(path, file, {
    contentType: options.contentType,
    cacheControl: "3600",
    upsert: options.upsert ?? false
  });

  if (error) throw error;
  return data;
}

export async function deleteFile(bucket: string, paths: string[]): Promise<void> {
  const { error } = await supabaseAdmin.storage.from(bucket).remove(paths);
  if (error) throw error;
}

export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
