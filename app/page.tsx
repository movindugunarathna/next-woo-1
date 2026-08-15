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

  const heroImage = spotlight?.images[0]?.src
    ? {
        src: spotlight.images[0].src,
        alt: spotlight.images[0].alt || spotlight.name,
      }
    : { src: curatedSpotlight.image, alt: curatedSpotlight.imageAlt };

  const promoCategory = featuredCategories[0];
  const promoProduct = edit[1] ?? edit[0];
  const promoBanner = promoCategory?.image?.src
    ? {
        image: promoCategory.image.src,
        alt: promoCategory.image.alt || promoCategory.name,
        kicker: "Shop by mood",
        title: promoCategory.name,
        href: `/shop/category/${promoCategory.slug}`,
        cta: "Shop the category",
      }
    : promoProduct?.images[0]?.src
      ? {
          image: promoProduct.images[0].src,
          alt: promoProduct.images[0].alt || promoProduct.name,
          kicker: "Just dropped",
          title: promoProduct.name,
          href: `/shop/${promoProduct.slug}`,
          cta: "Shop this piece",
        }
      : null;

  return (
    <div className={`${displayFont.variable} brand-page`}>
      {/* Promo bar */}
      <div className="brand-promo-bar">
        <Container className="max-w-6xl px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.18em] sm:px-6 lg:px-10">
          Try it, wear it, love it — islandwide delivery on every order
        </Container>
      </div>

      <main>
        {/* Full-bleed hero banner */}
        {/* Height is viewport-driven minus the nav, promo bar, and enough room
            for the next section's heading to stay in view on load. */}
        <section className="home-reveal relative flex h-[calc(100svh-20rem)] min-h-[400px] w-full items-end overflow-hidden pb-8 sm:min-h-[440px] sm:pb-12 lg:min-h-[480px] lg:max-h-[720px] lg:pb-14">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            priority
            className="object-cover object-[center_35%]"
            sizes="100vw"
          />
          <div className="brand-hero-scrim absolute inset-0" />
          <Container className="relative z-10 w-full max-w-none px-4 sm:px-8 lg:px-12 xl:px-16">
            <div className="space-y-3 text-white">
              <h1 className="text-3xl font-black italic uppercase leading-[0.9] tracking-tight text-white sm:text-5xl md:text-6xl lg:whitespace-nowrap lg:text-7xl xl:text-8xl">
                Try it, wear it, love it.
              </h1>
              <p className="text-sm text-white/85 sm:text-base">
                Explore the new capsule
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Link
                  href="/shop"
                  className="rounded-md bg-black px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black"
                >
                  Shop New Arrivals
                </Link>
                <Link
                  href="/shop?sort=popularity"
                  className="rounded-md bg-black px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black"
                >
                  Shop Best Sellers
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <Section className="py-0">
          <Container className="max-w-6xl space-y-14 px-4 pb-8 pt-5 sm:px-6 md:space-y-20 md:pb-12 md:pt-6 lg:px-10">
            {/* Trust strip
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
            </section> */}

            {/* Category showcase */}
            <section className="space-y-5">
              <div
                className="home-reveal flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4"
                style={{ animationDelay: "80ms" }}
              >
                <div>
                  <p className="brand-kicker">Collections</p>
                  <h2 className="brand-display text-3xl font-semibold sm:text-4xl">
                    Shop by mood
                  </h2>
                </div>
                <Link
                  href="/shop"
                  className="brand-link whitespace-nowrap text-sm font-semibold"
                >
                  See all categories
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                {featuredCategories.length > 0 ? (
                  featuredCategories.map((category, index) => (
                    <Link
                      key={category.id}
                      href={`/shop/category/${category.slug}`}
                      className="home-reveal brand-image-frame group relative block aspect-square sm:aspect-[4/3]"
                      style={{ animationDelay: `${index * 80 + 120}ms` }}
                    >
                      {category.image?.src ? (
                        <>
                          <Image
                            src={category.image.src}
                            alt={category.image.alt || category.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="brand-image-overlay absolute inset-0" />
                          <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
                            <p className="text-sm font-semibold sm:text-lg">
                              {category.name}
                            </p>
                            <p className="text-xs text-white/80 sm:text-sm">
                              {category.count} curated pieces
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-[color:var(--brand-card)] p-3 text-center sm:gap-2">
                          <Shirt className="h-5 w-5 text-[var(--brand-accent)] sm:h-6 sm:w-6" />
                          <p className="text-sm font-semibold sm:text-base">
                            {category.name}
                          </p>
                          <p className="brand-copy text-xs sm:text-sm">
                            {category.count} curated pieces
                          </p>
                        </div>
                      )}
                    </Link>
                  ))
                ) : (
                  <p className="brand-card col-span-2 p-5 text-sm brand-copy lg:col-span-3">
                    Categories will appear here once WooCommerce category data
                    is available.
                  </p>
                )}
              </div>
            </section>
          </Container>
        </Section>

        {/* Full-bleed promo banner */}
        {promoBanner && (
          <section className="home-reveal relative flex min-h-[380px] w-full items-end overflow-hidden sm:min-h-[440px]">
            <Image
              src={promoBanner.image}
              alt={promoBanner.alt}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="brand-image-overlay absolute inset-0" />
            <Container className="relative z-10 w-full max-w-6xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-10">
              <div className="max-w-md space-y-3 text-white">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-white/80">
                  {promoBanner.kicker}
                </p>
                <h2 className="brand-display text-3xl font-semibold md:text-4xl">
                  {promoBanner.title}
                </h2>
                <Link
                  href={promoBanner.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white underline underline-offset-4"
                >
                  {promoBanner.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Container>
          </section>
        )}

        <Section className="py-0">
          <Container className="max-w-6xl space-y-14 px-4 py-8 sm:px-6 md:space-y-20 md:py-12 lg:px-10">
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
          </Container>
        </Section>
      </main>
    </div>
  );
}
