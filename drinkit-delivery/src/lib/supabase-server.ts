import { createClient } from "@supabase/supabase-js";

type SupabaseClientLike = ReturnType<typeof createClient<any>>;

let cachedClient: SupabaseClientLike | null = null;

function getEnv(name: string): string {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeSupabaseUrl(url: string): string {
  let normalized = url.trim().replace(/\/+$/, "");
  normalized = normalized.replace(/\/rest\/v1$/i, "");
  normalized = normalized.replace(/\/v1$/i, "");
  return normalized;
}

function getSupabaseUrl(): string {
  return normalizeSupabaseUrl(getEnv("SUPABASE_URL"));
}

export function isSupabaseEnabled(): boolean {
  return Boolean(getSupabaseUrl() && getEnv("SUPABASE_SERVICE_ROLE_KEY"));
}

export function isCloudRuntime(): boolean {
  return process.env.NETLIFY === "true" || process.env.VERCEL === "1";
}

export function assertPersistentStorageAvailable() {
  if (isCloudRuntime() && !isSupabaseEnabled()) {
    throw new Error(
      "Хранилище не настроено. Добавьте SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY в Netlify и сделайте redeploy.",
    );
  }
}

export function getSupabaseServerClient() {
  if (!isSupabaseEnabled()) {
    return null;
  }

  if (!cachedClient) {
    const supabaseUrl = getSupabaseUrl();
    if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(supabaseUrl)) {
      throw new Error(
        "SUPABASE_URL должен быть вида https://xxxxx.supabase.co (без /rest/v1).",
      );
    }

    cachedClient = createClient(
      supabaseUrl,
      getEnv("SUPABASE_SERVICE_ROLE_KEY"),
      {
        auth: { persistSession: false },
      },
    ) as SupabaseClientLike;
  }

  return cachedClient;
}
