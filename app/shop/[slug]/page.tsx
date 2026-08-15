import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";

import {
  getProductBySlug,
  getProductVariations,
  getProductReviews,
  getRelatedProducts,
  getAllProductSlugs,
} from "@/lib/woocommerce";

import { Section, Container, Prose } from "@/components/craft";
import {
  ProductGallery,
  PriceDisplay,
  StockBadge,
  AddToCartButton,
  ProductGrid,
} from "@/components/shop";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductDetailClient } from "./product-detail-client";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

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

  return (
    <div className={`${displayFont.variable} bg-[#f4f7fb] text-slate-900 dark:bg-slate-950 dark:text-slate-100`}>
      <Section className="py-0">
        <Container className="max-w-6xl px-4 sm:px-6 lg:px-10">
          <div className="space-y-10 py-8 md:space-y-14 md:py-12">
          {/* Breadcrumb */}
          <nav className="home-reveal flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <Link href="/shop" className="hover:text-slate-900 dark:hover:text-slate-100">
              Shop
            </Link>
            <span>/</span>
            {product.categories[0] && (
              <>
                <Link
                  href={`/shop?category=${product.categories[0].slug}`}
                  className="hover:text-slate-900 dark:hover:text-slate-100"
                >
                  {product.categories[0].name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-slate-900 dark:text-slate-100">{product.name}</span>
          </nav>

          {/* Product Details */}
          <div className="home-reveal grid gap-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_70px_-55px_rgba(15,23,42,0.5)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_20px_70px_-55px_rgba(2,6,23,0.95)] md:p-8 lg:grid-cols-2 lg:gap-12" style={{ animationDelay: "120ms" }}>
            {/* Gallery */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/50 sm:p-4">
              <ProductGallery images={product.images} productName={product.name} />
            </div>

            {/* Info */}
            <div className="space-y-6">
              {/* Categories */}
              {product.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.slug}`}
                    >
                      <Badge className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700" variant="outline">
                        {cat.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating_count > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < Math.round(parseFloat(product.average_rating))
                            ? "text-amber-500"
                            : "text-slate-300 dark:text-slate-600"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    ({product.rating_count} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                <PriceDisplay
                  price={product.price}
                  regularPrice={product.regular_price}
                  salePrice={product.sale_price}
                  onSale={product.on_sale}
                  size="lg"
                />
              </div>

              {/* Stock */}
              <StockBadge product={product} showQuantity />

              {/* Short Description */}
              {product.short_description && (
                <Prose>
                  <div className="text-slate-600 dark:text-slate-300">
                    {product.short_description.replace(/<[^>]*>/g, "")}
                  </div>
                </Prose>
              )}

              <Separator className="bg-slate-200 dark:bg-slate-700" />

              {/* Variable Product Handler (Client Component) */}
              {product.type === "variable" && variations.length > 0 ? (
                <ProductDetailClient product={product} variations={variations} />
              ) : (
                <AddToCartButton
                  product={product}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
                />
              )}

              <Separator className="bg-slate-200 dark:bg-slate-700" />

              {/* Product Meta */}
              <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {product.sku && (
                  <p>
                    <span className="text-slate-500 dark:text-slate-400">SKU:</span>{" "}
                    {product.sku}
                  </p>
                )}
                {product.tags.length > 0 && (
                  <p>
                    <span className="text-slate-500 dark:text-slate-400">Tags:</span>{" "}
                    {product.tags.map((tag, i) => (
                      <span key={tag.id}>
                        <Link
                          href={`/shop?tag=${tag.slug}`}
                          className="underline-offset-4 hover:underline"
                        >
                          {tag.name}
                        </Link>
                        {i < product.tags.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Full Description */}
          {product.description && (
            <div className="home-reveal space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900" style={{ animationDelay: "170ms" }}>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Description
              </h2>
              <Prose>
                <div className="text-slate-600 dark:text-slate-300">
                  {product.description.replace(/<[^>]*>/g, "")}
                </div>
              </Prose>
            </div>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="home-reveal space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900" style={{ animationDelay: "220ms" }}>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Reviews ({reviews.length})
              </h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900 dark:text-slate-100">{review.reviewer}</span>
                        {review.verified && (
                          <Badge className="rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300" variant="outline">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < review.rating
                                ? "text-amber-500"
                                : "text-slate-300 dark:text-slate-600"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      {review.review.replace(/<[^>]*>/g, "")}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(review.date_created).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="home-reveal space-y-6" style={{ animationDelay: "270ms" }}>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Related Products
              </h2>
              <ProductGrid products={relatedProducts} columns={4} />
            </div>
          )}
        </div>
        </Container>
      </Section>
    </div>
  );
}
