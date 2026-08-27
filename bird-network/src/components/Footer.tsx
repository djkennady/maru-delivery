import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 py-8">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted">
        <p className="font-medium text-white/70">{t("network")}</p>
        <p className="mt-1">{t("rights", { year })}</p>
      </div>
    </footer>
  );
}
