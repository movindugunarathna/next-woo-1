import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/lib/woocommerce.d";
import { cn } from "@/lib/utils";
import { formatPrice, calculateDiscountPercentage, isProductInStock } from "@/lib/woocommerce";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const inStock = isProductInStock(product);
  const discountPercentage = product.on_sale
    ? calculateDiscountPercentage(product.regular_price, product.sale_price)
    : 0;

  const primaryImage = product.images[0];

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-[color:var(--brand-border)] bg-[color:var(--brand-surface)]",
        "transition-all duration-300 hover:-translate-y-0.5"
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-[color:var(--brand-card)]">
        {primaryImage?.src ? (
          <Image
            src={primaryImage.src}
            alt={primaryImage.alt || product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-muted-foreground">
            No image
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.on_sale && discountPercentage > 0 && (
            <Badge variant="destructive">-{discountPercentage}%</Badge>
          )}
          {product.featured && <Badge variant="secondary">Featured</Badge>}
          {!inStock && <Badge variant="outline">Out of Stock</Badge>}
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4">
        {/* Category */}
        {product.categories[0] && (
          <span className="brand-kicker text-[0.65rem]">
            {product.categories[0].name}
          </span>
        )}

        {/* Name */}
        <h3 className="line-clamp-2 text-[0.98rem] font-semibold">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto">
          {product.on_sale ? (
            <>
              <span className="font-semibold text-destructive">
                {formatPrice(product.sale_price)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.regular_price)}
              </span>
            </>
          ) : (
            <span className="font-semibold text-[color:var(--brand-ink)]">
              {product.price ? formatPrice(product.price) : "Price on request"}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.rating_count > 0 && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="text-yellow-500">★</span>
            <span>{product.average_rating}</span>
            <span>({product.rating_count})</span>
          </div>
        )}
      </div>
    </Link>
  );
}
