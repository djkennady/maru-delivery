import { getSupabaseServerClient, isSupabaseEnabled } from "@/lib/supabase-server";

export const MENU_IMAGE_BUCKET = "menu";

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export function resolveImageType(file: File): string {
  if (file.type && file.type !== "application/octet-stream") {
    return file.type;
  }
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return MIME_BY_EXT[ext] ?? "";
}

export async function ensureMenuBucket() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    throw new Error(`Не удалось проверить хранилище: ${listError.message}`);
  }

  if (buckets?.some((bucket) => bucket.id === MENU_IMAGE_BUCKET)) {
    return;
  }

  const { error } = await supabase.storage.createBucket(MENU_IMAGE_BUCKET, {
    public: true,
    fileSizeLimit: "5MB",
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  });

  if (error && !/already exists|duplicate/i.test(error.message)) {
    throw new Error(
      `Создайте публичный bucket "${MENU_IMAGE_BUCKET}" в Supabase Storage. ${error.message}`,
    );
  }
}

export async function uploadMenuImage(file: File, mimeType: string) {
  const supabase = getSupabaseServerClient();
  if (!isSupabaseEnabled() || !supabase) {
    return null;
  }

  await ensureMenuBucket();

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExtension = ["jpg", "jpeg", "png", "webp", "gif"].includes(extension)
    ? extension
    : mimeType === "image/png"
      ? "png"
      : mimeType === "image/webp"
        ? "webp"
        : mimeType === "image/gif"
          ? "gif"
          : "jpg";

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExtension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(MENU_IMAGE_BUCKET).upload(filename, buffer, {
    contentType: mimeType,
    upsert: false,
  });

  if (error) {
    throw new Error(`Не удалось сохранить файл: ${error.message}`);
  }

  const { data } = supabase.storage.from(MENU_IMAGE_BUCKET).getPublicUrl(filename);
  if (!data?.publicUrl) {
    throw new Error("Не удалось получить ссылку на фото");
  }

  return data.publicUrl;
}
