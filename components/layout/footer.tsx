import Link from "next/link";
import Image from "next/image";
import { Section, Container } from "@/components/craft";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { mainMenu, contentMenu } from "@/menu.config";
import { siteConfig } from "@/site.config";

export function Footer() {
  return (
    <footer>
      <Section className="pt-4">
        <Container className="brand-shell grid gap-12 p-6 md:grid-cols-[1.5fr_0.5fr_0.5fr] md:p-8">
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
        </Container>
        <Container className="not-prose flex flex-col justify-between gap-6 py-5 md:flex-row md:items-center md:gap-2">
          <ThemeToggle />
          <p className="brand-copy text-sm">
            &copy; <a href="https://9d8.dev">9d8</a>. All rights reserved.
            2025-present.
          </p>
        </Container>
      </Section>
    </footer>
  );
}
