"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Flame, Percent, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { useMenu } from "@/context/MenuContext";
import { heroPoster, heroThumbs, heroVideo } from "@/lib/media";

export function HeroBanner() {
  const { settings } = useMenu();
  const { estimatedMinutes } = settings;

  return (
    <section className="px-4 pb-3 pt-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-blue-500/10 ring-1 ring-white/10 md:min-h-[340px] lg:min-h-[380px]">
          <div className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={heroPoster}
              className="h-full w-full object-cover"
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/25" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/25 via-transparent to-orange-500/20" />
          </div>

          <div className="relative grid gap-6 px-5 pb-6 pt-5 text-white md:grid-cols-[1.2fr_0.8fr] md:items-end md:px-8 md:pb-8 md:pt-8">
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <BrandLogo size="lg" linked={false} variant="onDark" />
                <span className="animate-float inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-md md:hidden">
                  <Flame className="h-3.5 w-3.5 text-orange-300" />
                  Хиты дня
                </span>
              </div>

              <p className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/25 px-3 py-1 text-xs font-semibold text-blue-100 ring-1 ring-blue-300/30">
                <Sparkles className="h-3.5 w-3.5" />
                Самовывоз в Алабуге · кухня, кофе и атмосфера
              </p>

              <h1 className="mt-3 text-[2rem] font-black leading-[1.05] tracking-tight md:text-4xl lg:text-5xl">
                <span className="text-shimmer">Вкус, который</span>
                <br />
                хочется повторить
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
                Авторский кофе, домашняя еда и десерты — заберите горячим за{" "}
                {estimatedMinutes} минут. Не только меню: зал, бар и настроение
                кофейни МАРУ.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2 text-xs font-semibold backdrop-blur-md">
                  <Clock className="h-3.5 w-3.5" />
                  {estimatedMinutes} мин
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2 text-xs font-semibold backdrop-blur-md">
                  <Percent className="h-3.5 w-3.5" />
                  Скидка 10% при самовывозе
                </span>
                <Link
                  href="/menu"
                  className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-bold text-neutral-900 transition hover:bg-blue-100"
                >
                  Меню в зале
                </Link>
              </div>
            </div>

            <div className="hidden grid-cols-3 gap-2 md:grid">
              {heroThumbs.map((src) => (
                <div
                  key={src}
                  className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/15"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="180px"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="relative grid grid-cols-3 gap-1 border-t border-white/10 bg-black/20 p-1 backdrop-blur-md md:hidden">
            {heroThumbs.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="120px"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
