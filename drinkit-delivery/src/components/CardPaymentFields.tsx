"use client";

import { CreditCard, Lock } from "lucide-react";

export function CardPaymentFields({ disabled = false }: { disabled?: boolean }) {
  return (
    <section className="space-y-4 rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-[#60a5fa]" />
        <h2 className="font-display text-lg font-semibold text-white">
          Оплата картой
        </h2>
      </div>

      <p className="text-sm text-white/45">
        Номер карты вводится на защищённой странице Альфа-Банка. Мы не видим и не
        сохраняем данные карты.
      </p>

      <p className="flex items-center gap-2 text-xs text-white/40">
        <Lock className="h-3.5 w-3.5 shrink-0" />
        После оплаты банк вернёт вас на эту страницу, и заказ сохранится
        автоматически.
      </p>

      {disabled ? (
        <p className="text-sm font-medium text-white/80">
          Переходим на страницу банка…
        </p>
      ) : null}
    </section>
  );
}
