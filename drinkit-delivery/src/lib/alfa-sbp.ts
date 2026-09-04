import https from "node:https";
import tls from "node:tls";
import { URL } from "node:url";
import {
  RUSSIAN_TRUSTED_ROOT_CA,
  RUSSIAN_TRUSTED_SUB_CA,
} from "@/lib/russian-trusted-cas";

type AlfaJson = Record<string, unknown>;

const DEFAULT_GATEWAY = "https://payment.alfabank.ru/payment/rest";
const DEFAULT_RETURN_URL = "https://maru-delivery.netlify.app/checkout";

function env(name: string): string {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

export function isAlfaSbpConfigured(): boolean {
  return Boolean(env("ALFA_SBP_USERNAME") && env("ALFA_SBP_PASSWORD"));
}

function gatewayUrl(): string {
  return (env("ALFA_SBP_GATEWAY_URL") || DEFAULT_GATEWAY).replace(/\/+$/, "");
}

function returnUrl(): string {
  return env("ALFA_SBP_RETURN_URL") || DEFAULT_RETURN_URL;
}

export function cardPaymentReturnUrl(sessionId: string, failed = false): string {
  const url = new URL(returnUrl());
  url.searchParams.set("cardSession", sessionId);
  if (failed) url.searchParams.set("failed", "1");
  return url.toString();
}

function credentials() {
  const userName = env("ALFA_SBP_USERNAME");
  const password = env("ALFA_SBP_PASSWORD");
  if (!userName || !password) {
    throw new Error(
      "СБП Альфа-Банка не настроен. Добавьте ALFA_SBP_USERNAME и ALFA_SBP_PASSWORD в переменные окружения Netlify и сделайте redeploy.",
    );
  }
  return { userName, password };
}

function asRecord(value: unknown): AlfaJson {
  return value && typeof value === "object" ? (value as AlfaJson) : {};
}

function errorCode(data: AlfaJson): string {
  if (data.errorCode === undefined || data.errorCode === null) return "0";
  return String(data.errorCode);
}

function isAlfaSuccess(data: AlfaJson): boolean {
  return errorCode(data) === "0";
}

function alfaMessage(data: AlfaJson, fallback: string): string {
  const message = data.errorMessage;
  return typeof message === "string" && message.trim() ? message.trim() : fallback;
}

function networkErrorMessage(error: unknown): string {
  const err = error as Error & {
    code?: string;
    cause?: { code?: string; message?: string };
  };
  const details = [err.cause?.code, err.code, err.cause?.message, err.message]
    .filter((value, index, all): value is string => Boolean(value) && all.indexOf(value) === index)
    .join(", ");
  return `Не удалось связаться с Альфа-Банком (${details || "network error"})`;
}

function postForm(urlString: string, body: string): Promise<{ status: number; raw: string }> {
  const url = new URL(urlString);

  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        protocol: "https:",
        hostname: url.hostname,
        port: url.port || 443,
        path: `${url.pathname}${url.search}`,
        method: "POST",
        family: 4,
        timeout: 20000,
        rejectUnauthorized: true,
        ca: [
          ...tls.rootCertificates,
          RUSSIAN_TRUSTED_ROOT_CA,
          RUSSIAN_TRUSTED_SUB_CA,
        ],
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
          Accept: "application/json, text/plain, */*",
          "User-Agent": "MARU-Delivery/1.0",
          Connection: "close",
        },
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });
        response.on("end", () => {
          resolve({
            status: response.statusCode ?? 0,
            raw: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );

    request.on("timeout", () => {
      request.destroy(new Error("timeout"));
    });
    request.on("error", reject);
    request.write(body);
    request.end();
  });
}

async function alfaPost(path: string, fields: Record<string, string>): Promise<AlfaJson> {
  const { userName, password } = credentials();
  const body = new URLSearchParams({
    userName,
    password,
    ...fields,
  }).toString();

  let status = 0;
  let raw = "";
  try {
    const result = await postForm(`${gatewayUrl()}${path}`, body);
    status = result.status;
    raw = result.raw;
  } catch (error) {
    throw new Error(networkErrorMessage(error));
  }

  let data: AlfaJson = {};
  try {
    data = asRecord(JSON.parse(raw));
  } catch {
    throw new Error("Альфа-Банк вернул некорректный ответ. Попробуйте ещё раз.");
  }

  if (status >= 400 && !isAlfaSuccess(data)) {
    throw new Error(alfaMessage(data, `Ошибка Альфа-Банка (${status})`));
  }

  return data;
}

export interface AlfaRegisteredOrder {
  mdOrder: string;
  formUrl: string;
}

