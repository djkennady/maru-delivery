"use client";

import Image from "next/image";
import { Clock, Smartphone } from "lucide-react";
import { formatPrice } from "@/lib/pricing";

interface SbpPaymentPanelProps {
  amount: number;
  qrDataUrl: string;
  expiresAt: string;
  onConfirm: () => void;
  confirming: boolean;
}

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function SbpPaymentPanel({
  amount,
  qrDataUrl,
  expiresAt,
  onConfirm,
  confirming,
}: SbpPaymentPanelProps) {
  return (
    <section className="space-y-4 rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-white">
            Оплата через СБП
          </h2>
          <p className="mt-1 text-sm text-white/45">
            Сумма: {formatPrice(amount)}
          </p>
        </div>
        <span className="rounded-full bg-[#7B2D8E]/25 px-3 py-1 text-xs font-bold text-[#e9d5ff]">
          СБП
        </span>
      </div>

      <div className="mx-auto flex max-w-[280px] flex-col items-center rounded-2xl border border-white/10 bg-white p-4">
        <Image
          src={qrDataUrl}
          alt="QR-код для оплаты через СБП"
          width={280}
          height={280}
          unoptimized
          className="h-auto w-full"
        />
      </div>

      <ol className="space-y-2 text-sm text-white/45">
        <li className="flex gap-2">
          <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-[#60a5fa]" />
          Откройте приложение банка и выберите «Оплата по QR» или «СБП»
        </li>
        <li className="flex gap-2">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#3b82f6]/20 text-[10px] font-bold text-[#93c5fd]">
            2
          </span>
          Отсканируйте QR-код и подтвердите платёж
        </li>
      </ol>

      <p className="flex items-center gap-2 text-xs text-white/40">
        <Clock className="h-3.5 w-3.5" />
        QR действует до {formatTime(expiresAt)}
      </p>

      <button
        type="button"
        onClick={onConfirm}
        disabled={confirming}
        className="w-full rounded-full bg-[#7B2D8E] px-5 py-3.5 font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {confirming ? "Проверяем оплату…" : "Я оплатил в банке"}
      </button>

      <p className="text-center text-[11px] text-white/35">
        Заказ создаётся только после подтверждённой оплаты
      </p>
    </section>
  );
}
