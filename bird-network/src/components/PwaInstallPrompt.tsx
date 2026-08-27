"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallPrompt() {
  const t = useTranslations("pwa");
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    setDeferredPrompt(null);
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-lg rounded-2xl border border-gold/30 bg-surface p-4 shadow-2xl sm:bottom-6">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-3 text-muted hover:text-white"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="pr-6 text-sm font-medium text-white">{t("install")}</p>
      <p className="mt-1 text-xs text-muted">{t("installHint")}</p>
      <button
        type="button"
        onClick={handleInstall}
        className="mt-3 flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-black"
      >
        <Download className="h-4 w-4" />
        {t("install")}
      </button>
    </div>
  );
}
