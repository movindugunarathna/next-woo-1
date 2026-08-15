"use client";

import { useState } from "react";
import { ShoppingBag, Plus, Minus, Loader2 } from "lucide-react";

import type { Product, ProductVariation } from "@/lib/woocommerce.d";
import { parsePriceValue } from "@/lib/woocommerce";
import { useCart } from "@/components/shop/cart-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: Product;
  variation?: ProductVariation | null;
  className?: string;
  showQuantity?: boolean;
}

export function AddToCartButton({
  product,
  variation,
  className,
  showQuantity = true,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // For variable products, require a variation
  const isVariable = product.type === "variable";
  const needsVariation = isVariable && !variation;

  // Check stock
  const checkableItem = variation || product;
  const inStock =
    checkableItem.stock_status === "instock" ||
    checkableItem.stock_status === "onbackorder";

  const maxQuantity = checkableItem.stock_quantity || 99;

  const handleAddToCart = async () => {
    if (needsVariation || !inStock) return;

    setIsAdding(true);

    try {
      const rawPrice =
        variation?.price || product.price || product.sale_price || product.regular_price;
      const normalizedPrice = parsePriceValue(rawPrice).toFixed(2);

      await addItem({
        productId: product.id,
        variationId: variation?.id,
        quantity,
        name: product.name + (variation ? ` - ${variation.attributes.map((a) => a.option).join(", ")}` : ""),
        price: normalizedPrice,
        image: (variation?.image || product.images[0])?.src,
        attributes: variation?.attributes,
      });

      // Reset quantity after adding
      setQuantity(1);
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  if (!inStock) {
    return (
      <Button disabled size="lg" className={cn("w-full rounded-full", className)}>
        Out of Stock
      </Button>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Quantity Selector */}
      {showQuantity && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[color:var(--brand-muted)]">
            Quantity
          </span>
          <div className="flex items-center rounded-full border border-[color:var(--brand-border)]">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-[color:var(--brand-card)]"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-10 text-center font-medium">{quantity}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-[color:var(--brand-card)]"
              onClick={incrementQuantity}
              disabled={quantity >= maxQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={needsVariation || isAdding}
        className="brand-btn-primary h-12 w-full rounded-full text-sm"
      >
        {isAdding ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : needsVariation ? (
          "Select options"
        ) : (
          <>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  );
}
