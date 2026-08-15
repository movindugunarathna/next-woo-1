import { formatPrice, calculateDiscountPercentage } from "@/lib/woocommerce";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: string;
  regularPrice: string;
  salePrice: string;
  onSale: boolean;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
}

export function PriceDisplay({
  price,
  regularPrice,
  salePrice,
  onSale,
  size = "md",
  showBadge = true,
}: PriceDisplayProps) {
  const discountPercentage = onSale
    ? calculateDiscountPercentage(regularPrice, salePrice)
    : 0;

  const sizeClasses = {
    sm: {
      price: "text-base",
      original: "text-sm",
    },
    md: {
      price: "text-xl",
      original: "text-base",
    },
    lg: {
      price: "text-3xl",
      original: "text-lg",
    },
  };

  if (!price && !regularPrice) {
    return (
      <span className={cn("font-semibold", sizeClasses[size].price)}>
        Price on request
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {onSale ? (
        <>
          <span
            className={cn(
              "brand-display font-semibold text-[color:var(--brand-ink)]",
              sizeClasses[size].price
            )}
          >
            {formatPrice(salePrice)}
          </span>
          <span
            className={cn(
              "text-[color:var(--brand-muted)] line-through",
              sizeClasses[size].original
            )}
          >
            {formatPrice(regularPrice)}
          </span>
          {showBadge && discountPercentage > 0 && (
            <span className="brand-badge-sale">
              Save {discountPercentage}%
            </span>
          )}
        </>
      ) : (
        <span
          className={cn(
            "brand-display font-semibold text-[color:var(--brand-ink)]",
            sizeClasses[size].price
          )}
        >
          {formatPrice(price || regularPrice)}
        </span>
      )}
    </div>
  );
}
