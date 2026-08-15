import type { Product } from "@/lib/woocommerce.d";
import { isProductInStock, getProductStockMessage } from "@/lib/woocommerce";
import { cn } from "@/lib/utils";

interface StockBadgeProps {
  product: Product;
  showQuantity?: boolean;
  className?: string;
}

export function StockBadge({ product, className }: StockBadgeProps) {
  const inStock = isProductInStock(product);
  const message = getProductStockMessage(product);

  const isLowStock =
    product.manage_stock &&
    product.stock_quantity !== null &&
    product.stock_quantity <= (product.low_stock_amount || 3) &&
    product.stock_quantity > 0;

  const isBackorder = product.stock_status === "onbackorder";

  // Monochrome states: the dot carries the signal through fill vs. outline
  // and the copy itself already names the state, so no hue is needed.
  const dotStyle = !inStock
    ? "border border-[color:var(--brand-muted)] bg-transparent"
    : isBackorder
      ? "bg-[color:var(--brand-muted)]"
      : isLowStock
        ? "bg-[color:var(--brand-ink)] ring-2 ring-[color:var(--brand-border)]"
        : "bg-[color:var(--brand-ink)]";

  const textStyle = inStock
    ? "text-[color:var(--brand-ink)]"
    : "text-[color:var(--brand-muted)]";

  return (
    <div className={cn("flex items-center gap-2 text-sm font-medium", textStyle, className)}>
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotStyle)} />
      {message}
    </div>
  );
}
