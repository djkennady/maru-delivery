import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/admin-auth";
import {
  getTelegramStatus,
  isTelegramConfigured,
  registerTelegramWebhook,
} from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json(await getTelegramStatus());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Telegram error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isTelegramConfigured()) {
    return NextResponse.json(
      {
        error:
          "Добавьте TELEGRAM_BOT_TOKEN в переменные Netlify и сделайте redeploy.",
      },
      { status: 400 },
    );
  }

  try {
    const result = await registerTelegramWebhook();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Telegram error" },
      { status: 500 },
    );
  }
}