export async function registerAlfaOrder(input: {
  orderNumber: string;
  amountRub: number;
  description: string;
  returnUrl?: string;
  failUrl?: string;
  pageView?: "DESKTOP" | "MOBILE";
}): Promise<AlfaRegisteredOrder> {
  const amountKopecks = Math.round(input.amountRub * 100);
  if (amountKopecks <= 0) {
    throw new Error("Сумма оплаты должна быть больше нуля");
  }

  const successUrl = input.returnUrl || returnUrl();
  const registered = await alfaPost("/register.do", {
    orderNumber: input.orderNumber,
    amount: String(amountKopecks),
    currency: "643",
    returnUrl: successUrl,
    failUrl: input.failUrl || successUrl,
    description: input.description.slice(0, 512),
    language: "ru",
    pageView: input.pageView ?? "DESKTOP",
  });

  if (!isAlfaSuccess(registered) || typeof registered.orderId !== "string") {
    throw new Error(alfaMessage(registered, "Не удалось зарегистрировать заказ в Альфа-Банке"));
  }
  if (typeof registered.formUrl !== "string" || !registered.formUrl) {
    throw new Error("Альфа-Банк не вернул страницу оплаты картой");
  }

  return {
    mdOrder: registered.orderId,
    formUrl: registered.formUrl,
  };
}

export interface AlfaQrResult {
  mdOrder: string;
  payload: string;
  qrId?: string;
}

export async function createAlfaSbpQr(input: {
  orderNumber: string;
  amountRub: number;
  description: string;
}): Promise<AlfaQrResult> {
  const registered = await registerAlfaOrder(input);
  const mdOrder = registered.mdOrder;
  const qr = await alfaPost("/sbp/c2b/qr/dynamic/get.do", {
    mdOrder,
    qrFormat: "image",
    qrWidth: "280",
    qrHeight: "280",
  });

  if (!isAlfaSuccess(qr) || typeof qr.payload !== "string" || !qr.payload) {
    throw new Error(alfaMessage(qr, "Не удалось получить QR СБП от Альфа-Банка"));
  }

  return {
    mdOrder,
    payload: qr.payload,
    qrId: typeof qr.qrId === "string" ? qr.qrId : undefined,
  };
}

export type AlfaOrderStatusCode = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface AlfaOrderStatus {
  orderNumber?: string;
  orderId?: string;
  orderStatus: AlfaOrderStatusCode;
  amountKopecks?: number;
  panMasked?: string;
}

function parseOrderStatus(value: unknown): AlfaOrderStatusCode {
  const numeric = Number(value);
  if (numeric >= 0 && numeric <= 6) {
    return numeric as AlfaOrderStatusCode;
  }
  return 0;
}

export async function getAlfaOrderStatus(input: {
  orderNumber?: string;
  orderId?: string;
}): Promise<AlfaOrderStatus> {
  const fields: Record<string, string> = {};
  if (input.orderId) fields.orderId = input.orderId;
  else if (input.orderNumber) fields.orderNumber = input.orderNumber;
  else throw new Error("Не указан идентификатор платежа Альфа-Банка");

  const data = await alfaPost("/getOrderStatusExtended.do", fields);
  if (!isAlfaSuccess(data)) {
    throw new Error(alfaMessage(data, "Не удалось проверить статус оплаты в Альфа-Банке"));
  }

  const cardAuth = asRecord(data.cardAuthInfo);
  const panMasked = typeof cardAuth.pan === "string" ? cardAuth.pan : undefined;

  return {
    orderNumber: typeof data.orderNumber === "string" ? data.orderNumber : undefined,
    orderId: typeof data.orderId === "string" ? data.orderId : input.orderId,
    orderStatus: parseOrderStatus(data.orderStatus),
    amountKopecks:
      typeof data.amount === "number"
        ? data.amount
        : typeof data.amount === "string"
          ? Number(data.amount)
          : undefined,
    panMasked,
  };
}

export function isAlfaPaymentSuccessful(status: AlfaOrderStatusCode): boolean {
  return status === 1 || status === 2;
}

export function isAlfaPaymentRejected(status: AlfaOrderStatusCode): boolean {
  return status === 3 || status === 4 || status === 6;
}

export async function captureAlfaHold(orderId: string, amountKopecks?: number): Promise<void> {
  const fields: Record<string, string> = { orderId };
  if (amountKopecks && amountKopecks > 0) {
    fields.amount = String(amountKopecks);
  }

  const data = await alfaPost("/deposit.do", fields);
  if (!isAlfaSuccess(data)) {
    throw new Error(alfaMessage(data, "Не удалось завершить холд в Альфа-Банке"));
  }
}

export function encodeSbpQrStorage(mdOrder: string, payload: string): string {
  return JSON.stringify({ v: 1, kind: "sbp", mdOrder, payload });
}

export function encodeCardPaymentStorage(mdOrder: string, formUrl: string): string {
  return JSON.stringify({ v: 1, kind: "card", mdOrder, formUrl });
}

export function decodeSbpQrStorage(raw: string): {
  mdOrder?: string;
  payload: string;
  formUrl?: string;
  kind?: string;
} {
  const value = raw.trim();
  if (value.startsWith("{")) {
    try {
      const parsed = asRecord(JSON.parse(value));
      const payload =
        typeof parsed.payload === "string"
          ? parsed.payload
          : typeof parsed.formUrl === "string"
            ? parsed.formUrl
            : "";
      if (payload || typeof parsed.mdOrder === "string") {
        return {
          mdOrder: typeof parsed.mdOrder === "string" ? parsed.mdOrder : undefined,
          payload,
          formUrl: typeof parsed.formUrl === "string" ? parsed.formUrl : undefined,
          kind: typeof parsed.kind === "string" ? parsed.kind : undefined,
        };
      }
    } catch {
      /* legacy payload */
    }
  }
  return { payload: value };
}
