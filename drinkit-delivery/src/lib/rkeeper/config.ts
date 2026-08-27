import type { RkeeperConfig } from "./types";

function env(name: string): string {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

export function getRkeeperConfig(): RkeeperConfig {
  const enabled =
    env("RKEEPER_ENABLED").toLowerCase() === "true" ||
    env("RKEEPER_ENABLED") === "1";

  return {
    enabled,
    baseUrl: env("RKEEPER_BASE_URL"),
    objectId: env("RKEEPER_OBJECT_ID"),
    stationId: env("RKEEPER_STATION_ID"),
    username: env("RKEEPER_USERNAME"),
    password: env("RKEEPER_PASSWORD"),
    failOrderOnError:
      env("RKEEPER_FAIL_ORDER_ON_ERROR").toLowerCase() === "true" ||
      env("RKEEPER_FAIL_ORDER_ON_ERROR") === "1",
  };
}

export function isRkeeperReady(config: RkeeperConfig = getRkeeperConfig()): boolean {
  if (!config.enabled) return false;
  return Boolean(
    config.baseUrl &&
      config.objectId &&
      config.username &&
      config.password,
  );
}

export function getRkeeperStatus() {
  const config = getRkeeperConfig();
  return {
    enabled: config.enabled,
    ready: isRkeeperReady(config),
    hasBaseUrl: Boolean(config.baseUrl),
    hasObjectId: Boolean(config.objectId),
    hasStationId: Boolean(config.stationId),
    hasCredentials: Boolean(config.username && config.password),
    failOrderOnError: config.failOrderOnError,
  };
}
