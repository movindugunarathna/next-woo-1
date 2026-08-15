import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/nav/mobile-nav";
import { CartDrawer } from "@/components/shop";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { mainMenu } from "@/menu.config";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

interface NavProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

export function Nav({ className, children, id }: NavProps) {
  return (
    <nav
      className={cn(
        "brand-blur-nav sticky top-0 z-50 border-b border-[color:var(--brand-border)]",
        className
      )}
      id={id}
    >
      <div
        id="nav-container"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10"
      >
        <Link
          className="hover:opacity-75 transition-all flex gap-4 items-center"
          href="/"
        >
          <h2 className="sr-only">{siteConfig.site_name}</h2>
          <Image
            src="/calviz-logo-light.svg"
            alt="Calviz"
            loading="eager"
            className="h-7 w-auto dark:hidden"
            width={210}
            height={56}
            priority
          />
          <Image
            src="/calviz-logo-dark.svg"
            alt="Calviz"
            loading="eager"
            className="hidden h-7 w-auto dark:block"
            width={210}
            height={56}
            priority
          />
        </Link>
        {children}
        <div className="flex items-center gap-2">
          <div className="mx-2 hidden md:flex">
            {Object.entries(mainMenu).map(([key, href]) => (
              <Button key={href} asChild variant="ghost" size="sm">
                <Link href={href}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Link>
              </Button>
            ))}
          </div>
          <ThemeToggle />
          <CartDrawer />
          <MobileNav />
        </div>
      </div>
    </nav>
  );
}
