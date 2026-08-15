type SiteConfig = {
  site_domain: string;
  site_name: string;
  site_description: string;
  support_email: string;
  support_whatsapp: string;
  support_whatsapp_display: string;
  social: {
    instagram: string;
    tiktok: string;
    facebook: string;
  };
};

export const siteConfig: SiteConfig = {
  site_name: "Calviz",
  site_description:
    "Try it, wear it, love it — a Sri Lankan clothing edit of everyday tailoring, linen essentials, and boutique seasonal drops.",
  site_domain: "https://calviz.lk",
  support_email:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "hello@calviz.lk",
  // International format without + or spaces — this is what wa.me expects.
  support_whatsapp: process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "94704901027",
  support_whatsapp_display:
    process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_DISPLAY || "+94 70 490 1027",
  social: {
    instagram: "https://www.instagram.com/calviz.clothing",
    tiktok: "https://www.tiktok.com/@calviz.clothing",
    facebook: "https://www.facebook.com/profile.php?id=61583053942508",
  },
};
