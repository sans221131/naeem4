"use client";

import { useState } from "react";
import { X, Mail, Phone, User, MessageSquare } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: string | number;
  currency?: string;
  type?: string;
  destinationName?: string;
}

interface ContactFormProps {
  onClose: () => void;
  cartItems: CartItem[];
  onSuccess: () => void;
}

export default function ContactForm({ onClose, cartItems, onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneCountryCode: "+1",
    phoneNumber: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Log cart items for debugging
  console.log("ContactForm cartItems:", cartItems, "Length:", cartItems?.length);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cartItems,
          sourcePage: "/cart",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit enquiry");
      }

      onSuccess();
    } catch (err) {
      setError("Failed to submit enquiry. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[var(--surface-1)] rounded-2xl max-w-lg w-full my-4 border border-[var(--border)] shadow-2xl shadow-black/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-gradient-to-r from-[var(--surface-1)] to-[var(--surface-2)]">
          <div>
            <h2 className="font-serif text-xl text-[var(--text-1)]">Get in Touch</h2>
            <p className="text-xs text-[var(--primary)] mt-1">We&apos;ll respond within 24 hours</p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-[var(--bg)] rounded-xl transition-all duration-300 group"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[var(--text-2)] group-hover:text-[var(--text-1)] transition-colors" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[calc(85vh-80px)] overflow-y-auto">
          {/* Cart Items Summary */}
          {cartItems && cartItems.length > 0 && (
            <div className="bg-gradient-to-br from-[var(--surface-2)] to-[var(--bg)] border border-[var(--border)] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[var(--text-1)]">Selected Items</h3>
                <span className="text-xs px-2.5 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm py-2.5 border-b border-[var(--border)]/50 last:border-0">
                    <span className="text-[var(--text-2)]">{item.name}</span>
                    {Number(item.price) > 0 && (
                      <span className="text-[var(--primary)] font-medium">
                        {item.currency} {Number(item.price).toFixed(0)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-xs uppercase tracking-wider text-[var(--text-3)] mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text-1)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/10 transition-all duration-300 text-sm"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs uppercase tracking-wider text-[var(--text-3)] mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text-1)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/10 transition-all duration-300 text-sm"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phoneNumber" className="block text-xs uppercase tracking-wider text-[var(--text-3)] mb-2">
              Phone Number
            </label>
            <div className="flex gap-2">
              <select
                name="phoneCountryCode"
                value={formData.phoneCountryCode}
                onChange={handleChange}
                className="px-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text-1)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/10 transition-all duration-300 text-sm cursor-pointer"
              >
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+91">+91</option>
                <option value="+971">+971</option>
                <option value="+20">+20</option>
                <option value="+34">+34</option>
                <option value="+33">+33</option>
                <option value="+49">+49</option>
                <option value="+39">+39</option>
              </select>
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text-1)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/10 transition-all duration-300 text-sm"
                  placeholder="123-456-7890"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-xs uppercase tracking-wider text-[var(--text-3)] mb-2">
              Message
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-[var(--text-3)]" />
              <textarea
                id="message"
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text-1)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/10 transition-all duration-300 resize-none text-sm"
                placeholder="Tell us about your travel plans..."
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] px-4 py-3.5 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:bg-[var(--border)] text-[var(--bg)] text-sm font-semibold tracking-wide uppercase transition-all duration-300 disabled:cursor-not-allowed shadow-lg shadow-[var(--primary)]/20 hover:shadow-xl hover:shadow-[var(--primary)]/30 hover:-translate-y-0.5"
          >
            {isSubmitting ? "Submitting..." : "Submit Enquiry"}
          </button>

          <p className="text-xs text-[var(--text-3)] text-center">
            By submitting, you agree to receive communications from us
          </p>
        </form>
      </div>
    </div>
  );
}
