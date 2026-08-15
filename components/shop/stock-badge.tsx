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

  const dotColor = !inStock
    ? "bg-red-500"
    : isBackorder
      ? "bg-blue-500"
      : isLowStock
        ? "bg-amber-500"
        : "bg-emerald-500";

  const textColor = !inStock
    ? "text-red-600 dark:text-red-400"
    : isBackorder
      ? "text-blue-600 dark:text-blue-400"
      : isLowStock
        ? "text-amber-600 dark:text-amber-400"
        : "text-emerald-600 dark:text-emerald-400";

  return (
    <div className={cn("flex items-center gap-2 text-sm font-medium", textColor, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
      {message}
    </div>
  );
}
