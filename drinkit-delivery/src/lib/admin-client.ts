export const ADMIN_TOKEN_KEY = "maru-admin-token";

export function getAdminHeaders(): HeadersInit {
  if (typeof window === "undefined") {
    return { "Content-Type": "application/json" };
  }

  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  return {
    Authorization: `Bearer ${token ?? ""}`,
    "Content-Type": "application/json",
  };
}

export function getAdminAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") {
    return {};
  }

  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  return {
    Authorization: `Bearer ${token ?? ""}`,
  };
}
