"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

const defaultFAQs: FAQItem[] = [
  {
    question: "How do I book an activity?",
    answer:
      "Select an activity, choose your preferred date and number of guests, then follow the checkout flow to complete your booking.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Most activities allow free cancellation up to 24 hours before the start time. Specific policies are listed on each activity's page.",
  },
  {
    question: "Are activities suitable for children or seniors?",
    answer:
      "Activity suitability varies. Each listing includes an accessibility/suitability note — contact us if you need specific guidance.",
  },
  {
    question: "How do I request a custom itinerary or group booking?",
    answer:
      "For group bookings or custom itineraries, contact our support team with your dates and requirements and we'll assist with a tailored plan.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit cards and popular digital wallets. Payment options appear during checkout and may vary by provider.",
  },
];

type Message = {
  id: string;
  role: "user" | "assistant";
  text?: string;
  kind?: "text" | "typing";
};

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function FAQSection({ items }: { items?: FAQItem[] }) {
  const faqItems = items ?? defaultFAQs;

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: uid(),
      role: "assistant",
      kind: "text",
      text: "Hello! I'm here to help with any questions about bookings, cancellations, or travel planning.",
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const askedQuestions = useMemo(() => {
    const asked = new Set<string>();
    for (const m of messages) {
      if (m.role === "user" && m.text) asked.add(m.text);
    }
    return asked;
  }, [messages]);

  useEffect(() => {
    if (containerRef.current) {
      try {
        containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
      } catch {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages]);

  const clearChat = () => {
    setIsTyping(false);
    setMessages([
      {
        id: uid(),
        role: "assistant",
        kind: "text",
        text: "Chat cleared. Feel free to ask another question.",
      },
    ]);
  };

  const ask = (item: FAQItem) => {
    if (isTyping) return;

    setIsTyping(true);
    const typingId = uid();

    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", kind: "text", text: item.question },
      { id: typingId, role: "assistant", kind: "typing" },
    ]);

    window.setTimeout(() => {
      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => m.id !== typingId);
        return [
          ...withoutTyping,
          { id: uid(), role: "assistant", kind: "text", text: item.answer },
        ];
      });
      setIsTyping(false);
    }, 600);
  };

  return (
    <section id="faq" className="bg-[var(--bg)] py-24 md:py-32">
      <div className="container-editorial">
        {/* Header */}
        <div className="text-center mb-14 md:mb-20 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface-2)] rounded-full border border-[var(--border)] mb-6">
            <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-3)]">
              Support
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--text-1)] leading-tight mb-5">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-[var(--text-2)]">
            Quick answers to common questions. Select a topic below to get started.
          </p>
        </div>

        {/* Chat Interface */}
        <div className="max-w-2xl mx-auto">
          <div className="border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface-1)] shadow-xl shadow-black/10">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)] bg-gradient-to-r from-[var(--surface-1)] to-[var(--surface-2)]">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
                    <svg className="h-5 w-5 text-[var(--bg)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[var(--success)] rounded-full border-2 border-[var(--surface-1)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-1)]">Support Assistant</p>
                  <p className="text-xs text-[var(--success)]">Online • Instant replies</p>
                </div>
              </div>

              <button
                type="button"
                onClick={clearChat}
                className="text-xs font-medium text-[var(--text-3)] hover:text-[var(--primary)] transition-colors duration-300 px-3 py-1.5 rounded-full hover:bg-[var(--surface-2)]"
              >
                Clear chat
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={containerRef} 
              className="px-6 py-6 max-h-[420px] overflow-y-auto bg-gradient-to-b from-[var(--bg)] to-[var(--surface-1)]"
            >
              <div className="space-y-4">
                {messages.map((m) => {
                  const isUser = m.role === "user";

                  return (
                    <div
                      key={m.id}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[85%] rounded-2xl px-5 py-3.5
                          ${isUser
                            ? "bg-[var(--primary)] text-[var(--bg)]"
                            : "bg-[var(--surface-1)] text-[var(--text-1)] border border-[var(--border)]"
                          }
                        `}
                      >
                        {m.kind === "typing" ? (
                          <div className="flex items-center gap-1.5 py-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-3)] animate-pulse" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-3)] animate-pulse [animation-delay:150ms]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-3)] animate-pulse [animation-delay:300ms]" />
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed">{m.text}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            </div>

            {/* Quick Questions */}
            <div className="border-t border-[var(--border)] bg-[var(--surface-1)] px-6 py-5">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--primary)] mb-4">
                Common Questions
              </p>

              <div className="flex flex-wrap gap-2.5">
                {faqItems.map((item, idx) => {
                  const disabled = isTyping;
                  const alreadyAsked = askedQuestions.has(item.question);

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => ask(item)}
                      disabled={disabled}
                      className={`
                        px-4 py-2.5 text-xs rounded-xl border transition-all duration-300
                        ${disabled
                          ? "border-[var(--border)] text-[var(--text-3)] cursor-not-allowed"
                          : alreadyAsked
                          ? "border-[var(--primary)]/30 text-[var(--primary)]/60 bg-[var(--primary)]/5"
                          : "border-[var(--border)] text-[var(--text-2)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 hover:shadow-lg hover:shadow-[var(--primary)]/5"
                        }
                      `}
                    >
                      {item.question}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
