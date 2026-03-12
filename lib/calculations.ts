import { QuoteItem, QuoteSummary } from "@/lib/types";

export const currency = new Intl.NumberFormat("ko-KR");

export function roundCurrency(value: number) {
  return Math.round(Number.isFinite(value) ? value : 0);
}

export function clampDiscountRate(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

export function getLineAmount(quantity: number, unitPrice: number) {
  return roundCurrency(quantity * unitPrice);
}

export function getDiscountedUnitPrice(unitPrice: number, discountRate: number) {
  const safeRate = clampDiscountRate(discountRate);
  return roundCurrency(unitPrice * (1 - safeRate / 100));
}

export function getSummary(items: QuoteItem[], discountRate = 0): QuoteSummary {
  const supplyTotal = items.reduce((total, item) => {
    const discountedPrice = getDiscountedUnitPrice(item.unitPrice, discountRate);
    return total + getLineAmount(item.quantity, discountedPrice);
  }, 0);

  const vat = roundCurrency(supplyTotal * 0.1);

  return {
    supplyTotal: roundCurrency(supplyTotal),
    vat,
    grandTotal: roundCurrency(supplyTotal + vat)
  };
}
