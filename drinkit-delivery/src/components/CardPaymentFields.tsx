"use client";

import { CreditCard, Lock } from "lucide-react";

export function CardPaymentFields({ disabled = false }: { disabled?: boolean }) {
  return (
    <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-[var(--accent)]" />
        <h2 className="text-lg font-bold text-[var(--text)]">Оплата картой</h2>
      </div>

      <p className="text-sm text-[var(--muted)]">
        Номер карты вводится на защищённой странице Альфа-Банка. Мы не видим и не
        сохраняем данные карты.
      </p>

      <p className="flex items-center gap-2 text-xs text-[var(--muted)]">
        <Lock className="h-3.5 w-3.5 shrink-0" />
        После оплаты банк вернёт вас на эту страницу, и заказ сохранится
        автоматически.
      </p>

      {disabled ? (
        <p className="text-sm font-medium text-[var(--text)]">
          Переходим на страницу банка…
        </p>
      ) : null}
    </section>
  );
}
