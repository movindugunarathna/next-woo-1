"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  Bot,
  Mail,
  MessageCircle,
  Send,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  findSupportAnswer,
  supportSuggestions,
} from "@/lib/support-faq";
import {
  buildEmailLink,
  buildWhatsAppLink,
  supportContact,
} from "@/lib/support-contact";

interface ChatMessage {
  id: number;
  role: "assistant" | "user";
  content: string;
  needsHandoff?: boolean;
  originalQuestion?: string;
}

const welcomeMessage: ChatMessage = {
  id: 1,
  role: "assistant",
  content:
    "Hi, I’m the Calviz assistant. Ask me about delivery, orders, sizing, payments, exchanges, or stock.",
};

export function SupportChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [isThinking, setIsThinking] = useState(false);
  const nextId = useRef(2);
  const responseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    inputRef.current?.focus();
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  useEffect(() => {
    return () => {
      if (responseTimer.current) clearTimeout(responseTimer.current);
    };
  }, []);

  const createHandoffLinks = useMemo(() => {
    return (question = "") => {
      const context = `Page: ${pathname}`;
      const message = [
        "Hi Calviz, I need some help.",
        question ? `Question: ${question}` : "",
        context,
      ]
        .filter(Boolean)
        .join("\n");

      return {
        whatsapp: buildWhatsAppLink(message),
        email: buildEmailLink("Calviz store support", message),
      };
    };
  }, [pathname]);

  const sendMessage = (question: string) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isThinking) return;

    const answer = findSupportAnswer(trimmedQuestion);
    const userMessage: ChatMessage = {
      id: nextId.current++,
      role: "user",
      content: trimmedQuestion,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsThinking(true);

    responseTimer.current = setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: "assistant",
          content: answer.answer,
          needsHandoff: answer.confidence < 0.5,
          originalQuestion: trimmedQuestion,
        },
      ]);
      setIsThinking(false);
      responseTimer.current = null;
    }, 450);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  const defaultLinks = createHandoffLinks();
  const hasUserMessages = messages.some((message) => message.role === "user");

  return (
    <>
      <Button
        type="button"
        size="icon"
        onClick={() => setIsOpen((open) => !open)}
        className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full border border-white/20 bg-black text-white shadow-2xl hover:bg-neutral-800 dark:border-black/20 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        aria-label={isOpen ? "Close support chat" : "Open support chat"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <section
          role="dialog"
          aria-modal="false"
          aria-labelledby="support-chat-title"
          className="fixed inset-x-3 bottom-24 z-40 flex h-[min(640px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-2xl border border-[color:var(--brand-border)] bg-[color:var(--brand-surface)] shadow-2xl sm:left-auto sm:right-5 sm:w-[390px]"
        >
          <header className="flex items-center justify-between border-b border-[color:var(--brand-border)] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--brand-ink)] text-[color:var(--brand-on-accent)]">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h2 id="support-chat-title" className="text-sm font-semibold">
                  Calviz assistant
                </h2>
                <p className="text-xs text-[color:var(--brand-muted)]">
                  FAQ help · human handoff available
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-9 w-9 rounded-full"
              aria-label="Close support chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </header>

          <ScrollArea className="min-h-0 flex-1">
            <div
              className="space-y-4 p-4"
              aria-live="polite"
              aria-busy={isThinking}
            >
              {messages.map((message) => {
                const links = createHandoffLinks(message.originalQuestion);

                return (
                  <div
                    key={message.id}
                    className={`flex items-end gap-2 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[color:var(--brand-border)]">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <div className="max-w-[82%] space-y-3">
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          message.role === "user"
                            ? "rounded-br-sm bg-[color:var(--brand-ink)] text-[color:var(--brand-on-accent)]"
                            : "rounded-bl-sm bg-[color:var(--brand-card)] text-[color:var(--brand-ink)]"
                        }`}
                      >
                        {message.content}
                      </div>

                      {message.needsHandoff && (
                        <div className="rounded-xl border border-[color:var(--brand-border)] p-3">
                          <p className="text-xs font-semibold">
                            Ask the Calviz team
                          </p>
                          <p className="mb-2 mt-0.5 text-xs text-[color:var(--brand-muted)]">
                            {supportContact.whatsappDisplay} ·{" "}
                            {supportContact.email}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {links.whatsapp && (
                              <a
                                href={links.whatsapp}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brand-ink)] px-3 py-2 text-xs font-semibold text-[color:var(--brand-on-accent)]"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                                WhatsApp
                              </a>
                            )}
                            <a
                              href={links.email}
                              className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--brand-border)] px-3 py-2 text-xs font-semibold"
                            >
                              <Mail className="h-3.5 w-3.5" />
                              Email
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                    {message.role === "user" && (
                      <div className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[color:var(--brand-border)]">
                        <UserRound className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isThinking && (
                <div className="flex items-end gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--brand-border)]">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-[color:var(--brand-card)] px-4 py-3">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className="h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--brand-muted)]"
                        style={{ animationDelay: `${dot * 120}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {!hasUserMessages && (
                <div className="flex flex-wrap gap-2 pl-9">
                  {supportSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => sendMessage(suggestion)}
                      className="rounded-full border border-[color:var(--brand-border)] px-3 py-2 text-left text-xs transition-colors hover:border-[color:var(--brand-muted)]"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>
          </ScrollArea>

          <footer className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface)]">
            <form onSubmit={handleSubmit} className="flex gap-2 p-3">
              <Input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask a question..."
                maxLength={500}
                disabled={isThinking}
                aria-label="Message"
                className="h-11"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isThinking}
                className="h-11 w-11 shrink-0 rounded-xl"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>

            <div className="flex items-center justify-center gap-4 px-4 pb-3 text-xs text-[color:var(--brand-muted)]">
              {defaultLinks.whatsapp && (
                <a
                  href={defaultLinks.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[color:var(--brand-ink)]"
                >
                  <MessageCircle className="h-3 w-3" />
                  {supportContact.whatsappDisplay}
                </a>
              )}
              <a
                href={defaultLinks.email}
                className="inline-flex items-center gap-1 hover:text-[color:var(--brand-ink)]"
              >
                <Mail className="h-3 w-3" />
                Email the team
              </a>
            </div>
          </footer>
        </section>
      )}
    </>
  );
}
