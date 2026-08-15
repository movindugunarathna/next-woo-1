"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useTransition } from "react";

import type { ProductCategory, ProductTag } from "@/lib/woocommerce.d";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFiltersProps {
  categories: ProductCategory[];
  tags: ProductTag[];
  currentCategory?: string;
  currentTag?: string;
  currentSearch?: string;
  currentSort?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
}

export function ProductFilters({
  categories,
  tags,
  currentCategory,
  currentTag,
  currentSearch,
  currentSort,
  currentMinPrice,
  currentMaxPrice,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilters = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // Reset to page 1 when filters change
      params.delete("page");

      startTransition(() => {
        router.push(`/shop?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  // Debounce free-text inputs so a route push happens once the user pauses,
  // not on every keystroke.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedUpdate = useCallback(
    (updates: Record<string, string | undefined>) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => updateFilters(updates), 400);
    },
    [updateFilters]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const clearFilters = () => {
    startTransition(() => {
      router.push("/shop");
    });
  };

  const activeFilterCount = [
    currentCategory,
    currentTag,
    currentSearch,
    currentMinPrice,
    currentMaxPrice,
  ].filter(Boolean).length;

  const pillClass = (isActive: boolean) =>
    cn(
      "shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
      isActive
        ? "border-[color:var(--brand-ink)] bg-[color:var(--brand-ink)] text-[color:var(--brand-on-accent)]"
        : "border-[color:var(--brand-border)] text-[color:var(--brand-ink)] hover:border-[color:var(--brand-muted)]"
    );

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--brand-border)] bg-[color:var(--brand-surface)]">
      {/* Controls row */}
      <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
        <div className="md:w-64">
          <Label htmlFor="search" className="sr-only">
            Search products
          </Label>
          <Input
            id="search"
            type="search"
            placeholder="Search products..."
            defaultValue={currentSearch}
            onChange={(e) =>
              debouncedUpdate({ search: e.target.value || undefined })
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="brand-kicker shrink-0">Price</span>
          <Input
            type="number"
            placeholder="Min"
            min={0}
            defaultValue={currentMinPrice}
            onChange={(e) =>
              debouncedUpdate({ min_price: e.target.value || undefined })
            }
            aria-label="Minimum price"
            className="w-24"
          />
          <span className="text-[color:var(--brand-muted)]">–</span>
          <Input
            type="number"
            placeholder="Max"
            min={0}
            defaultValue={currentMaxPrice}
            onChange={(e) =>
              debouncedUpdate({ max_price: e.target.value || undefined })
            }
            aria-label="Maximum price"
            className="w-24"
          />
        </div>

        <div className="flex items-center gap-3 md:ml-auto">
          <Select
            value={currentSort || "default"}
            onValueChange={(value) =>
              updateFilters({ sort: value === "default" ? undefined : value })
            }
          >
            <SelectTrigger className="w-full md:w-52" aria-label="Sort by">
              <SelectValue placeholder="Default sorting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default sorting</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="rating">Average rating</SelectItem>
              <SelectItem value="date">Latest</SelectItem>
              <SelectItem value="price">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              disabled={isPending}
              className="shrink-0 whitespace-nowrap text-xs font-semibold underline underline-offset-4 disabled:opacity-50"
            >
              Clear all ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Taxonomy row — scrolls sideways instead of wrapping into a tall block */}
      {(categories.length > 0 || tags.length > 0) && (
        <div className="flex items-center gap-2 overflow-x-auto border-t border-[color:var(--brand-border)] px-4 py-3 no-scrollbar">
          {categories.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => updateFilters({ category: undefined })}
                className={pillClass(!currentCategory)}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => updateFilters({ category: category.slug })}
                  className={pillClass(currentCategory === category.slug)}
                >
                  {category.name}
                  <span className="ml-1.5 opacity-60">{category.count}</span>
                </button>
              ))}
            </>
          )}

          {categories.length > 0 && tags.length > 0 && (
            <span className="mx-1 h-5 w-px shrink-0 bg-[color:var(--brand-border)]" />
          )}

          {tags.map((tag) => {
            const isActive = currentTag === tag.slug;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() =>
                  updateFilters({ tag: isActive ? undefined : tag.slug })
                }
                className={pillClass(isActive)}
              >
                #{tag.name}
              </button>
            );
          })}
        </div>
      )}

      {isPending && (
        <div className="border-t border-[color:var(--brand-border)] px-4 py-2 text-xs text-[color:var(--brand-muted)]">
          Updating results...
        </div>
      )}
    </div>
  );
}
