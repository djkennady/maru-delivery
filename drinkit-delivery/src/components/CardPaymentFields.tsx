"use client";

import { CreditCard, Lock } from "lucide-react";
import {
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
} from "@/lib/card-payment";

export interface CardFormValues {
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardholder: string;
}

interface CardPaymentFieldsProps {
  values: CardFormValues;
  onChange: (values: CardFormValues) => void;
  disabled?: boolean;
}

export function CardPaymentFields({
  values,
  onChange,
  disabled = false,
}: CardPaymentFieldsProps) {
  const brand = detectCardBrand(values.cardNumber);

  return (
    <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-[var(--accent)]" />
          <h2 className="text-lg font-bold text-[var(--text)]">Оплата картой</h2>
        </div>
        <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--muted)]">
          {brand}
        </span>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-[var(--text)]">
          Номер карты
        </span>
        <input
          required
          inputMode="numeric"
          autoComplete="cc-number"
          disabled={disabled}
          value={values.cardNumber}
          onChange={(e) =>
            onChange({
              ...values,
              cardNumber: formatCardNumber(e.target.value),
            })
          }
          placeholder="0000 0000 0000 0000"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 font-mono text-[var(--text)] outline-none transition focus:border-[var(--accent)] disabled:opacity-60"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--text)]">
            Срок
          </span>
          <input
            required
            inputMode="numeric"
            autoComplete="cc-exp"
            disabled={disabled}
            value={values.expiry}
            onChange={(e) =>
              onChange({
                ...values,
                expiry: formatExpiry(e.target.value),
              })
            }
            placeholder="MM/YY"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 font-mono text-[var(--text)] outline-none transition focus:border-[var(--accent)] disabled:opacity-60"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--text)]">
            CVC
          </span>
          <input
            required
            inputMode="numeric"
            autoComplete="cc-csc"
            disabled={disabled}
            value={values.cvc}
            onChange={(e) =>
              onChange({
                ...values,
                cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
              })
            }
            placeholder="123"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 font-mono text-[var(--text)] outline-none transition focus:border-[var(--accent)] disabled:opacity-60"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-[var(--text)]">
          Имя на карте
        </span>
        <input
          required
          autoComplete="cc-name"
          disabled={disabled}
          value={values.cardholder}
          onChange={(e) =>
            onChange({
              ...values,
              cardholder: e.target.value.toUpperCase(),
            })
          }
          placeholder="IVAN IVANOV"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)] disabled:opacity-60"
        />
      </label>

      <p className="flex items-center gap-2 text-xs text-[var(--muted)]">
        <Lock className="h-3.5 w-3.5 shrink-0" />
        Данные карты не сохраняются. Для теста: 4242 4242 4242 4242
      </p>
    </section>
  );
}
