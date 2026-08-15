import Image from "next/image";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
} from "lucide-react";

import { Container, Section } from "@/components/craft";
import { ProductGrid } from "@/components/shop";
import { Button } from "@/components/ui/button";
import {
  getAllProductCategories,
  getFeaturedProducts,
  getOnSaleProducts,
} from "@/lib/woocommerce";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const revalidate = 600;

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

  return (
    <div className={`${displayFont.variable} bg-[#f4f7fb] text-slate-900`}>
      <Section className="py-0">
        <Container className="max-w-6xl px-4 sm:px-6 lg:px-10">
          <main className="space-y-14 py-8 md:space-y-20 md:py-12">
            <section className="home-reveal relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_80px_-50px_rgba(15,23,42,0.45)] sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-amber-200/60 via-orange-100/40 to-transparent blur-2xl" />
              <div className="pointer-events-none absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-gradient-to-tr from-sky-200/50 via-cyan-100/30 to-transparent blur-2xl" />

              <div className="relative grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-6">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    <Sparkles className="h-3.5 w-3.5" />
                    New Season Drop
                  </span>
                  <div className="space-y-4">
                    <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">
                      Designed to Be Seen, Built to Be Bought
                    </h1>
                    <p className="max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                      Discover curated essentials, premium craft, and fast delivery.
                      A clean shopping experience with standout products at center stage.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button asChild className="h-11 rounded-full px-6 text-sm">
                      <Link href="/shop">
                        Shop New Arrivals
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-11 rounded-full border-slate-300 bg-white px-6 text-sm text-slate-800 hover:bg-slate-100"
                    >
                      <Link href="/shop?sort=popularity">Best Sellers</Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {[
                      { label: "Products", value: "500+" },
                      { label: "Countries", value: "40" },
                      { label: "Satisfaction", value: "4.9/5" },
                    ].map((stat, index) => (
                      <div
                        key={stat.label}
                        className="home-reveal rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                        style={{ animationDelay: `${index * 120 + 120}ms` }}
                      >
                        <p className="text-xl font-semibold text-slate-900">{stat.value}</p>
                        <p className="text-sm text-slate-600">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="home-reveal space-y-4" style={{ animationDelay: "220ms" }}>
                  <div className="home-float rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50 p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">Fresh Picks</span>
                      <Store className="h-5 w-5 text-slate-500" />
                    </div>
                    <p className="text-2xl font-semibold leading-tight text-slate-900">
                      Light, clean, and conversion-focused shopping.
                    </p>
                    <p className="mt-3 text-sm text-slate-600">
                      Bold product imagery, clear pricing, and streamlined checkout paths.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
                      <Truck className="mb-2 h-5 w-5 text-emerald-700" />
                      <p className="font-medium text-emerald-900">Fast shipping</p>
                      <p className="text-sm text-emerald-800/80">Dispatch in 24-48 hours</p>
                    </div>
                    <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-4">
                      <ShieldCheck className="mb-2 h-5 w-5 text-blue-700" />
                      <p className="font-medium text-blue-900">Secure checkout</p>
                      <p className="text-sm text-blue-800/80">Encrypted payment flow</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="home-reveal flex items-center justify-between" style={{ animationDelay: "120ms" }}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Shop by Category
                  </p>
                  <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-slate-900">
                    Start with what you love
                  </h2>
                </div>
                <Link
                  href="/shop"
                  className="text-sm font-medium text-slate-700 underline-offset-4 hover:underline"
                >
                  View all products
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featuredCategories.length > 0 ? (
                  featuredCategories.map((category, index) => (
                    <Link
                      key={category.id}
                      href={`/shop/category/${category.slug}`}
                      className="home-reveal group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                      style={{ animationDelay: `${index * 100 + 150}ms` }}
                    >
                      <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-gradient-to-br from-orange-100/60 to-transparent" />
                      <div className="relative flex items-center justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold text-slate-900">{category.name}</p>
                          <p className="text-sm text-slate-600">{category.count} products</p>
                        </div>
                        {category.image?.src ? (
                          <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-white">
                            <Image
                              src={category.image.src}
                              alt={category.image.alt || category.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                              sizes="56px"
                            />
                          </div>
                        ) : (
                          <div className="grid h-14 w-14 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
                            <Store className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 sm:col-span-2 lg:col-span-3">
                    Product categories will appear here once WooCommerce is connected.
                  </p>
                )}
              </div>
            </section>

            <section className="space-y-6">
              <div className="home-reveal flex flex-wrap items-end justify-between gap-3" style={{ animationDelay: "160ms" }}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Featured Collection
                  </p>
                  <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-slate-900">
                    Customer favorites this week
                  </h2>
                </div>
                <Button asChild variant="ghost" className="rounded-full text-slate-700 hover:bg-slate-100">
                  <Link href="/shop?sort=rating">
                    Top Rated
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="home-reveal" style={{ animationDelay: "220ms" }}>
                <ProductGrid products={featuredProducts} columns={4} />
              </div>
            </section>

            {onSaleProducts.length > 0 && (
              <section className="home-reveal rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 p-5 sm:p-7" style={{ animationDelay: "260ms" }}>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-800/80">
                      Limited Offers
                    </p>
                    <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900">
                      Save on selected items
                    </h2>
                  </div>
                  <Button asChild variant="outline" className="rounded-full border-amber-300 bg-white/80">
                    <Link href="/shop?sort=price">Browse Deals</Link>
                  </Button>
                </div>
                <ProductGrid products={onSaleProducts} columns={4} />
              </section>
            )}
          </main>
        </Container>
      </Section>
    </div>
  );
}
