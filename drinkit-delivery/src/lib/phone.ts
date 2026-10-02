export function normalizeRuPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) {
    return `7${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    return `7${digits}`;
  }
  return digits;
}

export function isValidRuPhone(phone: string): boolean {
  return /^7\d{10}$/.test(normalizeRuPhone(phone));
}
