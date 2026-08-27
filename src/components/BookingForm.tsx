"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { Venue } from "@/types/venue";
import { CheckCircle2, Loader2 } from "lucide-react";

interface BookingFormProps {
  venue: Venue;
}

export function BookingForm({ venue }: BookingFormProps) {
  const t = useTranslations("booking");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = new FormData(e.currentTarget);
    const payload = {
      venueSlug: venue.slug,
      venueName: venue.brand.ru,
      name: form.get("name"),
      phone: form.get("phone"),
      date: form.get("date"),
      time: form.get("time"),
      guests: form.get("guests"),
      comment: form.get("comment"),
    };

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
        <h3 className="mt-3 text-lg font-semibold text-venue-text">
          {t("successTitle")}
        </h3>
        <p className="mt-2 text-sm text-venue-muted">{t("successText")}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-venue-accent underline"
        >
          {t("bookAgain")}
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-[var(--venue-surface-border)] bg-black/20 px-4 py-3 text-venue-text placeholder:text-venue-muted/50 outline-none focus:border-[var(--venue-accent)]";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-venue-muted">{t("subtitle")}</p>

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm text-venue-muted">
          {t("name")}
        </label>
        <input id="name" name="name" required className={inputClass} autoComplete="name" />
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm text-venue-muted">
          {t("phone")}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="+7"
          className={inputClass}
          autoComplete="tel"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="date" className="mb-1.5 block text-sm text-venue-muted">
            {t("date")}
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="time" className="mb-1.5 block text-sm text-venue-muted">
            {t("time")}
          </label>
          <input id="time" name="time" type="time" required className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="guests" className="mb-1.5 block text-sm text-venue-muted">
          {t("guests")}
        </label>
        <select id="guests" name="guests" required className={inputClass}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((n) => (
            <option key={n} value={n}>
              {t("guestsOption", { count: n })}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="comment" className="mb-1.5 block text-sm text-venue-muted">
          {t("comment")}
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={3}
          placeholder={t("commentPlaceholder")}
          className={inputClass}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400">{t("error")}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="venue-btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {t("submitting")}
          </>
        ) : (
          t("submit")
        )}
      </button>
    </form>
  );
}
