"use client";

import { useState } from "react";
import ContactForm from "../../../components/ContactForm";

interface BookingCardProps {
  price?: number | string;
  currency?: string;
}

export default function BookingCard({ price, currency }: BookingCardProps) {
  const [open, setOpen] = useState(false);

  const formattedPrice = typeof price === "number"
    ? `${currency ?? "$"}${price.toFixed(0)}`
    : price ?? "—";

  return (
    <div className="bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-2)] rounded-2xl border border-[var(--border)] p-7 shadow-xl shadow-black/10">
      <div className="text-center mb-7 pb-7 border-b border-[var(--border)]/50">
        <p className="text-xs uppercase tracking-wider text-[var(--primary)] mb-2 font-medium">Starting from</p>
        <p className="font-serif text-4xl text-[var(--text-1)] mb-1">{formattedPrice}</p>
        <p className="text-xs text-[var(--text-3)]">per person</p>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="w-full h-14 flex items-center justify-center gap-2 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--bg)] text-sm font-semibold tracking-wide uppercase transition-all duration-300 shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/30 hover:-translate-y-0.5 group"
      >
        <span>Enquire Now</span>
        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>

      {open && (
        <ContactForm
          onClose={() => setOpen(false)}
          cartItems={[]}
          onSuccess={() => setOpen(false)}
        />
      )}
    </div>
  );
}
