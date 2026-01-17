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
    <section id="faq" className="bg-[var(--bg)] py-20 md:py-28">
      <div className="container-editorial">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-3)] mb-3">
            Support
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--text-1)] leading-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-[var(--text-2)]">
            Quick answers to common questions. Select a topic below to get started.
          </p>
        </div>

        {/* Chat Interface */}
        <div className="max-w-2xl mx-auto">
          <div className="border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--surface-1)]">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-[var(--primary)] flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-1)]">Support Assistant</p>
                  <p className="text-xs text-[var(--text-3)]">Instant replies</p>
                </div>
              </div>

              <button
                type="button"
                onClick={clearChat}
                className="text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors duration-200"
              >
                Clear chat
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={containerRef} 
              className="px-5 py-5 max-h-[400px] overflow-y-auto bg-[var(--bg)]"
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
                          max-w-[85%] rounded-lg px-4 py-3
                          ${isUser
                            ? "bg-[var(--primary)] text-white"
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
            <div className="border-t border-[var(--border)] bg-[var(--surface-1)] px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-3)] mb-3">
                Common Questions
              </p>

              <div className="flex flex-wrap gap-2">
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
                        px-3 py-2 text-xs rounded-sm border transition-all duration-200
                        ${disabled
                          ? "border-[var(--border)] text-[var(--text-3)] cursor-not-allowed"
                          : alreadyAsked
                          ? "border-[var(--border)] text-[var(--text-3)]"
                          : "border-[var(--border)] text-[var(--text-2)] hover:border-[var(--text-3)] hover:text-[var(--text-1)]"
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
