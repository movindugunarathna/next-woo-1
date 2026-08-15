export interface SupportAnswer {
  answer: string;
  confidence: number;
  topic?: string;
}

interface FaqEntry {
  topic: string;
  keywords: string[];
  phrases?: string[];
  answer: string;
}

const faqEntries: FaqEntry[] = [
  {
    topic: "delivery",
    keywords: ["delivery", "deliver", "shipping", "ship", "courier", "islandwide"],
    phrases: ["how long", "delivery time", "shipping cost"],
    answer:
      "We deliver islandwide in Sri Lanka. Delivery charges and the available shipping option are shown during checkout. Once your order is dispatched, use the tracking details in your order update.",
  },
  {
    topic: "order tracking",
    keywords: ["track", "tracking", "order", "status", "parcel", "package"],
    phrases: ["where is my order", "track my order", "order status"],
    answer:
      "You can review your order from the Account → Orders page. If the tracking update is missing or delayed, send the team your order number through WhatsApp or email and they can check it.",
  },
  {
    topic: "payment",
    keywords: ["payment", "pay", "card", "visa", "mastercard", "gateway", "checkout"],
    phrases: ["payment method", "cash on delivery", "card payment"],
    answer:
      "Available payment methods are shown securely at checkout and are processed by the store’s configured payment provider. The shop does not collect card details in this chat.",
  },
  {
    topic: "sizing",
    keywords: ["size", "sizing", "fit", "measurement", "measurements", "small", "medium", "large"],
    phrases: ["size guide", "what size", "true to size", "oversized fit"],
    answer:
      "Check the product description and available variation options for its fit and sizes. If you share the product name and your usual size with the team, they can help you choose before ordering.",
  },
  {
    topic: "returns and exchanges",
    keywords: ["return", "returns", "exchange", "refund", "wrong", "damaged"],
    phrases: ["return policy", "exchange size", "money back"],
    answer:
      "Return or exchange eligibility can depend on the item and its condition. Keep the item unworn with its packaging, then contact the team with your order number so they can confirm the next step.",
  },
  {
    topic: "stock",
    keywords: ["stock", "available", "availability", "restock", "sold", "inventory"],
    phrases: ["out of stock", "back in stock", "sold out"],
    answer:
      "Current availability is shown on each product page. For a sold-out size or restock estimate, send the product name and size to the team and they can check the latest inventory.",
  },
  {
    topic: "products",
    keywords: ["product", "products", "shop", "clothes", "clothing", "tee", "shirt"],
    phrases: ["new arrivals", "best sellers", "find product"],
    answer:
      "Browse the Shop page to search and filter the current collection by category, price, and popularity. Open a product to see its images, price, stock, and available options.",
  },
];

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "can",
  "do",
  "for",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "the",
  "to",
  "what",
  "with",
  "you",
]);

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findSupportAnswer(question: string): SupportAnswer {
  const normalizedQuestion = normalize(question);
  const questionTokens = new Set(
    normalizedQuestion.split(" ").filter((word) => word && !stopWords.has(word))
  );

  let bestMatch: { entry: FaqEntry; score: number } | undefined;

  for (const entry of faqEntries) {
    const keywordMatches = entry.keywords.filter((keyword) =>
      questionTokens.has(keyword)
    ).length;
    const phraseMatches = (entry.phrases ?? []).filter((phrase) =>
      normalizedQuestion.includes(phrase)
    ).length;
    const score = keywordMatches + phraseMatches * 2;

    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { entry, score };
    }
  }

  if (!bestMatch || bestMatch.score === 0) {
    return {
      answer:
        "I’m not confident I have the right answer. The Calviz team can help directly through WhatsApp or email.",
      confidence: 0,
    };
  }

  return {
    answer: bestMatch.entry.answer,
    confidence: Math.min(1, bestMatch.score / 2),
    topic: bestMatch.entry.topic,
  };
}

export const supportSuggestions = [
  "How does delivery work?",
  "How can I track my order?",
  "Can I exchange a size?",
  "Help me choose a size",
];
