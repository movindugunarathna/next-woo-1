"use client";

import { useState, useEffect } from "react";

import type { Product, ProductVariation, ProductDefaultAttribute } from "@/lib/woocommerce.d";
import { cn } from "@/lib/utils";

interface VariationSelectorProps {
  product: Product;
  variations: ProductVariation[];
  onVariationChange: (variation: ProductVariation | null) => void;
}

export function VariationSelector({
  product,
  variations,
  onVariationChange,
}: VariationSelectorProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >(() => {
    // Initialize with default attributes
    const defaults: Record<string, string> = {};
    product.default_attributes.forEach((attr) => {
      defaults[attr.name.toLowerCase()] = attr.option;
    });
    return defaults;
  });

  // Find matching variation when attributes change
  useEffect(() => {
    const matchingVariation = variations.find((variation) => {
      return variation.attributes.every((attr) => {
        const selectedValue = selectedAttributes[attr.name.toLowerCase()];
        // Empty option means "any" in WooCommerce
        return !attr.option || selectedValue === attr.option;
      });
    });

    onVariationChange(matchingVariation || null);
  }, [selectedAttributes, variations, onVariationChange]);

  const handleAttributeChange = (attributeName: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName.toLowerCase()]: value,
    }));
  };

  // Get available options for an attribute considering other selections
  const getAvailableOptions = (attributeName: string): string[] => {
    const attrLower = attributeName.toLowerCase();
    const otherSelections = { ...selectedAttributes };
    delete otherSelections[attrLower];

    // Find variations that match current other selections
    const matchingVariations = variations.filter((variation) => {
      return Object.entries(otherSelections).every(([name, value]) => {
        const varAttr = variation.attributes.find(
          (a) => a.name.toLowerCase() === name
        );
        return !varAttr?.option || varAttr.option === value;
      });
    });

    // Get unique options for this attribute from matching variations
    const options = new Set<string>();
    matchingVariations.forEach((variation) => {
      const attr = variation.attributes.find(
        (a) => a.name.toLowerCase() === attrLower
      );
      if (attr?.option) {
        options.add(attr.option);
      }
    });

    return Array.from(options);
  };

  if (product.type !== "variable" || product.attributes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-5">
      {product.attributes
        .filter((attr) => attr.variation)
        .map((attribute) => {
          const availableOptions = getAvailableOptions(attribute.name);
          const selectedValue = selectedAttributes[attribute.name.toLowerCase()];

          return (
            <div key={attribute.id} className="space-y-2">
              <p className="text-sm font-semibold text-[color:var(--brand-ink)]">
                {attribute.name}
                {selectedValue && (
                  <span className="ml-1.5 font-normal text-[color:var(--brand-muted)]">
                    {selectedValue}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {attribute.options.map((option) => {
                  const isAvailable = availableOptions.includes(option);
                  const isSelected = selectedValue === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => handleAttributeChange(attribute.name, option)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        isSelected
                          ? "border-[color:var(--brand-accent)] bg-[color:var(--brand-accent)] text-[#fffaf2]"
                          : "border-[color:var(--brand-border)] bg-transparent text-[color:var(--brand-ink)] hover:border-[color:var(--brand-muted)]",
                        !isAvailable && "cursor-not-allowed opacity-40 line-through"
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
}
