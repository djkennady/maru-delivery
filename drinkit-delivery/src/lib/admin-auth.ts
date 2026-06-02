export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "maru-admin";
}

export function isAuthorizedAdmin(request: Request): boolean {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  return auth.slice(7) === getAdminPassword();
}
