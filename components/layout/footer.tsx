import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail, MessageCircle } from "lucide-react";

import { Section, Container } from "@/components/craft";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { mainMenu, contentMenu } from "@/menu.config";
import { siteConfig } from "@/site.config";
import { buildWhatsAppLink, supportContact } from "@/lib/support-contact";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .55.04.81.1v-3.5a6.37 6.37 0 0 0-.81-.05A6.34 6.34 0 0 0 3.15 15.9a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.2 8.2 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15Z" />
    </svg>
  );
}

export function Footer() {
  const whatsappLink = buildWhatsAppLink(
    `Hi Calviz, I have a question about your store.`
  );

  const socialLinks = [
    {
      label: "Instagram",
      href: supportContact.social.instagram,
      icon: Instagram,
    },
    {
      label: "TikTok",
      href: supportContact.social.tiktok,
      icon: TikTokIcon,
    },
    {
      label: "Facebook",
      href: supportContact.social.facebook,
      icon: Facebook,
    },
  ] as const;

  return (
    <footer>
      <Section className="pt-4">
        <Container className="brand-shell grid gap-12 p-6 md:grid-cols-[1.5fr_0.5fr_0.5fr_0.75fr] md:p-8">
          <div className="flex flex-col gap-6 not-prose">
            <Link href="/">
              <h3 className="sr-only">{siteConfig.site_name}</h3>
              <Image
                src="/calviz-logo-light.svg"
                alt="Calviz"
                className="h-8 w-auto dark:hidden"
                width={240}
                height={64}
              />
              <Image
                src="/calviz-logo-dark.svg"
                alt="Calviz"
                className="hidden h-8 w-auto dark:block"
                width={240}
                height={64}
              />
            </Link>
            <p className="brand-copy">{siteConfig.site_description}</p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <h5 className="font-medium text-base">Website</h5>
            {Object.entries(mainMenu).map(([key, href]) => (
              <Link
                className="hover:underline underline-offset-4"
                key={href}
                href={href}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <h5 className="font-medium text-base">Blog</h5>
            {Object.entries(contentMenu).map(([key, href]) => (
              <Link
                className="hover:underline underline-offset-4"
                key={href}
                href={href}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <h5 className="font-medium text-base">Contact</h5>
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:underline underline-offset-4"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                {supportContact.whatsappDisplay}
              </a>
            )}
            <a
              href={`mailto:${supportContact.email}`}
              className="inline-flex items-center gap-2 hover:underline underline-offset-4"
            >
              <Mail className="h-4 w-4 shrink-0" />
              {supportContact.email}
            </a>
            <div className="flex flex-wrap gap-2 pt-2">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  title={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--brand-border)] transition-colors hover:border-[color:var(--brand-ink)] hover:bg-[color:var(--brand-ink)] hover:text-[color:var(--brand-on-accent)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <p className="brand-copy text-xs">
              WhatsApp us for orders, sizing, and delivery questions.
            </p>
          </div>
        </Container>
        <Container className="not-prose flex flex-col justify-between gap-6 py-5 md:flex-row md:items-center md:gap-2">
          <ThemeToggle />
          <p className="brand-copy text-sm">
            &copy;Calviz. All rights reserved.
            2026
          </p>
        </Container>
      </Section>
    </footer>
  );
}
