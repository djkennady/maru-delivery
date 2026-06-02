import type { ClaimedGift } from "@/lib/loyalty-gifts";

const GIFTS_KEY = "maru-loyalty-gifts";

type GiftsStore = Record<string, ClaimedGift[]>;

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

function createGiftId(): string {
  return `gift-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizeGift(gift: Partial<ClaimedGift>, index: number): ClaimedGift {
  return {
    id:
      gift.id ??
      `legacy-${gift.periodId ?? "unknown"}-${gift.milestone ?? 0}-${index}`,
    milestone: gift.milestone ?? 300,
    rewardId: gift.rewardId ?? "unknown",
    title: gift.title ?? "Подарок",
    description: gift.description ?? "",
    emoji: gift.emoji ?? "🎁",
    claimedAt: gift.claimedAt ?? new Date().toISOString(),
    periodId: gift.periodId ?? getLoyaltyPeriodId(),
    usedAt: gift.usedAt,
    usedInOrderId: gift.usedInOrderId,
  };
}

function loadStore(): GiftsStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(GIFTS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as GiftsStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveStore(store: GiftsStore) {
  localStorage.setItem(GIFTS_KEY, JSON.stringify(store));
}

export function getClaimedGifts(phone: string): ClaimedGift[] {
  const key = normalizePhone(phone);
  if (!key) return [];
  return (loadStore()[key] ?? []).map((gift, index) => normalizeGift(gift, index));
}

export function saveClaimedGift(phone: string, gift: ClaimedGift): ClaimedGift[] {
  const key = normalizePhone(phone);
  if (!key) return [];

  const store = loadStore();
  const existing = (store[key] ?? []).map(normalizeGift);
  const normalizedGift = normalizeGift({ ...gift, id: gift.id || createGiftId() }, 0);

  const next = [
    normalizedGift,
    ...existing.filter(
      (item) =>
        !(
          item.periodId === normalizedGift.periodId &&
          item.milestone === normalizedGift.milestone &&
          !item.usedAt
        ),
    ),
  ];
  store[key] = next;
  saveStore(store);
  return next;
}

export function markGiftUsed(
  phone: string,
  giftId: string,
  orderId: string,
): ClaimedGift[] {
  const key = normalizePhone(phone);
  if (!key) return [];

  const store = loadStore();
  const gifts = (store[key] ?? []).map(normalizeGift);
  store[key] = gifts.map((gift) =>
    gift.id === giftId && !gift.usedAt
      ? {
          ...gift,
          usedAt: new Date().toISOString(),
          usedInOrderId: orderId,
        }
      : gift,
  );
  saveStore(store);
  return store[key] ?? [];
}

export function getLoyaltyPeriodId(date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}-${month}`;
}

export function getActiveRewards(
  gifts: ClaimedGift[],
  periodId: string,
): ClaimedGift[] {
  return gifts.filter((gift) => gift.periodId === periodId && !gift.usedAt);
}

export function createClaimedGiftId(): string {
  return createGiftId();
}
