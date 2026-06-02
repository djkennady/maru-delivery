import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAuthorizedAdmin } from "@/lib/admin-auth";
import { isSupabaseEnabled } from "@/lib/supabase-server";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "menu");

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isSupabaseEnabled()) {
    return NextResponse.json(
      {
        error:
          "В облачном режиме загрузка файлов на диск недоступна. Используйте прямую ссылку на изображение.",
      },
      { status: 400 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File required" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeExtension = ["jpg", "jpeg", "png", "webp", "gif"].includes(
      extension,
    )
      ? extension
      : "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExtension}`;
    const filepath = path.join(UPLOAD_DIR, filename);
    const buffer = Buffer.from(await file.arrayBuffer());

    await fs.writeFile(filepath, buffer);

    return NextResponse.json({ url: `/uploads/menu/${filename}` });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
