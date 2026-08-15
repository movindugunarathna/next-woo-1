"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ProductTab {
  id: string;
  label: string;
  content: ReactNode;
}

interface ProductTabsProps {
  tabs: ProductTab[];
}

export function ProductTabs({ tabs }: ProductTabsProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);

  if (tabs.length === 0) {
    return null;
  }

  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-6 border-b border-[color:var(--brand-border)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveId(tab.id)}
            className={cn(
              "-mb-px border-b-2 pb-3 text-sm font-semibold transition-colors",
              activeTab.id === tab.id
                ? "border-[color:var(--brand-accent)] text-[color:var(--brand-ink)]"
                : "border-transparent text-[color:var(--brand-muted)] hover:text-[color:var(--brand-ink)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{activeTab.content}</div>
    </div>
  );
}
