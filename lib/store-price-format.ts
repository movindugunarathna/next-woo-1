export interface StorePriceFormat {
  currency: string;
  locale: string;
}

export const FALLBACK_STORE_CURRENCY = "USD";
export const FALLBACK_STORE_LOCALE = "en-US";

let currentStorePriceFormat: StorePriceFormat = {
  currency: FALLBACK_STORE_CURRENCY,
  locale: FALLBACK_STORE_LOCALE,
};

declare global {
  var __NEXT_WOO_STORE_PRICE_FORMAT__: StorePriceFormat | undefined;

  interface Window {
    __NEXT_WOO_STORE_PRICE_FORMAT__?: StorePriceFormat;
  }
}

function normalizeCurrency(currency: string | undefined): string {
  if (!currency) return FALLBACK_STORE_CURRENCY;
  const normalized = currency.trim().toUpperCase();
  return normalized || FALLBACK_STORE_CURRENCY;
}

function normalizeLocale(locale: string | undefined): string {
  if (!locale) return FALLBACK_STORE_LOCALE;
  const normalized = locale.trim();
  return normalized || FALLBACK_STORE_LOCALE;
}

export function setStorePriceFormat(
  format: Partial<StorePriceFormat>
): StorePriceFormat {
  currentStorePriceFormat = {
    currency: normalizeCurrency(format.currency || currentStorePriceFormat.currency),
    locale: normalizeLocale(format.locale || currentStorePriceFormat.locale),
  };

  if (typeof globalThis !== "undefined") {
    globalThis.__NEXT_WOO_STORE_PRICE_FORMAT__ = currentStorePriceFormat;
  }

  if (typeof window !== "undefined") {
    window.__NEXT_WOO_STORE_PRICE_FORMAT__ = currentStorePriceFormat;
  }

  return currentStorePriceFormat;
}

export function getStorePriceFormat(): StorePriceFormat {
  if (typeof window !== "undefined" && window.__NEXT_WOO_STORE_PRICE_FORMAT__) {
    currentStorePriceFormat = setStorePriceFormat(window.__NEXT_WOO_STORE_PRICE_FORMAT__);
    return currentStorePriceFormat;
  }

  if (typeof globalThis !== "undefined" && globalThis.__NEXT_WOO_STORE_PRICE_FORMAT__) {
    currentStorePriceFormat = setStorePriceFormat(
      globalThis.__NEXT_WOO_STORE_PRICE_FORMAT__
    );
    return currentStorePriceFormat;
  }

  return currentStorePriceFormat;
}