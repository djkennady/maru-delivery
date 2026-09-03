import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAuthorizedAdmin } from "@/lib/admin-auth";
import { isSupabaseEnabled } from "@/lib/supabase-server";
import { resolveImageType, uploadMenuImage } from "@/lib/menu-image-upload";

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

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Выберите файл" }, { status: 400 });
    }

    const mimeType = resolveImageType(file);
    if (!ALLOWED_TYPES.has(mimeType)) {
      return NextResponse.json(
        {
          error:
            "Нужен JPEG, PNG, WebP или GIF. Фото с iPhone в HEIC сохраните как JPEG.",
        },
        { status: 400 },
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Файл больше 5 МБ" },
        { status: 400 },
      );
    }

    if (isSupabaseEnabled()) {
      const url = await uploadMenuImage(file, mimeType);
      return NextResponse.json({ url });
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
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось загрузить фото";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
