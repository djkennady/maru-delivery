"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LoyaltyGiftOption, LoyaltyMilestoneAmount, ClaimedGift } from "@/lib/loyalty-gifts";
import {
  createClaimedGiftId,
  getActiveRewards,
  getClaimedGifts,
  getLoyaltyPeriodId,
  markGiftUsed,
  saveClaimedGift,
} from "@/lib/loyalty-storage";
import type { OrderRecord, UserProfile } from "@/types/user";

const PROFILE_KEY = "maru-profile";

interface UserContextValue {
  profile: UserProfile;
  orders: OrderRecord[];
  claimedGifts: ClaimedGift[];
  loyaltyPeriodId: string;
  hasProfile: boolean;
  ordersLoading: boolean;
  updateProfile: (data: Partial<UserProfile>) => void;
  refreshOrders: () => Promise<void>;
  prependOrder: (order: OrderRecord) => void;
  claimGift: (
    milestone: LoyaltyMilestoneAmount,
    reward: LoyaltyGiftOption,
  ) => void;
  useGift: (giftId: string, orderId: string) => void;
  availableGifts: ClaimedGift[];
}

const UserContext = createContext<UserContextValue | null>(null);

const emptyProfile: UserProfile = {
  name: "",
  phone: "",
  address: "",
};

function loadProfile(): UserProfile {
  if (typeof window === "undefined") return emptyProfile;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return emptyProfile;
    const parsed = JSON.parse(raw) as UserProfile;
    return { ...emptyProfile, ...parsed };
  } catch {
    return emptyProfile;
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [claimedGifts, setClaimedGifts] = useState<ClaimedGift[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const loyaltyPeriodId = getLoyaltyPeriodId();

  useEffect(() => {
    const loadedProfile = loadProfile();
    setProfile(loadedProfile);
    setClaimedGifts(getClaimedGifts(loadedProfile.phone));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    setClaimedGifts(getClaimedGifts(profile.phone));
  }, [profile, hydrated]);

  const refreshOrders = useCallback(async () => {
    if (!profile.phone.trim()) {
      setOrders([]);
      return;
    }

    setOrdersLoading(true);
    try {
      const res = await fetch(
        `/api/order?phone=${encodeURIComponent(profile.phone)}`,
      );
      if (!res.ok) return;
      const data = (await res.json()) as { orders: OrderRecord[] };
      setOrders(data.orders);
    } finally {
      setOrdersLoading(false);
    }
  }, [profile.phone]);

  useEffect(() => {
    if (!hydrated) return;
    void refreshOrders();
  }, [hydrated, refreshOrders]);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
  }, []);

  const prependOrder = useCallback((order: OrderRecord) => {
    setOrders((prev) => [order, ...prev.filter((item) => item.id !== order.id)]);
    setProfile((prev) => ({
      name: order.name,
      phone: order.phone,
      address: order.address,
    }));
  }, []);

  const claimGift = useCallback(
    (milestone: LoyaltyMilestoneAmount, reward: LoyaltyGiftOption) => {
      if (!profile.phone.trim()) return;

      const gift: ClaimedGift = {
        id: createClaimedGiftId(),
        milestone,
        rewardId: reward.id,
        title: reward.title,
        description: reward.description,
        emoji: reward.emoji,
        claimedAt: new Date().toISOString(),
        periodId: loyaltyPeriodId,
      };

      setClaimedGifts(saveClaimedGift(profile.phone, gift));
    },
    [profile.phone, loyaltyPeriodId],
  );

  const useGift = useCallback(
    (giftId: string, orderId: string) => {
      if (!profile.phone.trim()) return;
      setClaimedGifts(markGiftUsed(profile.phone, giftId, orderId));
    },
    [profile.phone],
  );

  const availableGifts = useMemo(
    () => getActiveRewards(claimedGifts, loyaltyPeriodId),
    [claimedGifts, loyaltyPeriodId],
  );

  const hasProfile = Boolean(profile.name.trim() && profile.phone.trim());

  const value = useMemo(
    () => ({
      profile,
      orders,
      claimedGifts,
      loyaltyPeriodId,
      hasProfile,
      ordersLoading,
      updateProfile,
      refreshOrders,
      prependOrder,
      claimGift,
      useGift,
      availableGifts,
    }),
    [
      profile,
      orders,
      claimedGifts,
      loyaltyPeriodId,
      hasProfile,
      ordersLoading,
      updateProfile,
      refreshOrders,
      prependOrder,
      claimGift,
      useGift,
      availableGifts,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
