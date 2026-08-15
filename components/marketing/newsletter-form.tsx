"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="brand-copy flex items-center gap-2 text-sm">
        <Check className="h-4 w-4 text-[var(--brand-accent)]" />
        You&apos;re on the list — watch your inbox for the next drop.
      </div>
    );
  }

  return (
    <form
      className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <Input
        type="email"
        required
        placeholder="you@email.com"
        aria-label="Email address"
        className="h-11 rounded-full border-[color:var(--brand-border)] bg-[color:var(--brand-surface)] px-5"
      />
      <Button
        type="submit"
        className="brand-btn-primary h-11 shrink-0 rounded-full px-6 text-sm"
      >
        Join the list
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
