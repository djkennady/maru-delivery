"use client";

import { CreditCard, QrCode } from "lucide-react";
import type { PaymentMethod } from "@/types/user";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  disabled?: boolean;
}

const methods = [
  {
    id: "card" as const,
    label: "Картой",
    icon: CreditCard,
  },
  {
    id: "sbp" as const,
    label: "СБП",
    icon: QrCode,
  },
];

export function PaymentMethodSelector({
  value,
  onChange,
  disabled = false,
}: PaymentMethodSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {methods.map((method) => {
        const Icon = method.icon;
        const active = value === method.id;

        return (
          <button
            key={method.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(method.id)}
            className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition disabled:opacity-60 ${
              active
                ? method.id === "sbp"
                  ? "border-[#7B2D8E] bg-[#7B2D8E]/10 text-[#7B2D8E]"
                  : "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            <Icon className="h-4 w-4" />
            {method.label}
          </button>
        );
      })}
    </div>
  );
}
