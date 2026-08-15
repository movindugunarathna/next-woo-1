import { siteConfig } from "@/site.config";

/**
 * Single source for the store's human-support channels, so the chat handoff,
 * footer, and any future contact page always point at the same number.
 */
export const supportContact = {
  email: siteConfig.support_email,
  whatsappNumber: siteConfig.support_whatsapp.replace(/\D/g, ""),
  whatsappDisplay: siteConfig.support_whatsapp_display,
  social: siteConfig.social,
};

export function buildWhatsAppLink(message?: string) {
  if (!supportContact.whatsappNumber) return null;

  const base = `https://wa.me/${supportContact.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function buildEmailLink(subject: string, body?: string) {
  const params = new URLSearchParams({ subject });
  if (body) params.set("body", body);

  return `mailto:${supportContact.email}?${params.toString()}`;
}

/** Phone-dialable form, e.g. +94704901027 */
export function buildTelLink() {
  if (!supportContact.whatsappNumber) return null;
  return `tel:+${supportContact.whatsappNumber}`;
}
