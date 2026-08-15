import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Bodoni_Moda } from "next/font/google";
import { ArrowRight, RotateCcw, ShieldCheck, Truck } from "lucide-react";

import {
  getProductBySlug,
  getProductVariations,
  getProductReviews,
  getRelatedProducts,
  getAllProductSlugs,
} from "@/lib/woocommerce";

import { Section, Container } from "@/components/craft";
import {
  ProductGallery,
  PriceDisplay,
  StockBadge,
  AddToCartButton,
  ProductGrid,
  ProductTabs,
} from "@/components/shop";
import { ProductDetailClient } from "./product-detail-client";

const displayFont = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
});

const trustPoints = [
  {
    icon: Truck,
    label: "Free islandwide shipping",
    body: "On every order, no minimum spend.",
  },
  {
    icon: RotateCcw,
    label: "Easy returns",
    body: "14-day window on unworn pieces.",
  },
  {
    icon: ShieldCheck,
    label: "Secure checkout",
    body: "Protected payment providers.",
  },
];

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.short_description.replace(/<[^>]*>/g, "").slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.short_description.replace(/<[^>]*>/g, ""),
      images: product.images[0]?.src ? [product.images[0].src] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch additional data in parallel
  const [variations, reviews, relatedProducts] = await Promise.all([
    product.type === "variable" ? getProductVariations(product.id) : [],
    getProductReviews(product.id),
    getRelatedProducts(product.id, 4),
  ]);

  const isNewArrival =
    Date.now() - new Date(product.date_created).getTime() <
    1000 * 60 * 60 * 24 * 30;

  const secondaryImage = product.images[1];
  const descriptiveAttributes = product.attributes.filter(
    (attr) => !attr.variation
  );
  const cleanDescription = product.description.replace(/<[^>]*>/g, "").trim();
  const cleanShortDescription = product.short_description
    .replace(/<[^>]*>/g, "")
    .trim();

  const tabs: { id: string; label: string; content: ReactNode }[] = [];

  if (cleanDescription) {
    tabs.push({
      id: "details",
      label: "Details",
      content: secondaryImage ? (
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <p className="brand-copy max-w-2xl whitespace-pre-line text-sm leading-7">
            {cleanDescription}
          </p>
          <div className="brand-image-frame relative aspect-[4/3]">
            <Image
              src={secondaryImage.src}
              alt={secondaryImage.alt || product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>
      ) : (
        <p className="brand-copy max-w-2xl whitespace-pre-line text-sm leading-7">
          {cleanDescription}
        </p>
      ),
    });
  }

  if (
    descriptiveAttributes.length > 0 ||
    product.sku ||
    product.tags.length > 0 ||
    product.weight
  ) {
    tabs.push({
      id: "info",
      label: "Additional Info",
      content: (
        <div className="space-y-5">
          <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            {product.sku && (
              <div className="flex justify-between gap-4 border-b border-[color:var(--brand-border)] pb-2">
                <dt className="font-semibold text-[color:var(--brand-ink)]">SKU</dt>
                <dd className="text-right text-[color:var(--brand-muted)]">
                  {product.sku}
                </dd>
              </div>
            )}
            {product.weight && (
              <div className="flex justify-between gap-4 border-b border-[color:var(--brand-border)] pb-2">
                <dt className="font-semibold text-[color:var(--brand-ink)]">
                  Weight
                </dt>
                <dd className="text-right text-[color:var(--brand-muted)]">
                  {product.weight} kg
                </dd>
              </div>
            )}
            {descriptiveAttributes.map((attr) => (
              <div
                key={attr.id}
                className="flex justify-between gap-4 border-b border-[color:var(--brand-border)] pb-2"
              >
                <dt className="font-semibold text-[color:var(--brand-ink)]">
                  {attr.name}
                </dt>
                <dd className="text-right text-[color:var(--brand-muted)]">
                  {attr.options.join(", ")}
                </dd>
              </div>
            ))}
          </dl>
          {product.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-[color:var(--brand-ink)]">
                Tags
              </span>
              {product.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/shop?tag=${tag.slug}`}
                  className="brand-chip"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ),
    });
  }

  if (reviews.length > 0) {
    tabs.push({
      id: "reviews",
      label: `Reviews (${reviews.length})`,
      content: (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="brand-card space-y-2 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[color:var(--brand-ink)]">
                    {review.reviewer}
                  </span>
                  {review.verified && (
                    <span className="brand-badge-new">Verified</span>
                  )}
                </div>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < review.rating
                          ? "text-[color:var(--brand-accent)]"
                          : "text-[color:var(--brand-border)]"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="brand-copy text-sm">
                {review.review.replace(/<[^>]*>/g, "")}
              </p>
              <p className="text-xs text-[color:var(--brand-muted)]">
                {new Date(review.date_created).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ),
    });
  }

  tabs.push({
    id: "shipping",
    label: "Shipping & Returns",
    content: (
      <div className="brand-copy max-w-2xl space-y-3 text-sm leading-7">
        <p>
          Orders dispatch within 1–2 business days with tracked, islandwide
          delivery.
        </p>
        <p>
          Not the right fit? Unworn pieces in original condition can be
          returned within 14 days of delivery for a refund or exchange.
        </p>
        <p>Questions before you order? Reach us at hello@calviz.lk.</p>
      </div>
    ),
  });

  return (
    <div className={`${displayFont.variable} brand-page`}>
      <Section className="py-0">
        <Container className="max-w-6xl space-y-14 px-4 py-8 sm:px-6 md:py-12 lg:px-10">
          {/* Breadcrumb */}
          <nav className="home-reveal flex flex-wrap items-center gap-2 text-sm text-[color:var(--brand-muted)]">
            <Link href="/shop" className="hover:text-[color:var(--brand-ink)]">
              Shop
            </Link>
            <span>/</span>
            {product.categories[0] && (
              <>
                <Link
                  href={`/shop?category=${product.categories[0].slug}`}
                  className="hover:text-[color:var(--brand-ink)]"
                >
                  {product.categories[0].name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-[color:var(--brand-ink)]">{product.name}</span>
          </nav>

          {/* Gallery + Info */}
          <div
            className="home-reveal grid gap-10 lg:grid-cols-2 lg:gap-14"
            style={{ animationDelay: "80ms" }}
          >
            <ProductGallery images={product.images} productName={product.name} />

            <div className="space-y-6">
              {isNewArrival && (
                <span className="brand-badge-new">New Arrival</span>
              )}

              <h1 className="brand-display text-3xl font-semibold md:text-4xl">
                {product.name}
              </h1>

              {product.rating_count > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < Math.round(parseFloat(product.average_rating))
                            ? "text-[color:var(--brand-accent)]"
                            : "text-[color:var(--brand-border)]"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-[color:var(--brand-muted)]">
                    ({product.rating_count} reviews)
                  </span>
                </div>
              )}

              <PriceDisplay
                price={product.price}
                regularPrice={product.regular_price}
                salePrice={product.sale_price}
                onSale={product.on_sale}
                size="lg"
              />

              {cleanShortDescription && (
                <p className="brand-copy max-w-lg text-sm md:text-base">
                  {cleanShortDescription}
                </p>
              )}

              <div className="brand-divider" />

              {/* Variable Product Handler (Client Component) */}
              {product.type === "variable" && variations.length > 0 ? (
                <ProductDetailClient product={product} variations={variations} />
              ) : (
                <AddToCartButton product={product} />
              )}

              <StockBadge product={product} />

              <div className="brand-divider" />

              {/* Trust row */}
              <div className="grid gap-4 sm:grid-cols-3">
                {trustPoints.map((point) => (
                  <div key={point.label} className="flex items-start gap-2">
                    <point.icon className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-accent)]" />
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--brand-ink)]">
                        {point.label}
                      </p>
                      <p className="text-xs text-[color:var(--brand-muted)]">
                        {point.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="home-reveal" style={{ animationDelay: "140ms" }}>
            <ProductTabs tabs={tabs} />
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div className="home-reveal space-y-5" style={{ animationDelay: "200ms" }}>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="brand-kicker">Complete the look</p>
                  <h2 className="brand-display text-3xl font-semibold">
                    You may also like
                  </h2>
                </div>
                <Link
                  href="/shop"
                  className="brand-link inline-flex items-center gap-2 text-sm font-semibold"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <ProductGrid products={relatedProducts} columns={4} />
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
