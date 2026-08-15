import Image from "next/image";
import Link from "next/link";
import { Bodoni_Moda } from "next/font/google";
import {
  ArrowRight,
  Quote,
  Shirt,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

import { Container, Section } from "@/components/craft";
import { ProductGrid } from "@/components/shop";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import {
  getAllProductCategories,
  getFeaturedProducts,
  getOnSaleProducts,
  formatPrice,
} from "@/lib/woocommerce";

const displayFont = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
});

export const revalidate = 600;

// Editorial fallback shown until a real featured product exists in WooCommerce.
// Drop the artwork at public/spotlight-the-gorgons.jpg and it renders here automatically.
const curatedSpotlight = {
  image: "/spotlight-the-gorgons.jpg",
  imageAlt: "Calviz \"The Gorgons\" Medusa graphic oversized tee, back view",
  title: "The Gorgons — Medusa Tee",
  tagline: "Oversized cut, hand-inked gorgon graphic across the back.",
};

const trustStrip = [
  {
    icon: Truck,
    title: "Islandwide delivery",
    body: "Fast dispatch with dependable tracking, door to door.",
  },
  {
    icon: ShieldCheck,
    title: "Protected checkout",
    body: "Secure order flow with trusted payment providers.",
  },
  {
    icon: Sparkles,
    title: "Weekly new drops",
    body: "Fresh collection updates inspired by local style.",
  },
  {
    icon: Shirt,
    title: "Boutique direction",
    body: "Editorial fits, everyday fabrics, no pretension.",
  },
];

