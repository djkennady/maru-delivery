"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HALL_PHOTO_ITEMS, HALL_SECTIONS, PICKUP_SITE_URL, type HallItem, type HallKind } from "@/data/hall-menu";

type Lightbox = {
  name: string;
  photos: string[];
  index: number;
};

const kinds: { id: HallKind; label: string }[] = [
  { id: "food", label: "Кухня" },
  { id: "drinks", label: "Напитки" },
];

export function HallMenuExperience() {
  const [kind, setKind] = useState<HallKind>("food");
  const [query, setQuery] = useState("");
  const [lightbox, setLightbox] = useState<Lightbox | null>(null);

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return HALL_SECTIONS.filter((section) => section.kind === kind)
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          if (!q) return true;
          return `${item.name} ${item.desc ?? ""} ${item.note ?? ""}`
            .toLowerCase()
            .includes(q);
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [kind, query]);

  const mosaic = HALL_PHOTO_ITEMS.slice(0, 8);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowRight") {
        setLightbox((current) =>
          current
            ? {
                ...current,
                index: (current.index + 1) % current.photos.length,
              }
            : current,
        );
      }
      if (event.key === "ArrowLeft") {
        setLightbox((current) =>
          current
            ? {
                ...current,
                index:
                  (current.index - 1 + current.photos.length) %
                  current.photos.length,
              }
            : current,
        );
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  return (
    <div className="hall-theme relative z-10 min-h-screen bg-[#12110e] text-[#f6f1e8]">
      <header className="relative isolate min-h-[88vh] overflow-hidden">
        <Image
          src="/hall-menu/dishes/0005.webp"
          alt=""
          fill
          priority
          className="hall-ken object-cover opacity-45"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#12110e]/45 to-[#12110e]" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col px-5 pb-16 pt-6 sm:px-8">
          <nav className="flex items-start justify-between gap-4">
            <Link href="/" className="leading-none">
              <span className="font-brand text-[2.4rem] tracking-[-0.06em] text-white">
                МАРУ
              </span>
              <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.48em] text-white/70">
                кухня и кофе
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/25 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-white/80">
                Алабуга
              </span>
              <a
                href={PICKUP_SITE_URL}
                className="rounded-full bg-[#f3ead8] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#171611] transition hover:bg-white"
              >
                Самовывоз −10%
              </a>
            </div>
          </nav>

          <div className="mt-auto max-w-3xl hall-reveal">
            <p className="text-xs uppercase tracking-[0.28em] text-[#d9cfbe]">
              Меню · каждый день
            </p>
            <h1 className="font-serif mt-5 text-[clamp(3.4rem,10vw,7.5rem)] font-normal leading-[0.88] tracking-[-0.05em]">
              Вкус — в деталях.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[#d8d2c7]">
              Современная кухня, знакомые сочетания и кофе, к которому хочется
              возвращаться. Живые фото блюд — как в зале МАРУ.
            </p>
            <div className="mt-8 flex w-full max-w-md items-center justify-between border-t border-white/25 pt-5">
              <span className="font-serif text-xl italic">Завтраки</span>
              <strong className="text-xs font-normal tracking-[0.16em]">
                08:00 — 11:00
              </strong>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {mosaic.map((item, index) => (
            <button
              key={item.name}
              type="button"
              onClick={() =>
                openLightbox(item, setLightbox)
              }
              className={`group relative overflow-hidden rounded-sm ${
                index === 0 || index === 5 ? "sm:col-span-2 sm:row-span-2 min-h-56" : "min-h-36"
              } hall-reveal`}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <Image
                src={item.photo!}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition duration-700 group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 right-3 text-left font-sans text-base font-semibold leading-tight sm:text-xl">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="sticky top-0 z-30 border-b border-[#d6cdbf]/30 bg-[#12110e]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex w-fit rounded-full bg-[#2a2823] p-1">
            {kinds.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setKind(item.id);
                  setQuery("");
                }}
                className={`rounded-full px-5 py-2.5 text-base font-medium transition ${
                  kind === item.id
                    ? "bg-[#f3ead8] text-[#171611]"
                    : "text-[#cfc6b6]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="flex min-w-0 items-center gap-2 border-b border-[#8d8578] pb-1 sm:w-72">
            <span className="text-lg text-[#cfc6b6]">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Найти в меню"
              aria-label="Поиск по меню"
              className="w-full bg-transparent text-base text-[#f6f1e8] outline-none placeholder:text-[#8d8578]"
            />
          </label>
        </div>
        {!query ? (
          <div className="scrollbar-hide mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 pb-4 sm:px-8">
            {HALL_SECTIONS.filter((section) => section.kind === kind).map(
              (section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="shrink-0 rounded-full border border-[#cfc5b6]/35 px-3.5 py-2 text-[15px] text-[#ddd4c5] transition hover:bg-white/10"
                >
                  {section.title}
                </a>
              ),
            )}
          </div>
        ) : null}
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        {sections.map((section, sectionIndex) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-36 border-b border-[#bdb3a4]/25 py-14"
          >
            <div className="mb-8 flex items-end gap-5">
              <span className="font-serif text-lg italic text-[#8c8376]">
                {String(sectionIndex + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-serif text-[clamp(2.2rem,5vw,4.6rem)] font-normal leading-none tracking-[-0.04em]">
                  {section.title}
                </h2>
                {section.note ? (
                  <p className="mt-2 text-base text-[#c8c0b3]">{section.note}</p>
                ) : null}
              </div>
            </div>
            <div className="grid gap-x-[6vw] sm:grid-cols-2">
              {section.items.map((item) => (
                <article
                  key={item.name}
                  className={`grid items-start gap-4 border-t border-[#d2c9bc]/20 py-6 ${
                    item.photo
                      ? "grid-cols-[104px_minmax(0,1fr)_auto] sm:grid-cols-[140px_minmax(0,1fr)_auto]"
                      : "grid-cols-[minmax(0,1fr)_auto]"
                  }`}
                >
                  {item.photo ? (
                    <button
                      type="button"
                      className="relative h-[84px] overflow-hidden rounded-sm bg-[#2a2722] sm:h-[108px]"
                      onClick={() => openLightbox(item, setLightbox)}
                      aria-label={`Открыть фотографию: ${item.name}`}
                    >
                      <Image
                        src={item.photo}
                        alt={item.name}
                        fill
                        sizes="140px"
                        className="object-cover transition duration-500 hover:scale-105"
                      />
                    </button>
                  ) : null}
                  <div className="min-w-0">
                    <h3 className="font-sans text-[1.4rem] font-semibold leading-snug tracking-tight text-[#f6f1e8] sm:text-[1.65rem]">
                      {item.name}
                    </h3>
                    {item.desc ? (
                      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[#d4ccc0] sm:text-base">
                        {item.desc}
                      </p>
                    ) : null}
                    {item.note ? (
                      <small className="mt-2 block text-[13px] uppercase tracking-[0.12em] text-[#c2b9ab]">
                        {item.note}
                      </small>
                    ) : null}
                  </div>
                  <strong className="whitespace-nowrap pt-1 text-lg font-semibold sm:text-xl">
                    {item.price}
                  </strong>
                </article>
              ))}
            </div>
          </section>
        ))}
        {!sections.length ? (
          <div className="py-24 text-center">
            <p className="font-serif text-4xl">Ничего не нашли</p>
            <p className="mt-3 text-[#b8b0a3]">Попробуйте изменить запрос.</p>
          </div>
        ) : null}

        <div className="mt-16 overflow-hidden rounded-[28px] border border-[#f3ead8]/15 bg-gradient-to-r from-[#2a241c] to-[#171611] p-8 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#d9cfbe]">
              Не в зале — с собой
            </p>
            <p className="font-serif mt-2 text-3xl leading-tight">
              Самовывоз со скидкой 10%
            </p>
            <p className="mt-2 max-w-md text-sm text-[#cfc6b6]">
              То же МАРУ, только заказать можно онлайн и забрать в Алабуге.
            </p>
          </div>
          <a
            href={PICKUP_SITE_URL}
            className="mt-6 inline-flex rounded-full bg-[#f3ead8] px-6 py-3 text-base font-semibold text-[#171611] transition hover:bg-white sm:mt-0"
          >
            Оформить заказ
          </a>
        </div>
      </div>

      {lightbox ? (
        <div
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-black/92 px-4"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.name}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-3xl leading-none text-white"
            aria-label="Закрыть"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-sm">
              <Image
                src={lightbox.photos[lightbox.index]}
                alt={lightbox.name}
                fill
                sizes="92vw"
                className="object-contain"
                priority
              />
            </div>
            {lightbox.photos.length > 1 ? (
              <div className="mt-4 flex items-center justify-between text-sm text-white/80">
                <button
                  type="button"
                  onClick={() =>
                    setLightbox({
                      ...lightbox,
                      index:
                        (lightbox.index - 1 + lightbox.photos.length) %
                        lightbox.photos.length,
                    })
                  }
                >
                  ← Другой ракурс
                </button>
                <span>
                  {lightbox.index + 1} / {lightbox.photos.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLightbox({
                      ...lightbox,
                      index: (lightbox.index + 1) % lightbox.photos.length,
                    })
                  }
                >
                  Другой ракурс →
                </button>
              </div>
            ) : null}
            <p className="mt-4 text-center font-sans text-2xl font-semibold">{lightbox.name}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function openLightbox(
  item: Pick<HallItem, "name" | "photo" | "photoAlt">,
  setLightbox: (value: Lightbox) => void,
) {
  const photos = [item.photo, item.photoAlt].filter(Boolean) as string[];
  if (!photos.length) return;
  setLightbox({ name: item.name, photos, index: 0 });
}
