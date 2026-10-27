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
            className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 text-sm font-semibold transition disabled:opacity-60 ${
              active
                ? method.id === "sbp"
                  ? "border-[#a855f7]/50 bg-[#7B2D8E]/25 text-[#e9d5ff]"
                  : "border-[#3b82f6]/50 bg-[#3b82f6]/20 text-[#93c5fd]"
                : "border-white/10 bg-white/[0.04] text-white/45 hover:text-white/80"
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
