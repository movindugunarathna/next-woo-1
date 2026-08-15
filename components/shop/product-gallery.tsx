"use client";

import { useState } from "react";
import Image from "next/image";

import type { ProductImage } from "@/lib/woocommerce.d";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="brand-image-frame flex aspect-square items-center justify-center text-sm text-[color:var(--brand-muted)]">
        No image available
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-visible">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Show image ${index + 1}`}
              className={cn(
                "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border bg-[color:var(--brand-card)] transition-colors sm:h-20 sm:w-20",
                selectedIndex === index
                  ? "border-[color:var(--brand-accent)]"
                  : "border-[color:var(--brand-border)] hover:border-[color:var(--brand-muted)]"
              )}
            >
              <Image
                src={image.src}
                alt={image.alt || `${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="brand-image-frame relative aspect-square flex-1">
        <Image
          src={selectedImage.src}
          alt={selectedImage.alt || productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  );
}
