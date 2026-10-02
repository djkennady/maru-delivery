function configuredAdminPassword(): string {
  const value = process.env.ADMIN_PASSWORD;
  return typeof value === "string" ? value.trim() : "";
}

function isProductionRuntime(): boolean {
  return (
    process.env.NETLIFY === "true" ||
    process.env.VERCEL === "1" ||
    process.env.NODE_ENV === "production"
  );
}

/** Local-only default. Production/Netlify never fall back to a public password. */
const LOCAL_DEV_PASSWORD = "maru-admin";

export function getAdminPassword(): string {
  const configured = configuredAdminPassword();
  if (configured) return configured;
  if (isProductionRuntime()) return "";
  return LOCAL_DEV_PASSWORD;
}

export function isAuthorizedAdmin(request: Request): boolean {
  const password = getAdminPassword();
  if (!password) return false;
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  return auth.slice(7) === password;
}
