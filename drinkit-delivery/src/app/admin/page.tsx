import Link from "next/link";
import { AdminPanel } from "@/components/AdminPanel";

export default function AdminPage() {
  return (
    <div className="min-h-full bg-[var(--bg)]">
      <header className="border-b border-[var(--border)] bg-[var(--bg)]/92 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              МАРУ
            </p>
            <p className="text-base font-bold text-[var(--text)]">Админ-панель</p>
          </div>
          <Link
            href="/"
            className="text-sm text-[var(--muted)] transition hover:text-[var(--text)]"
          >
            На сайт
          </Link>
        </div>
      </header>
      <AdminPanel />
    </div>
  );
}
