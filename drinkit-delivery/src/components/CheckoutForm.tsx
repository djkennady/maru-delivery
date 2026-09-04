"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CardPaymentFields } from "@/components/CardPaymentFields";
import { GiftSelector } from "@/components/GiftSelector";
import { PaymentMethodSelector } from "@/components/PaymentMethodSelector";
import { SbpPaymentPanel } from "@/components/SbpPaymentPanel";
import { useCart } from "@/context/CartContext";
import { useMenu } from "@/context/MenuContext";
import { useUser } from "@/context/UserContext";
import {
  buildGiftBonusItem,
  calculateGiftDiscount,
  calculateOrderTotal,
} from "@/lib/gift-discount";
import { getProductImage } from "@/lib/media";
import { formatPrice } from "@/lib/pricing";
import type { CartItem } from "@/types/menu";
import type { AppliedGift, OrderRecord, PaymentMethod } from "@/types/user";

const MILK_LABELS = {
  regular: "Обычное",
  oat: "Овсяное",
  almond: "Миндальное",
  none: "Без молока",
} as const;

const CARD_DRAFT_KEY = "maru-card-checkout";

type CardCheckoutDraft = {
  paymentId: string;
  name: string;
  phone: string;
  address: string;
  comment?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  giftDiscount?: number;
  appliedGift?: AppliedGift;
  total: number;
  selectedGiftId?: string | null;
};

