import type { OrderRecord } from "@/types/user";
import type { ClaimedGift } from "@/lib/loyalty-gifts";
import { getLoyaltyPeriodId } from "@/lib/loyalty-storage";

export const LOYALTY_MILESTONES = [300, 900, 2000] as const;

export type LoyaltyMilestoneAmount = (typeof LOYALTY_MILESTONES)[number];

export type MilestoneVisualStatus = "locked" | "current" | "ready" | "opened";

export interface LoyaltyMilestone {
  amount: LoyaltyMilestoneAmount;
  status: MilestoneVisualStatus;
  claim?: ClaimedGift;
}

export interface LoyaltyProgress {
  spent: number;
  daysLeft: number;
  nextMilestone: number;
  remaining: number;
  fillPercent: number;
  milestones: LoyaltyMilestone[];
  allCompleted: boolean;
  periodId: string;
  unclaimedMilestones: LoyaltyMilestoneAmount[];
  activeRewards: ClaimedGift[];
}

export function getPaidOrders(orders: OrderRecord[]): OrderRecord[] {
  return orders.filter(
    (order) =>
      order.paymentStatus === "paid" && order.status !== "cancelled",
  );
}

function getBarFillPercent(
  spent: number,
  milestones: readonly number[],
): number {
  const [m1, m2, m3] = milestones;
  const segment = 100 / 3;

  if (spent >= m3) return 100;
  if (spent <= m1) return (spent / m1) * segment;
  if (spent <= m2) return segment + ((spent - m1) / (m2 - m1)) * segment;
  return segment * 2 + ((spent - m2) / (m3 - m2)) * segment;
}

export function getLoyaltyProgress(
  orders: OrderRecord[],
  claimedGifts: ClaimedGift[] = [],
  periodId = getLoyaltyPeriodId(),
): LoyaltyProgress {
  const now = new Date();
  const periodStart = new Date(now);
  periodStart.setDate(periodStart.getDate() - 30);

  const spent = getPaidOrders(orders)
    .filter((order) => new Date(order.createdAt) >= periodStart)
    .reduce((sum, order) => sum + order.total, 0);

  const milestones = LOYALTY_MILESTONES;
  const periodClaims = claimedGifts.filter((gift) => gift.periodId === periodId);
  const claimsByMilestone = new Map(
    periodClaims.map((gift) => [gift.milestone, gift]),
  );

  const unclaimedMilestones: LoyaltyMilestoneAmount[] = [];

  const milestoneStates: LoyaltyMilestone[] = milestones.map((amount, index) => {
    const claim = claimsByMilestone.get(amount);

    if (claim) {
      return { amount, status: "opened", claim };
    }

    if (spent >= amount) {
      unclaimedMilestones.push(amount);
      return { amount, status: "ready" };
    }

    const previous = milestones[index - 1] ?? 0;
    if (spent >= previous) {
      return { amount, status: "current" };
    }

    return { amount, status: "locked" };
  });

  const nextUnclaimed = unclaimedMilestones[0];
  const nextLocked = milestones.find((amount) => spent < amount);
  const nextMilestone = nextUnclaimed ?? nextLocked ?? milestones[milestones.length - 1];
  const remaining = nextUnclaimed ? 0 : Math.max(0, (nextLocked ?? nextMilestone) - spent);
  const allOpened = milestones.every((amount) => claimsByMilestone.has(amount));
  const allReached = spent >= milestones[milestones.length - 1];

  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
  );
  const daysLeft = Math.max(
    1,
    Math.ceil((endOfMonth.getTime() - now.getTime()) / 86_400_000),
  );

  return {
    spent,
    daysLeft,
    nextMilestone,
    remaining,
    fillPercent: getBarFillPercent(spent, milestones),
    milestones: milestoneStates,
    allCompleted: allReached && allOpened,
    periodId,
    unclaimedMilestones,
    activeRewards: periodClaims.filter((gift) => !gift.usedAt),
  };
}

export function getFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || "друг";
}
