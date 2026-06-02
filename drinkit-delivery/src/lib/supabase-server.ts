import { createClient } from "@supabase/supabase-js";

type SupabaseClientLike = ReturnType<typeof createClient<any>>;

let cachedClient: SupabaseClientLike | null = null;

function getEnv(name: string): string {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

export function isSupabaseEnabled(): boolean {
  return Boolean(getEnv("SUPABASE_URL") && getEnv("SUPABASE_SERVICE_ROLE_KEY"));
}

export function getSupabaseServerClient() {
  if (!isSupabaseEnabled()) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient(
      getEnv("SUPABASE_URL"),
      getEnv("SUPABASE_SERVICE_ROLE_KEY"),
      {
        auth: { persistSession: false },
      },
    ) as SupabaseClientLike;
  }

  return cachedClient;
}
