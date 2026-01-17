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
    <div className="bg-[var(--surface-1)] rounded-lg border border-[var(--border)] p-6">
      <div className="text-center mb-6 pb-6 border-b border-[var(--border)]">
        <p className="text-xs uppercase tracking-wider text-[var(--text-3)] mb-2">Starting from</p>
        <p className="font-serif text-3xl text-[var(--text-1)]">{formattedPrice}</p>
        <p className="text-xs text-[var(--text-3)] mt-1">per person</p>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="w-full h-12 flex items-center justify-center rounded-sm bg-[var(--text-1)] hover:bg-[var(--text-2)] text-white text-sm font-medium tracking-wide uppercase transition-colors duration-200"
      >
        Enquire Now
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
