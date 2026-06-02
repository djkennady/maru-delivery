export interface CardPaymentInput {
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardholder: string;
}

export interface CardPaymentResult {
  ok: boolean;
  paymentId?: string;
  cardLast4?: string;
  cardBrand?: string;
  error?: string;
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatCardNumber(value: string): string {
  const digits = digitsOnly(value).slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatExpiry(value: string): string {
  const digits = digitsOnly(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function detectCardBrand(cardNumber: string): string {
  const digits = digitsOnly(cardNumber);
  if (digits.startsWith("4")) return "Visa";
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "Mastercard";
  if (/^220[0-4]/.test(digits)) return "Mir";
  return "Card";
}

function luhnCheck(cardNumber: string): boolean {
  const digits = digitsOnly(cardNumber);
  if (digits.length < 16) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

function isExpiryValid(expiry: string): boolean {
  const digits = digitsOnly(expiry);
  if (digits.length !== 4) return false;

  const month = Number(digits.slice(0, 2));
  const year = Number(`20${digits.slice(2, 4)}`);
  if (month < 1 || month > 12) return false;

  const now = new Date();
  const expiryDate = new Date(year, month, 0, 23, 59, 59, 999);
  return expiryDate >= now;
}

export function validateCardPayment(input: CardPaymentInput): string | null {
  const cardNumber = digitsOnly(input.cardNumber);
  const cvc = digitsOnly(input.cvc);

  if (!input.cardholder.trim()) {
    return "Укажите имя держателя карты";
  }

  if (cardNumber.length !== 16 || !luhnCheck(cardNumber)) {
    return "Неверный номер карты";
  }

  if (!isExpiryValid(input.expiry)) {
    return "Неверный срок действия карты";
  }

  if (cvc.length < 3 || cvc.length > 4) {
    return "Неверный CVC/CVV код";
  }

  return null;
}

export function processDemoPayment(
  input: CardPaymentInput,
  amount: number,
): CardPaymentResult {
  const validationError = validateCardPayment(input);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const cardNumber = digitsOnly(input.cardNumber);

  if (cardNumber.endsWith("0002")) {
    return { ok: false, error: "Платёж отклонён банком. Попробуйте другую карту." };
  }

  if (amount <= 0) {
    return { ok: false, error: "Некорректная сумма заказа" };
  }

  return {
    ok: true,
    paymentId: `pay-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    cardLast4: cardNumber.slice(-4),
    cardBrand: detectCardBrand(cardNumber),
  };
}