export default async function Home() {
  const [featuredProducts, onSaleProducts, categories] = await Promise.all([
    getFeaturedProducts(8),
    getOnSaleProducts(4),
    getAllProductCategories(),
  ]);

  const featuredCategories = categories
    .filter((category) => category.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const spotlight = featuredProducts[0];
  const edit = featuredProducts.slice(0, 4);

  return (
    <div className={`${displayFont.variable} brand-page`}>
      {/* Promo bar */}
      <div className="brand-promo-bar">
        <Container className="max-w-6xl px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.18em] sm:px-6 lg:px-10">
          Try it, wear it, love it — islandwide delivery on every order
        </Container>
      </div>

      <Section className="py-0">
        <Container className="max-w-6xl px-4 sm:px-6 lg:px-10">
          <main className="space-y-14 py-8 md:space-y-20 md:py-12">
            {/* Hero */}
            <section className="home-reveal relative grid items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="brand-shell relative flex flex-col justify-center gap-6 overflow-hidden p-6 sm:p-8 lg:p-10">
                <div className="brand-weave absolute inset-0 opacity-60" />
                <div className="relative space-y-5">
                  <p className="brand-kicker flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    Colombo capsule edit
                  </p>
                  <h1 className="brand-display text-5xl font-semibold md:text-6xl">
                    Crafted for tropical days and city nights.
                  </h1>
                  <p className="brand-copy max-w-xl text-base md:text-lg">
                    A modern Sri Lankan clothing storefront with clean tailoring
                    energy, boutique seasonal drops, and quick paths from
                    discovery to checkout.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      asChild
                      className="brand-btn-primary h-11 rounded-full px-6 text-sm"
                    >
                      <Link href="/shop">
                        Shop New Arrivals
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="brand-btn-outline h-11 rounded-full px-6 text-sm"
                    >
                      <Link href="/shop?sort=popularity">
                        Browse Best Sellers
                      </Link>
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="brand-chip">Workwear lines</span>
                    <span className="brand-chip">Linen capsule</span>
                    <span className="brand-chip">Boutique drops</span>
                  </div>
                </div>
              </div>

              <div
                className="home-reveal"
                style={{ animationDelay: "180ms" }}
              >
                {spotlight?.images[0]?.src ? (
                  <Link
                    href={`/shop/${spotlight.slug}`}
                    className="brand-image-frame group relative block h-full min-h-[22rem] w-full"
                  >
                    <Image
                      src={spotlight.images[0].src}
                      alt={spotlight.images[0].alt || spotlight.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority
                    />
                    <div className="brand-image-overlay absolute inset-0" />
                    <div className="absolute inset-x-0 bottom-0 space-y-1 p-5 text-white">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/80">
                        This week&apos;s spotlight
                      </p>
                      <p className="brand-display text-2xl font-semibold">
                        {spotlight.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        {spotlight.price
                          ? formatPrice(spotlight.price)
                          : "Shop the piece"}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                ) : (
                  <Link
                    href="/shop"
                    className="brand-image-frame group relative block h-full min-h-[22rem] w-full"
                  >
                    <Image
                      src={curatedSpotlight.image}
                      alt={curatedSpotlight.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority
                    />
                    <div className="brand-image-overlay absolute inset-0" />
                    <div className="absolute inset-x-0 bottom-0 space-y-1 p-5 text-white">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/80">
                        This week&apos;s spotlight
                      </p>
                      <p className="brand-display text-2xl font-semibold">
                        {curatedSpotlight.title}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        {curatedSpotlight.tagline}
                        <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </section>

            {/* Trust strip */}
            <section
              className="home-reveal grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
              style={{ animationDelay: "80ms" }}
            >
              {trustStrip.map((item) => (
                <div key={item.title} className="brand-card flex gap-3 p-4">
                  <item.icon className="h-5 w-5 shrink-0 text-[var(--brand-accent)]" />
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="brand-copy mt-1 text-sm">{item.body}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* Category showcase */}
            <section className="space-y-5">
              <div
                className="home-reveal flex items-end justify-between gap-4"
                style={{ animationDelay: "80ms" }}
              >
                <div>
                  <p className="brand-kicker">Collections</p>
                  <h2 className="brand-display text-4xl font-semibold">
                    Shop by mood
                  </h2>
                </div>
                <Link href="/shop" className="brand-link text-sm font-semibold">
                  See all categories
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featuredCategories.length > 0 ? (
                  featuredCategories.map((category, index) => (
                    <Link
                      key={category.id}
                      href={`/shop/category/${category.slug}`}
                      className="home-reveal brand-image-frame group relative block aspect-[4/3]"
                      style={{ animationDelay: `${index * 80 + 120}ms` }}
                    >
                      {category.image?.src ? (
                        <>
                          <Image
                            src={category.image.src}
                            alt={category.image.alt || category.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="brand-image-overlay absolute inset-0" />
                          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                            <p className="text-lg font-semibold">
                              {category.name}
                            </p>
                            <p className="text-sm text-white/80">
                              {category.count} curated pieces
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[color:var(--brand-card)]">
                          <Shirt className="h-6 w-6 text-[var(--brand-accent)]" />
                          <p className="font-semibold">{category.name}</p>
                          <p className="brand-copy text-sm">
                            {category.count} curated pieces
                          </p>
                        </div>
                      )}
                    </Link>
                  ))
                ) : (
                  <p className="brand-card p-5 text-sm brand-copy sm:col-span-2 lg:col-span-3">
                    Categories will appear here once WooCommerce category data
                    is available.
                  </p>
                )}
              </div>
            </section>

            {/* New arrivals */}
            <section className="space-y-5">
              <div
                className="home-reveal flex flex-wrap items-end justify-between gap-3"
                style={{ animationDelay: "120ms" }}
              >
                <div>
                  <p className="brand-kicker">New arrivals</p>
                  <h2 className="brand-display text-4xl font-semibold">
                    Fresh from the rack
                  </h2>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  className="rounded-full px-5 hover:bg-[color:var(--brand-card)]"
                >
                  <Link href="/shop?sort=date">
                    Drop this week
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="home-reveal" style={{ animationDelay: "180ms" }}>
                <ProductGrid products={featuredProducts} columns={4} />
              </div>
            </section>

            {/* Brand story + shop the edit */}
            <section className="brand-shell home-reveal grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1fr] lg:p-10">
              <div className="flex flex-col justify-center gap-4">
                <p className="brand-kicker">Made for the island</p>
                <Quote className="h-7 w-7 text-[var(--brand-accent)]" />
                <p className="brand-display text-3xl font-semibold md:text-4xl">
                  Tailoring built for humidity, monsoon commutes, and long
                  golden-hour evenings.
                </p>
                <p className="brand-copy max-w-md text-sm md:text-base">
                  Every capsule balances breathable natural fibers with
                  considered cuts, so the same piece works for a client
                  meeting in Colombo and a sunset walk in Galle.
                </p>
                <Link
                  href="/shop"
                  className="brand-link inline-flex w-fit items-center gap-2 text-sm font-semibold"
                >
                  Shop the edit
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {edit.length > 0 ? (
                  edit.map((product) => (
                    <Link
                      key={product.id}
                      href={`/shop/${product.slug}`}
                      className="brand-image-frame group relative block aspect-square"
                    >
                      {product.images[0]?.src ? (
                        <Image
                          src={product.images[0].src}
                          alt={product.images[0].alt || product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 50vw, 20vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[color:var(--brand-card)]">
                          <Shirt className="h-6 w-6 text-[var(--brand-accent)]" />
                        </div>
                      )}
                    </Link>
                  ))
                ) : (
                  <div className="brand-weave col-span-2 rounded-2xl" />
                )}
              </div>
            </section>

            {/* On sale */}
            {onSaleProducts.length > 0 && (
              <section
                className="home-reveal space-y-5"
                style={{ animationDelay: "220ms" }}
              >
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="brand-kicker">Price edit</p>
                    <h2 className="brand-display text-4xl font-semibold">
                      Boutique picks on offer
                    </h2>
                  </div>
                  <Link
                    href="/shop?sort=price"
                    className="brand-link text-sm font-semibold"
                  >
                    Explore offers
                  </Link>
                </div>
                <ProductGrid products={onSaleProducts} columns={4} />
              </section>
            )}

            {/* Newsletter */}
            <section className="brand-shell home-reveal flex flex-col items-start justify-between gap-6 p-6 sm:p-8 md:flex-row md:items-center lg:p-10">
              <div className="space-y-2">
                <p className="brand-kicker">Stay in the loop</p>
                <h2 className="brand-display text-3xl font-semibold">
                  Get first access to new drops
                </h2>
                <p className="brand-copy max-w-md text-sm">
                  One email a week — new arrivals, restocks, and boutique-only
                  offers. No spam.
                </p>
              </div>
              <NewsletterForm />
            </section>
          </main>
        </Container>
      </Section>
    </div>
  );
}
