"use client";

import Image from "next/image";
import { Clock, Flame, Sparkles, Truck } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { useMenu } from "@/context/MenuContext";
import { heroPoster, heroThumbs, heroVideo } from "@/lib/media";

export function HeroBanner() {
  const { settings } = useMenu();
  const { estimatedMinutes, freeDeliveryFrom } = settings;

  return (
    <section className="px-4 pb-2 pt-4">
      <div className="mx-auto max-w-lg">
        <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-orange-500/20">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-transparent to-emerald-500/25" />
          </div>

          <div className="relative px-5 pb-6 pt-5 text-white">
            <div className="mb-4 flex items-center justify-between gap-3">
              <BrandLogo size="lg" linked={false} variant="onDark" />
              <span className="animate-float inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
                <Flame className="h-3.5 w-3.5 text-orange-300" />
                Хиты дня
              </span>
            </div>

            <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/25 px-3 py-1 text-xs font-semibold text-emerald-100 ring-1 ring-emerald-300/30">
              <Sparkles className="h-3.5 w-3.5" />
              Свежая кухня и specialty-кофе
            </p>

            <h1 className="mt-3 text-[2rem] font-black leading-[1.05] tracking-tight">
              <span className="text-shimmer">Вкус, который</span>
              <br />
              хочется повторить
            </h1>

            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/85">
              Авторский кофе, домашняя еда и десерты — доставим горячим за{" "}
              {estimatedMinutes} минут
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2 text-xs font-semibold backdrop-blur-md">
                <Clock className="h-3.5 w-3.5" />
                {estimatedMinutes} мин
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2 text-xs font-semibold backdrop-blur-md">
                <Truck className="h-3.5 w-3.5" />
                Бесплатно от {freeDeliveryFrom} ₽
              </span>
            </div>
          </div>

          <div className="relative grid grid-cols-3 gap-1 border-t border-white/10 bg-black/20 p-1 backdrop-blur-md">
            {heroThumbs.map((src, i) => (
              <div
                key={src}
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
