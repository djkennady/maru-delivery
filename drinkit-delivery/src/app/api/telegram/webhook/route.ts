import { NextResponse } from "next/server";
import {
  handleTelegramUpdate,
  isTelegramConfigured,
  isValidTelegramSecret,
  type TelegramUpdate,
} from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isTelegramConfigured()) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  if (
    !isValidTelegramSecret(request.headers.get("x-telegram-bot-api-secret-token"))
  ) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const update = (await request.json()) as TelegramUpdate;
    await handleTelegramUpdate(update);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      "[telegram webhook]",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json({ ok: true });
  }
}
