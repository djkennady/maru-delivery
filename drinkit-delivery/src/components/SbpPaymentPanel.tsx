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
    <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--text)]">Оплата через СБП</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Сумма: {formatPrice(amount)}
          </p>
        </div>
        <span className="rounded-full bg-[#7B2D8E]/10 px-3 py-1 text-xs font-bold text-[#7B2D8E]">
          СБП
        </span>
      </div>

      <div className="mx-auto flex max-w-[280px] flex-col items-center rounded-2xl border border-[var(--border)] bg-white p-4">
        <Image
          src={qrDataUrl}
          alt="QR-код для оплаты через СБП"
          width={280}
          height={280}
          unoptimized
          className="h-auto w-full"
        />
      </div>

      <ol className="space-y-2 text-sm text-[var(--muted)]">
        <li className="flex gap-2">
          <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
          Откройте приложение банка и выберите «Оплата по QR» или «СБП»
        </li>
        <li className="flex gap-2">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[10px] font-bold text-[var(--accent)]">
            2
          </span>
          Отсканируйте QR-код и подтвердите платёж
        </li>
      </ol>

      <p className="flex items-center gap-2 text-xs text-[var(--muted)]">
        <Clock className="h-3.5 w-3.5" />
        QR действует до {formatTime(expiresAt)}
      </p>

      <button
        type="button"
        onClick={onConfirm}
        disabled={confirming}
        className="w-full rounded-2xl bg-[#7B2D8E] px-5 py-3 font-semibold text-white transition hover:bg-[#692677] disabled:opacity-60"
      >
        {confirming ? "Проверяем оплату…" : "Я оплатил в банке"}
      </button>

      <p className="text-center text-[11px] text-[var(--muted)]">
        Заказ создастся автоматически после оплаты. Не закрывайте эту страницу.
      </p>
    </section>
  );
}