function CartLineItem({
  item,
  onUpdate,
  onRemove,
  isGiftBonus = false,
}: {
  item: CartItem;
  onUpdate?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  isGiftBonus?: boolean;
}) {
  const { getProduct } = useMenu();
  const product = getProduct(item.productId);
  const sizeLabel = item.options?.size?.toUpperCase() ?? "";
  const milkLabel =
    product?.customizable && item.options?.milk
      ? MILK_LABELS[item.options.milk]
      : null;

  return (
    <article
      className={`flex gap-3 overflow-hidden rounded-2xl border bg-[var(--card)] shadow-sm ${
        isGiftBonus
          ? "border-[var(--accent)]/30 ring-1 ring-[var(--accent)]/20"
          : "border-[var(--border)]"
      }`}
    >
      <div className="relative aspect-square w-24 shrink-0 sm:w-28">
        <Image
          src={getProductImage(item.productId, product?.imageUrl)}
          alt={product?.name ?? item.productId}
          fill
          className="object-cover"
          sizes="112px"
        />
      </div>
      <div className="min-w-0 flex-1 py-3 pr-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-[var(--text)]">
                {product?.name ?? item.productId}
              </h3>
              {isGiftBonus && (
                <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--accent)]">
                  Подарок
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-[var(--muted)]">
              {sizeLabel}
              {milkLabel ? ` · ${milkLabel}` : ""}
            </p>
          </div>
          {!isGiftBonus && onRemove && (
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="shrink-0 rounded-lg p-1.5 text-[var(--muted)] transition hover:bg-red-50 hover:text-red-500"
              aria-label="Удалить"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between">
          {isGiftBonus ? (
            <span className="text-xs text-[var(--muted)]">Добавится к заказу</span>
          ) : (
            <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5">
              <button
                type="button"
                onClick={() => onUpdate?.(item.id, item.quantity - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-[var(--border)]"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-5 text-center text-sm font-semibold">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdate?.(item.id, item.quantity + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-[var(--border)]"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <span
            className={`font-bold ${
              isGiftBonus ? "text-[var(--accent)]" : "text-[var(--text)]"
            }`}
          >
            {isGiftBonus || item.unitPrice === 0
              ? "Бесплатно"
              : formatPrice(item.unitPrice * item.quantity)}
          </span>
        </div>
      </div>
    </article>
  );
}

export function CheckoutForm() {
  const {
    items,
    subtotal,
    deliveryFee: cartDeliveryFee,
    isFreeDelivery,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const { profile, prependOrder, updateProfile, availableGifts, useGift } =
    useUser();
  const { getProduct } = useMenu();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [sbpSession, setSbpSession] = useState<{
    paymentId: string;
    qrDataUrl: string;
    expiresAt: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successGiftTitle, setSuccessGiftTitle] = useState<string | null>(null);
  const [error, setError] = useState("");
  const placingSbpOrder = useRef(false);
  const placingCardOrder = useRef(false);
  const [resumingCard] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).has("cardSession");
  });

  useEffect(() => {
    if (profile.name) setName(profile.name);
    if (profile.phone) setPhone(profile.phone);
    if (profile.address) setAddress(profile.address);
  }, [profile.name, profile.phone, profile.address]);

  useEffect(() => {
    if (!selectedGiftId) return;
    if (!availableGifts.some((gift) => gift.id === selectedGiftId)) {
      setSelectedGiftId(null);
    }
  }, [availableGifts, selectedGiftId]);

  const selectedGift =
    availableGifts.find((gift) => gift.id === selectedGiftId) ?? null;
  const giftEffect = selectedGift
    ? calculateGiftDiscount(
        selectedGift,
        subtotal,
        cartDeliveryFee,
        isFreeDelivery,
        getProduct,
      )
    : null;
  const bonusItem =
    selectedGift && giftEffect?.bonusProductId
      ? buildGiftBonusItem(selectedGift, getProduct)
      : null;
  const deliveryFee = giftEffect?.deliveryFee ?? cartDeliveryFee;
  const giftDiscount = giftEffect?.discount ?? 0;
  const total = calculateOrderTotal(subtotal, deliveryFee, giftDiscount);
  const orderItems = bonusItem ? [...items, bonusItem] : items;

  const placeOrder = async (payment: {
    paymentId: string;
    paymentMethod: PaymentMethod;
    cardLast4: string;
    cardBrand: string;
  }) => {
    const appliedGift: AppliedGift | undefined = selectedGift
      ? {
          id: selectedGift.id,
          title: selectedGift.title,
          emoji: selectedGift.emoji,
          discount: giftDiscount,
          bonusProductId: giftEffect?.bonusProductId,
          bonusProductName: giftEffect?.bonusProductName,
        }
      : undefined;

    const orderComment = [comment.trim(), giftEffect?.orderNote]
      .filter(Boolean)
      .join("\n");

    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        address,
        comment: orderComment || undefined,
        items: orderItems,
        subtotal,
        deliveryFee,
        giftDiscount: giftDiscount || undefined,
        appliedGift,
        total,
        ...payment,
      }),
    });

    const data = (await res.json()) as { order?: OrderRecord; error?: string };
    if (!res.ok) {
      throw new Error(data.error ?? "Не удалось сохранить заказ");
    }
    if (!data.order) {
      throw new Error("Не удалось сохранить заказ");
    }
    if (selectedGift) {
      useGift(selectedGift.id, data.order.id);
    }
    prependOrder(data.order);
    updateProfile({ name, phone, address });
    clearCart();
    setSuccessGiftTitle(selectedGift?.title ?? null);
    setSelectedGiftId(null);
    setSuccess(true);
  };

  const placeCardOrderFromDraft = async (draft: CardCheckoutDraft) => {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: draft.name,
        phone: draft.phone,
        address: draft.address,
        comment: draft.comment,
        items: draft.items,
        subtotal: draft.subtotal,
        deliveryFee: draft.deliveryFee,
        giftDiscount: draft.giftDiscount,
        appliedGift: draft.appliedGift,
        total: draft.total,
        paymentId: draft.paymentId,
        paymentMethod: "card",
        cardLast4: "----",
        cardBrand: "Карта",
      }),
    });

    const data = (await res.json()) as { order?: OrderRecord; error?: string };
    if (!res.ok) {
      throw new Error(data.error ?? "Не удалось сохранить заказ");
    }
    if (!data.order) {
      throw new Error("Не удалось сохранить заказ");
    }
    if (draft.appliedGift) {
      useGift(draft.appliedGift.id, data.order.id);
    }
    prependOrder(data.order);
    updateProfile({
      name: draft.name,
      phone: draft.phone,
      address: draft.address,
    });
    clearCart();
    setSuccessGiftTitle(draft.appliedGift?.title ?? null);
    setSelectedGiftId(null);
    sessionStorage.removeItem(CARD_DRAFT_KEY);
    setSuccess(true);
    window.history.replaceState({}, "", "/checkout");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (paymentMethod === "card") {
        const paymentRes = await fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            phone,
            pageView: window.innerWidth < 768 ? "MOBILE" : "DESKTOP",
          }),
        });

        const paymentData = await paymentRes.json();

        if (!paymentRes.ok) {
          setError(paymentData.error ?? "Не удалось открыть оплату картой");
          return;
        }

        const draft: CardCheckoutDraft = {
          paymentId: paymentData.paymentId,
          name,
          phone,
          address,
          comment: comment.trim() || undefined,
          items: orderItems,
          subtotal,
          deliveryFee,
          giftDiscount: giftDiscount || undefined,
          appliedGift: selectedGift
            ? {
                id: selectedGift.id,
                title: selectedGift.title,
                emoji: selectedGift.emoji,
                discount: giftDiscount,
                bonusProductId: giftEffect?.bonusProductId,
                bonusProductName: giftEffect?.bonusProductName,
              }
            : undefined,
          total,
          selectedGiftId,
        };
        sessionStorage.setItem(CARD_DRAFT_KEY, JSON.stringify(draft));
        window.location.assign(paymentData.paymentUrl as string);
        return;
      }

      if (!sbpSession) {
        const sbpRes = await fetch("/api/payment/sbp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total, phone }),
        });

        const sbpData = await sbpRes.json();

        if (!sbpRes.ok) {
          setError(sbpData.error ?? "Не удалось создать QR для СБП");
          return;
        }

        setSbpSession({
          paymentId: sbpData.session.id,
          qrDataUrl: sbpData.qrDataUrl,
          expiresAt: sbpData.session.expiresAt,
        });
        return;
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Не удалось оформить заказ. Попробуйте ещё раз.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSbpConfirm = async () => {
    if (!sbpSession || placingSbpOrder.current) return;

    placingSbpOrder.current = true;
    setError("");
    setSubmitting(true);

    try {
      const confirmRes = await fetch("/api/payment/sbp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "confirm",
          paymentId: sbpSession.paymentId,
        }),
      });

      const confirmData = await confirmRes.json();

      if (!confirmRes.ok) {
        placingSbpOrder.current = false;
        setError(confirmData.error ?? "Оплата через СБП не подтверждена");
        return;
      }

      await placeOrder({
        paymentId: sbpSession.paymentId,
        paymentMethod: "sbp",
        cardLast4: "----",
        cardBrand: "СБП",
      });
    } catch (error) {
      placingSbpOrder.current = false;
      setError(
        error instanceof Error
          ? error.message
          : "Не удалось оформить заказ. Попробуйте ещё раз.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!sbpSession || success) return;

    const poll = async () => {
      if (placingSbpOrder.current) return;
      try {
        const res = await fetch(
          `/api/payment/sbp?paymentId=${encodeURIComponent(sbpSession.paymentId)}`,
          { cache: "no-store" },
        );
        const data = (await res.json()) as {
          session?: { status?: string };
          error?: string;
        };
        if (!res.ok) return;
        if (data.session?.status === "paid") {
          await handleSbpConfirm();
        }
        if (data.session?.status === "expired") {
          setError("Срок оплаты по QR истёк или платёж отклонён. Создайте новый.");
          setSbpSession(null);
        }
      } catch {
        /* next poll */
      }
    };

    const timer = window.setInterval(poll, 3000);
    void poll();
    return () => window.clearInterval(timer);
    // handleSbpConfirm is recreated each render; paymentId is the stable key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sbpSession?.paymentId, success]);

  useEffect(() => {
    if (success || placingCardOrder.current) return;
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("cardSession");
    if (!sessionId) return;

    if (params.get("failed") === "1") {
      setError("Оплата картой не прошла. Можно выбрать другой способ или попробовать снова.");
      sessionStorage.removeItem(CARD_DRAFT_KEY);
      window.history.replaceState({}, "", "/checkout");
      return;
    }

    placingCardOrder.current = true;
    setSubmitting(true);
    setError("");

    const waitForPaid = async () => {
      for (let attempt = 0; attempt < 12; attempt += 1) {
        const confirmRes = await fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "confirm", paymentId: sessionId }),
        });
        const confirmData = await confirmRes.json();
        if (confirmRes.status === 410) {
          throw new Error(
            confirmData.error ?? "Оплата картой не прошла. Попробуйте ещё раз.",
          );
        }
        if (confirmRes.ok && confirmData.session?.status === "paid") {
          const raw = sessionStorage.getItem(CARD_DRAFT_KEY);
          if (!raw) {
            throw new Error(
              "Оплата прошла, но данные заказа не найдены. Напишите нам, мы проверим платёж.",
            );
          }
          const draft = JSON.parse(raw) as CardCheckoutDraft;
          await placeCardOrderFromDraft({ ...draft, paymentId: sessionId });
          return;
        }
        await new Promise((resolve) => window.setTimeout(resolve, 2000));
      }
      throw new Error(
        "Банк ещё не подтвердил оплату. Обновите страницу через минуту или напишите нам.",
      );
    };

    void waitForPaid()
      .catch((error: unknown) => {
        placingCardOrder.current = false;
        setError(
          error instanceof Error
            ? error.message
            : "Не удалось завершить оплату картой.",
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
    // placeCardOrderFromDraft is recreated each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  if (items.length === 0 && !success && !resumingCard) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-5xl">🛍️</p>
        <h2 className="mt-4 text-xl font-bold text-[var(--text)]">
          Корзина пуста
        </h2>
        <p className="mt-2 text-[var(--muted)]">
          Добавьте напитки или еду из меню
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-2xl bg-[var(--accent)] px-6 py-3 font-semibold text-white transition hover:bg-emerald-600"
        >
          К меню
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-5xl">✅</p>
        <h2 className="mt-4 text-xl font-bold text-[var(--text)]">
          Заказ принят!
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Оплата прошла успешно. Курьер уже готовится к выезду.
          {successGiftTitle && ` Подарок «${successGiftTitle}» применён и списан.`}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/account"
            className="inline-block rounded-2xl bg-[var(--accent)] px-6 py-3 font-semibold text-white transition hover:bg-emerald-600"
          >
            Личный кабинет
          </Link>
          <Link
            href="/"
            className="inline-block rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 py-3 font-semibold text-[var(--text)] transition hover:border-[var(--accent)]"
          >
            Заказать ещё
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-5 pb-10">
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[var(--text)]">Ваш заказ</h2>
        {items.map((item) => (
          <CartLineItem
            key={item.id}
            item={item}
            onUpdate={updateQuantity}
            onRemove={removeItem}
          />
        ))}
        {bonusItem && (
          <CartLineItem item={bonusItem} isGiftBonus />
        )}
      </section>

      <GiftSelector
        gifts={availableGifts}
        selectedGiftId={selectedGiftId}
        onSelect={setSelectedGiftId}
        subtotal={subtotal}
        baseDeliveryFee={cartDeliveryFee}
        isFreeDelivery={isFreeDelivery}
        getProduct={getProduct}
      />

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-[var(--muted)]">
            <span>Сумма</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {bonusItem && (
            <div className="flex justify-between text-[var(--accent)]">
              <span>Подарок в заказе</span>
              <span>Бесплатно</span>
            </div>
          )}
          {giftDiscount > 0 && (
            <div className="flex justify-between text-[var(--accent-warm)]">
              <span>Подарок</span>
              <span>−{formatPrice(giftDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between text-[var(--muted)]">
            <span>Доставка</span>
            <span>{deliveryFee === 0 ? "Бесплатно" : formatPrice(deliveryFee)}</span>
          </div>
          <div className="flex justify-between border-t border-[var(--border)] pt-2 text-base font-bold text-[var(--text)]">
            <span>Итого</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--text)]">Доставка</h2>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--text)]">
            Имя
          </span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--text)]">
            Телефон
          </span>
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--text)]">
            Адрес
          </span>
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Улица, дом, квартира, подъезд"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--text)]">
            Комментарий
          </span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Домофон, этаж, пожелания…"
            className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
          />
        </label>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text)]">Способ оплаты</h2>
          <PaymentMethodSelector
            value={paymentMethod}
            onChange={(method) => {
              setPaymentMethod(method);
              setSbpSession(null);
            }}
            disabled={submitting}
          />
        </div>

        {paymentMethod === "card" ? (
          <CardPaymentFields disabled={submitting} />
        ) : sbpSession ? (
          <SbpPaymentPanel
            amount={total}
            qrDataUrl={sbpSession.qrDataUrl}
            expiresAt={sbpSession.expiresAt}
            onConfirm={handleSbpConfirm}
            confirming={submitting}
          />
        ) : (
          <section className="rounded-2xl border border-dashed border-[#7B2D8E]/30 bg-[#7B2D8E]/5 p-4 text-sm text-[var(--muted)]">
            После нажатия «Получить QR» откроется код для оплаты через приложение
            банка по СБП.
          </section>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {!sbpSession || paymentMethod === "card" ? (
          <button
            type="submit"
            disabled={submitting}
            className={`flex w-full items-center justify-center rounded-2xl px-5 py-4 font-semibold text-white shadow-lg transition disabled:opacity-60 ${
              paymentMethod === "sbp"
                ? "bg-[#7B2D8E] shadow-purple-500/20 hover:bg-[#692677]"
                : "bg-[var(--accent)] shadow-emerald-500/25 hover:bg-emerald-600"
            }`}
          >
            {submitting
              ? "Обработка…"
              : paymentMethod === "sbp"
                ? `Получить QR · ${formatPrice(total)}`
                : `Оплатить картой · ${formatPrice(total)}`}
          </button>
        ) : null}
      </form>
    </div>
  );
}
