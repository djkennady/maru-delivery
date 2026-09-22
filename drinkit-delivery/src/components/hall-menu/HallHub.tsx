"use client";

import Image from "next/image";
import Link from "next/link";
import { HALL_PHOTO_ITEMS, PICKUP_SITE_URL } from "@/data/hall-menu";

const tiles = HALL_PHOTO_ITEMS.filter((_, index) =>
  [0, 3, 8, 16, 22, 28, 33].includes(index),
).slice(0, 6);

export function HallHub() {
  return (
    <div className="hall-theme relative z-10 min-h-screen bg-[#12110e] text-[#f6f1e8]">
      <section className="relative isolate overflow-hidden">
        <Image
          src="/hall-menu/dishes/0005.webp"
          alt=""
          fill
          priority
          className="hall-ken object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#12110e]/40 to-[#12110e]" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col px-5 pb-12 pt-6 sm:px-8">
          <div className="flex items-start justify-between">
            <div className="leading-none">
              <span className="font-brand text-[2.6rem] tracking-[-0.06em] text-white">
                МАРУ
              </span>
              <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.48em] text-white/70">
                кухня и кофе
              </span>
            </div>
            <span className="rounded-full border border-white/25 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-white/80">
              Алабуга
            </span>
          </div>
          <div className="mt-auto max-w-3xl hall-reveal">
            <p className="text-xs uppercase tracking-[0.28em] text-[#d9cfbe]">
              Один адрес · два сценария
            </p>
            <h1 className="font-serif mt-5 text-[clamp(3.2rem,9vw,6.8rem)] leading-[0.88] tracking-[-0.05em]">
              Выберите, как хотите МАРУ сегодня.
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-10 sm:grid-cols-2 sm:px-8">
        <Link
          href="/menu"
          className="group relative min-h-[340px] overflow-hidden rounded-[28px]"
        >
          <Image
            src={tiles[0]?.photo ?? "/hall-menu/og.png"}
            alt=""
            fill
            className="object-cover transition duration-700 group-hover:scale-110"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/10" />
          <span className="absolute inset-0 flex flex-col justify-end p-7">
            <span className="text-xs uppercase tracking-[0.22em] text-[#d9cfbe]">
              В зале
            </span>
            <span className="font-serif mt-2 text-4xl leading-none">Меню</span>
            <span className="mt-3 max-w-sm text-sm text-[#ddd4c5]">
              Завтраки, хоспер, пицца, роллы, десерты и кофе — с живыми
              фотографиями блюд.
            </span>
            <span className="mt-5 text-sm font-semibold text-[#f3ead8]">
              Открыть меню →
            </span>
          </span>
        </Link>
        <Link
          href={PICKUP_SITE_URL}
          className="group relative min-h-[340px] overflow-hidden rounded-[28px]"
        >
          <Image
            src={tiles[1]?.photo ?? "/hall-menu/dishes/0005.webp"}
            alt=""
            fill
            className="object-cover transition duration-700 group-hover:scale-110"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-[#12351f] via-black/30 to-black/20" />
          <span className="absolute inset-0 flex flex-col justify-end p-7">
            <span className="text-xs uppercase tracking-[0.22em] text-[#bbf7d0]">
              С собой
            </span>
            <span className="font-serif mt-2 text-4xl leading-none">
              Заказ −10%
            </span>
            <span className="mt-3 max-w-sm text-sm text-[#e7e5e4]">
              Самовывоз в Алабуге: кофе, еда и комбо. Скидка 10% уже в корзине.
            </span>
            <span className="mt-5 text-sm font-semibold text-white">
              Заказать онлайн →
            </span>
          </span>
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-serif text-3xl sm:text-4xl">Сейчас в зале</h2>
          <Link href="/menu" className="text-sm text-[#d9cfbe] underline-offset-4 hover:underline">
            Все блюда
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {tiles.map((item) => (
            <Link
              key={item.name}
              href="/menu"
              className="group overflow-hidden rounded-sm"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={item.photo!}
                  alt={item.name}
                  fill
                  sizes="33vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
              </div>
              <p className="mt-2 font-sans text-lg font-semibold leading-tight">{item.name}</p>
              <p className="text-sm text-[#cfc6b6]">{item.price}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
