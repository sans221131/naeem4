"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default function CartPage() {
  const { items, removeFromCart, clearCart, totalPrice, itemCount } = useCart();
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleCheckout = () => {
    setShowContactForm(true);
  };

  const handleFormSuccess = () => {
    setShowContactForm(false);
    setShowSuccessMessage(true);
    clearCart();
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  if (itemCount === 0) {
    return (
      <main className="min-h-screen bg-[var(--bg)]">
        <div className="container-editorial py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-2)] mb-8 shadow-lg shadow-black/10">
              <ShoppingBag className="w-12 h-12 text-[var(--primary)]" />
            </div>
            <h1 className="font-serif text-3xl text-[var(--text-1)] mb-4">
                Your Cart is Empty
            </h1>
            <p className="text-[var(--text-2)] mb-10">
              Start exploring our destinations and activities to plan your next journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/destinations"
                className="inline-flex items-center justify-center px-8 py-4 bg-[var(--primary)] text-[var(--bg)] rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-[var(--primary-hover)] transition-all duration-300 shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/30 hover:-translate-y-0.5"
              >
                Browse Destinations
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-4 border border-[var(--border)] text-[var(--text-1)] rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-[var(--surface-1)] hover:border-[var(--text-3)] transition-all duration-300"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Group items by currency
  const currencies = Array.from(new Set(items.map(item => item.currency)));

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[var(--surface-1)] border border-[var(--success)]/30 text-[var(--text-1)] px-6 py-5 rounded-2xl flex items-center gap-4 shadow-xl shadow-black/20">
          <div className="w-10 h-10 rounded-xl bg-[var(--success)]/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Enquiry Submitted</p>
            <p className="text-sm text-[var(--text-3)]">We&apos;ll contact you within 24 hours</p>
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactForm
          onClose={() => setShowContactForm(false)}
          cartItems={items}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Header */}
      <section className="bg-gradient-to-b from-[var(--surface-1)] to-[var(--bg)] border-b border-[var(--border)]">
        <div className="container-editorial py-10">
          <nav className="flex items-center gap-2 text-sm text-[var(--text-3)] mb-8">
            <Link href="/" className="hover:text-[var(--primary)] transition-colors duration-300">Home</Link>
            <span>/</span>
            <span className="text-[var(--primary)]">Cart</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-[var(--text-1)] mb-3">
                 Your Cart
              </h1>
              <p className="text-[var(--text-2)]">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} selected
              </p>
            </div>
            {itemCount > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-[var(--text-3)] hover:text-[var(--accent)] transition-colors duration-300 px-4 py-2 rounded-full hover:bg-[var(--surface-2)]"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Cart Items */}
      <section className="bg-[var(--bg)]">
        <div className="container-editorial py-12">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300"
                >
                  <div className="flex gap-5 p-5 md:p-6">
                    {/* Image */}
                    <div className="relative w-28 h-28 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--surface-2)]">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-110"
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ShoppingBag className="w-8 h-8 text-[var(--text-3)]" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <span className="inline-block text-xs uppercase tracking-wider text-[var(--primary)] mb-2 px-2.5 py-1 bg-[var(--primary)]/10 rounded-full">
                            {item.type === 'activity' ? 'Activity' : 'Destination'}
                          </span>
                          <h3 className="font-serif text-lg text-[var(--text-1)] line-clamp-2">
                            {item.name}
                          </h3>
                          {item.destinationName && (
                            <p className="text-sm text-[var(--text-3)] mt-1">
                              {item.destinationName}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="flex-shrink-0 p-2.5 text-[var(--text-3)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-xl transition-all duration-300"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-5">
                        <div className="font-serif text-xl text-[var(--primary)]">
                          {item.price > 0 ? `${item.currency} ${item.price.toFixed(0)}` : 'Free'}
                        </div>
                        <Link
                          href={item.type === 'activity' ? `/activity/${item.id}` : `/destination/${item.destinationId}`}
                          className="text-sm text-[var(--text-2)] hover:text-[var(--primary)] transition-colors duration-300 flex items-center gap-1 group"
                        >
                          View Details
                          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-2)] rounded-2xl border border-[var(--border)] p-7 sticky top-24 shadow-xl shadow-black/10">
                <h2 className="font-serif text-xl text-[var(--text-1)] mb-7 pb-5 border-b border-[var(--border)]/50">
                  Summary
                </h2>

                <div className="space-y-4 mb-7">
                <div className="flex items-center justify-between text-sm text-[var(--text-2)]">
                  <span>Items</span>
                  <span className="px-2.5 py-0.5 bg-[var(--surface-2)] rounded-full">{itemCount}</span>
                </div>

                {currencies.map(currency => {
                  const currencyItems = items.filter(item => item.currency === currency);
                  const currencyTotal = currencyItems.reduce((sum, item) => sum + Number(item.price), 0);
                  
                  if (currencyTotal === 0) return null;
                  
                  return (
                    <div key={currency} className="flex items-center justify-between text-sm text-[var(--text-2)]">
                      <span>Total ({currency})</span>
                      <span>{currencyTotal.toFixed(0)}</span>
                    </div>
                  );
                })}

                <div className="pt-5 mt-5 border-t border-[var(--border)]/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-1)] font-medium">Total</span>
                    <span className="font-serif text-2xl text-[var(--primary)]">
                      {currencies.length === 1 && items.some(item => Number(item.price) > 0)
                        ? `${currencies[0]} ${totalPrice.toFixed(0)}`
                        : 'Mixed'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--bg)] text-sm font-semibold tracking-wide uppercase transition-all duration-300 shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/30 hover:-translate-y-0.5"
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-[var(--text-3)] text-center mt-5">
                Items are not reserved until booking is complete.
              </p>
            </div>
          </div>
        </div>
        </div>
      </section>
    </main>
  );
}
