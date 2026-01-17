"use client";

import { useState } from "react";
import ContactForm from "./ContactForm";
import { Mail } from "lucide-react";

interface ContactButtonProps {
  variant?: "primary" | "secondary" | "floating";
  sourcePage?: string;
  className?: string;
}

export default function ContactButton({ 
  variant = "primary", 
  className = "" 
}: ContactButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowForm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const variantClasses = {
    primary: "px-8 py-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--bg)] rounded-full font-semibold shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/30 hover:-translate-y-0.5",
    secondary: "px-8 py-4 bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)] border-2 border-[var(--btn-secondary-border)] hover:border-[var(--primary)] hover:bg-[var(--btn-secondary-hover)] rounded-full font-semibold",
    floating: "fixed bottom-8 right-8 z-40 p-5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--bg)] rounded-full shadow-2xl shadow-[var(--primary)]/30 hover:shadow-xl hover:scale-110 animate-float ring-4 ring-[var(--primary)]/10",
  };

  return (
    <>
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-[var(--surface-1)] border border-[var(--success)]/30 text-[var(--text-1)] px-6 py-5 rounded-2xl shadow-2xl shadow-black/20 flex items-center gap-4 animate-slide-in">
          <div className="w-10 h-10 rounded-xl bg-[var(--success)]/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-semibold">Message Sent!</p>
            <p className="text-sm text-[var(--text-3)]">We&apos;ll be in touch soon</p>
          </div>
        </div>
      )}

      {showForm && (
        <ContactForm
          onClose={() => setShowForm(false)}
          cartItems={[]}
          onSuccess={handleSuccess}
        />
      )}

      <button
        onClick={() => setShowForm(true)}
        className={`${variantClasses[variant]} transition-all duration-300 ${className} inline-flex items-center gap-2`}
      >
        <Mail className="w-5 h-5" />
        {variant !== "floating" && <span>Contact Us</span>}
      </button>
    </>
  );
}
