import { afterEach, describe, expect, it, vi } from "vitest";

describe("getAdminPassword", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("does not use the public fallback in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NETLIFY", "true");
    vi.stubEnv("ADMIN_PASSWORD", "");
    vi.resetModules();
    const { getAdminPassword, isAuthorizedAdmin } = await import("@/lib/admin-auth");
    expect(getAdminPassword()).toBe("");
    const request = new Request("http://local/api/admin/orders", {
      headers: { authorization: "Bearer maru-admin" },
    });
    expect(isAuthorizedAdmin(request)).toBe(false);
  });

  it("keeps the local development password when not in production", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("NETLIFY", "");
    vi.stubEnv("VERCEL", "");
    vi.stubEnv("ADMIN_PASSWORD", "");
    vi.resetModules();
    const { getAdminPassword } = await import("@/lib/admin-auth");
    expect(getAdminPassword()).toBe("maru-admin");
  });
});
