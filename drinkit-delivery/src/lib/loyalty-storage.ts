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
  const { year, month } = getMoscowDateParts(date);
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function getLoyaltyDaysLeft(date = new Date()): number {
  const { year, month, day } = getMoscowDateParts(date);
  const daysInMonth = new Date(year, month, 0).getDate();
  return Math.max(1, daysInMonth - day + 1);
}

function getMoscowDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const pick = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");

  return {
    year: pick("year"),
    month: pick("month"),
    day: pick("day"),
  };
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
