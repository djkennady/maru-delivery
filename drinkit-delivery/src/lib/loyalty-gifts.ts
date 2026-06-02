export type LoyaltyMilestoneAmount = 300 | 900 | 2000;

export interface LoyaltyGiftOption {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export interface ClaimedGift {
  id: string;
  milestone: LoyaltyMilestoneAmount;
  rewardId: string;
  title: string;
  description: string;
  emoji: string;
  claimedAt: string;
  periodId: string;
  usedAt?: string;
  usedInOrderId?: string;
}

export const LOYALTY_GIFT_OPTIONS: Record<
  LoyaltyMilestoneAmount,
  LoyaltyGiftOption[]
> = {
  300: [
    {
      id: "cookie",
      title: "Печенье в подарок",
      description: "Добавим к следующему заказу бесплатно",
      emoji: "🍪",
    },
    {
      id: "syrup",
      title: "Сироп на выбор",
      description: "Ваниль, карамель или лесной орех — бесплатно",
      emoji: "🍯",
    },
    {
      id: "discount-10",
      title: "−10% на заказ",
      description: "Скидка на следующую доставку",
      emoji: "✨",
    },
  ],
  900: [
    {
      id: "croissant",
      title: "Круассан в подарок",
      description: "Сливочный, свежий — к любому напитку",
      emoji: "🥐",
    },
    {
      id: "delivery-free",
      title: "Бесплатная доставка",
      description: "Один заказ без платы за доставку",
      emoji: "🚀",
    },
    {
      id: "discount-15",
      title: "−15% на заказ",
      description: "На всё меню в следующем заказе",
      emoji: "🎁",
    },
  ],
  2000: [
    {
      id: "dessert",
      title: "Десерт на выбор",
      description: "Чизкейк, брауни или печенье — бесплатно",
      emoji: "🍰",
    },
    {
      id: "coffee-premium",
      title: "Premium-напиток",
      description: "Раф, матча или флэт уайт — в подарок",
      emoji: "☕",
    },
    {
      id: "discount-20",
      title: "−20% на заказ",
      description: "Большая скидка на следующий заказ",
      emoji: "💫",
    },
  ],
};
