"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ImagePlus,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { getAdminAuthHeaders, getAdminHeaders } from "@/lib/admin-client";
import { getProductImage } from "@/lib/media";
import { formatPrice } from "@/lib/pricing";
import type { Category, Product, ProductInput, ProductTag } from "@/types/menu";

const EMPTY_FORM: ProductInput = {
  name: "",
  description: "",
  categoryId: "coffee",
  emoji: "☕",
  basePrice: 250,
  customizable: false,
  tags: [],
  imageUrl: "",
  rkeeperCode: "",
};

interface AdminMenuManagerProps {
  onMenuChanged?: () => void;
}

export function AdminMenuManager({ onMenuChanged }: AdminMenuManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductInput>(EMPTY_FORM);
  const [hasSizes, setHasSizes] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const loadMenu = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/menu", {
        headers: getAdminHeaders(),
        cache: "no-store",
      });
      if (res.status === 401) {
        setError("Сессия истекла — войдите заново");
        return;
      }
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as {
        categories: Category[];
        products: Product[];
      };
      setCategories(data.categories);
      setProducts(data.products);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Не удалось загрузить меню";
      setError(message === "failed" ? "Не удалось загрузить меню" : message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMenu();
  }, [loadMenu]);

  const resetForm = () => {
    setForm({
      ...EMPTY_FORM,
      categoryId: categories[0]?.id ?? "coffee",
    });
    setHasSizes(false);
    setEditingId(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setForm({
      ...EMPTY_FORM,
      categoryId: categories[0]?.id ?? "coffee",
    });
    setHasSizes(false);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      emoji: product.emoji,
      basePrice: product.basePrice,
      sizes: product.sizes,
      customizable: product.customizable,
      tags: product.tags ?? [],
      imageUrl: product.imageUrl ?? "",
      rkeeperCode: product.rkeeperCode ?? "",
    });
    setHasSizes(Boolean(product.sizes && Object.keys(product.sizes).length));
    setEditingId(product.id);
    setShowForm(true);
  };

  const groupedProducts = useMemo(() => {
    return categories.map((category) => ({
      category,
      items: products.filter((product) => product.categoryId === category.id),
    }));
  }, [categories, products]);

  const toggleTag = (tag: ProductTag) => {
    setForm((prev) => {
      const tags = prev.tags ?? [];
      return {
        ...prev,
        tags: tags.includes(tag)
          ? tags.filter((item) => item !== tag)
          : [...tags, tag],
      };
    });
  };

  const handleUpload = async (file: File, target: "product" | "category") => {
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/admin/menu/upload", {
        method: "POST",
        headers: getAdminAuthHeaders(),
        body,
      });

      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Не удалось загрузить фото");
      }

      if (target === "product") {
        setForm((prev) => ({ ...prev, imageUrl: data.url }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить фото");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload: ProductInput = {
      ...form,
      basePrice: Number(form.basePrice) || 0,
      sizes: hasSizes ? form.sizes : undefined,
      customizable: hasSizes ? form.customizable : false,
      tags: form.tags?.length ? form.tags : undefined,
      imageUrl: form.imageUrl?.trim() || undefined,
      rkeeperCode: form.rkeeperCode?.trim() || undefined,
    };

    try {
      const res = await fetch(
        editingId
          ? `/api/admin/menu/products/${editingId}`
          : "/api/admin/menu/products",
        {
          method: editingId ? "PATCH" : "POST",
          headers: getAdminHeaders(),
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "save failed");
      }

      resetForm();
      await loadMenu();
      onMenuChanged?.();
    } catch (err) {
      setError(
        err instanceof Error && err.message !== "save failed"
          ? `Не удалось сохранить: ${err.message}`
          : "Не удалось сохранить позицию",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Удалить эту позицию из меню?")) return;

    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/menu/products/${id}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      if (!res.ok) throw new Error("delete failed");
      await loadMenu();
      onMenuChanged?.();
    } catch {
      setError("Не удалось удалить позицию");
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/menu/categories", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      if (!res.ok) throw new Error("category failed");
      setNewCategoryName("");
      await loadMenu();
      onMenuChanged?.();
    } catch {
      setError("Не удалось добавить категорию");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--text)]">Меню</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {products.length} позиций · {categories.length} категорий
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void loadMenu()}
            disabled={loading}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--muted)] transition hover:text-[var(--text)] disabled:opacity-50"
            aria-label="Обновить меню"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            <Plus className="h-4 w-4" />
            Добавить
          </button>
        </div>
      </section>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <form
        onSubmit={handleAddCategory}
        className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
      >
        <p className="text-sm font-semibold text-[var(--text)]">
          Новая категория
        </p>
        <div className="mt-3 flex gap-2">
          <input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Например: Завтраки"
            className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={saving || !newCategoryName.trim()}
            className="shrink-0 rounded-xl bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--border)] disabled:opacity-50"
          >
            Создать
          </button>
        </div>
      </form>

      {showForm && (
        <form
          onSubmit={handleSaveProduct}
          className="space-y-4 rounded-2xl border border-orange-200 bg-orange-50/40 p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold text-[var(--text)]">
              {editingId ? "Редактировать позицию" : "Новая позиция"}
            </p>
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-[var(--muted)] transition hover:text-[var(--text)]"
            >
              Отмена
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium">Название</span>
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium">Описание</span>
              <textarea
                required
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Категория</span>
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, categoryId: e.target.value }))
                }
                className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Эмодзи</span>
              <input
                value={form.emoji}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, emoji: e.target.value }))
                }
                className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Цена, ₽</span>
              <input
                required
                type="number"
                min={0}
                value={form.basePrice}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    basePrice: Number(e.target.value),
                  }))
                }
                className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium">
                Код R-Keeper (необязательно)
              </span>
              <input
                value={form.rkeeperCode ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, rkeeperCode: e.target.value }))
                }
                placeholder="Например: 10042"
                className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              />
              <span className="mt-1 block text-xs text-[var(--muted)]">
                Нужен только если позже подключите кипер. На сайт не влияет.
              </span>
            </label>

            <label className="flex items-center gap-2 self-end pb-2">
              <input
                type="checkbox"
                checked={hasSizes}
                onChange={(e) => setHasSizes(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--border)]"
              />
              <span className="text-sm">Разные размеры (S / M / L)</span>
            </label>
          </div>

          {hasSizes && (
            <div className="grid grid-cols-3 gap-2">
              {(["s", "m", "l"] as const).map((size) => (
                <label key={size} className="block">
                  <span className="mb-1 block text-xs font-medium uppercase">
                    {size}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={form.sizes?.[size] ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        sizes: {
                          ...prev.sizes,
                          [size]: Number(e.target.value) || undefined,
                        },
                      }))
                    }
                    className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                  />
                </label>
              ))}
            </div>
          )}

          {hasSizes && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(form.customizable)}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    customizable: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-[var(--border)]"
              />
              <span className="text-sm">Выбор молока в карточке товара</span>
            </label>
          )}

          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.tags?.includes("hit") ?? false}
                onChange={() => toggleTag("hit")}
                className="h-4 w-4 rounded border-[var(--border)]"
              />
              <span className="text-sm">Хит</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.tags?.includes("new") ?? false}
                onChange={() => toggleTag("new")}
                className="h-4 w-4 rounded border-[var(--border)]"
              />
              <span className="text-sm">Новинка</span>
            </label>
          </div>

          <div className="space-y-2">
            <span className="block text-sm font-medium">Фото</span>
            <div className="flex gap-3">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[var(--surface)]">
                {form.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.imageUrl}
                    alt="Превью"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[var(--muted)]">
                    <UtensilsCrossed className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <input
                  value={form.imageUrl ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
                  }
                  placeholder="Ссылка или загрузите файл"
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                />
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-[var(--text)] ring-1 ring-[var(--border)] transition hover:bg-[var(--surface)]">
                  <ImagePlus className="h-4 w-4" />
                  {uploading ? "Загрузка..." : "Загрузить фото"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (file) void handleUpload(file, "product");
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-neutral-900 px-5 py-3 font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
          >
            {saving ? "Сохранение..." : editingId ? "Сохранить" : "Добавить в меню"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="py-8 text-center text-sm text-[var(--muted)]">
          Загрузка меню...
        </p>
      ) : (
        <div className="space-y-5">
          {groupedProducts.map(({ category, items }) => (
            <section key={category.id}>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--muted)]">
                {category.name}
              </h3>
              {items.length === 0 ? (
                <p className="rounded-xl border border-dashed border-[var(--border)] px-4 py-6 text-center text-sm text-[var(--muted)]">
                  Пока пусто
                </p>
              ) : (
                <div className="space-y-2">
                  {items.map((product) => (
                    <article
                      key={product.id}
                      className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                        <Image
                          src={getProductImage(product.id, product.imageUrl)}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[var(--text)]">
                          {product.emoji} {product.name}
                        </p>
                        <p className="text-sm text-[var(--muted)]">
                          {formatPrice(product.basePrice)}
                          {product.tags?.includes("hit") ? " · Хит" : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => openEditForm(product)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--muted)] transition hover:text-[var(--text)]"
                          aria-label="Редактировать"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteProduct(product.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--muted)] transition hover:text-red-500"
                          aria-label="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
