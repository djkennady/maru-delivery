import { promises as fs } from "fs";
import path from "path";
import {
  getSupabaseServerClient,
  isSupabaseEnabled,
} from "@/lib/supabase-server";
import { dataFile } from "@/lib/data-file";
import type { PaymentOrderDraft } from "@/types/user";

function draftsFile(): string {
  return dataFile("payment-drafts.json");
}
const STATE_PREFIX = "payment_draft:";

function isDraft(value: unknown): value is PaymentOrderDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as PaymentOrderDraft;
  return Boolean(
    draft.name &&
      draft.phone &&
      draft.address &&
      Array.isArray(draft.items) &&
      draft.items.length > 0 &&
      typeof draft.total === "number" &&
      (draft.paymentMethod === "card" || draft.paymentMethod === "sbp"),
  );
}

export function normalizePaymentOrderDraft(
  value: unknown,
): PaymentOrderDraft | null {
  return isDraft(value) ? value : null;
}

async function readFileDrafts(): Promise<Record<string, PaymentOrderDraft>> {
  try {
    const raw = await fs.readFile(draftsFile(), "utf-8");
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return {};
    const drafts: Record<string, PaymentOrderDraft> = {};
    for (const [id, value] of Object.entries(parsed)) {
      const draft = normalizePaymentOrderDraft(value);
      if (draft) drafts[id] = draft;
    }
    return drafts;
  } catch {
    return {};
  }
}

export async function savePaymentOrderDraftIfAbsent(
  paymentId: string,
  draft: PaymentOrderDraft,
): Promise<PaymentOrderDraft> {
  const existing = await getPaymentOrderDraft(paymentId);
  if (existing) return existing;
  await savePaymentOrderDraft(paymentId, draft);
  return draft;
}

export async function savePaymentOrderDraft(
  paymentId: string,
  draft: PaymentOrderDraft,
): Promise<void> {
  if (!paymentId) {
    throw new Error("Payment draft requires paymentId");
  }
  if (!isDraft(draft)) {
    throw new Error("Invalid checkout draft");
  }

  const existing = await getPaymentOrderDraft(paymentId);
  if (existing) return;

  if (isSupabaseEnabled()) {
    const supabase = getSupabaseServerClient();
    if (!supabase) return;
    const { error } = await supabase.from("app_state").insert({
      key: `${STATE_PREFIX}${paymentId}`,
      value: draft,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      if (error.code === "23505") return;
      throw new Error(`Payment draft save failed: ${error.message}`);
    }
    return;
  }

  const dir = path.dirname(draftsFile());
  await fs.mkdir(dir, { recursive: true });
  const drafts = await readFileDrafts();
  if (drafts[paymentId]) return;
  drafts[paymentId] = draft;
  await fs.writeFile(draftsFile(), JSON.stringify(drafts, null, 2), "utf-8");
}

export async function getPaymentOrderDraft(
  paymentId: string,
): Promise<PaymentOrderDraft | null> {
  if (!paymentId) return null;

  if (isSupabaseEnabled()) {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("app_state")
      .select("value")
      .eq("key", `${STATE_PREFIX}${paymentId}`)
      .maybeSingle();
    if (error) {
      console.error("[payment-draft] read", error.message);
      return null;
    }
    return normalizePaymentOrderDraft(data?.value);
  }

  const drafts = await readFileDrafts();
  return drafts[paymentId] ?? null;
}
