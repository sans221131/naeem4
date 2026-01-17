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
        <div className="container-editorial py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--surface-2)] mb-6">
              <ShoppingBag className="w-10 h-10 text-[var(--text-3)]" />
            </div>
            <h1 className="font-serif text-3xl text-[var(--text-1)] mb-3">
                Your Cart is Empty
            </h1>
            <p className="text-[var(--text-2)] mb-8">
              Start exploring our destinations and activities to plan your next journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/destinations"
                className="inline-flex items-center justify-center px-6 py-3 bg-[var(--text-1)] text-white rounded-sm text-sm font-medium tracking-wide uppercase hover:bg-[var(--text-2)] transition-colors duration-200"
              >
                Browse Destinations
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-[var(--border)] text-[var(--text-1)] rounded-sm text-sm font-medium tracking-wide uppercase hover:bg-[var(--surface-1)] transition-colors duration-200"
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
        <div className="fixed top-4 right-4 z-50 bg-[var(--text-1)] text-white px-6 py-4 rounded-sm flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-medium">Enquiry Submitted</p>
            <p className="text-sm text-white/80">We&apos;ll contact you within 24 hours</p>
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
      <section className="bg-[var(--surface-1)] border-b border-[var(--border)]">
        <div className="container-editorial py-8">
          <nav className="flex items-center gap-2 text-sm text-[var(--text-3)] mb-6">
            <Link href="/" className="hover:text-[var(--text-1)] transition-colors duration-200">Home</Link>
            <span>/</span>
            <span className="text-[var(--text-1)]">Cart</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-[var(--text-1)] mb-2">
                 Your Cart
              </h1>
              <p className="text-[var(--text-2)]">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} selected
              </p>
            </div>
            {itemCount > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-[var(--text-3)] hover:text-[var(--accent)] transition-colors duration-200"
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
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[var(--surface-1)] rounded-lg border border-[var(--border)] overflow-hidden"
                >
                  <div className="flex gap-4 p-4 md:p-6">
                    {/* Image */}
                    <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-sm overflow-hidden bg-[var(--surface-2)]">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
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
                          <span className="text-xs uppercase tracking-wider text-[var(--text-3)] mb-2 block">
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
                          className="flex-shrink-0 p-2 text-[var(--text-3)] hover:text-[var(--accent)] transition-colors duration-200"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="font-serif text-lg text-[var(--text-1)]">
                          {item.price > 0 ? `${item.currency} ${item.price.toFixed(0)}` : 'Free'}
                        </div>
                        <Link
                          href={item.type === 'activity' ? `/activity/${item.id}` : `/destination/${item.destinationId}`}
                          className="text-sm text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors duration-200"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--surface-1)] rounded-lg border border-[var(--border)] p-6 sticky top-24">
                <h2 className="font-serif text-xl text-[var(--text-1)] mb-6 pb-4 border-b border-[var(--border)]">
                  Summary
                </h2>

                <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm text-[var(--text-2)]">
                  <span>Items</span>
                  <span>{itemCount}</span>
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

                <div className="pt-4 mt-4 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-1)]">Total</span>
                    <span className="font-serif text-xl text-[var(--text-1)]">
                      {currencies.length === 1 && items.some(item => Number(item.price) > 0)
                        ? `${currencies[0]} ${totalPrice.toFixed(0)}`
                        : 'Mixed'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-sm bg-[var(--text-1)] hover:bg-[var(--text-2)] text-white text-sm font-medium tracking-wide uppercase transition-colors duration-200"
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-[var(--text-3)] text-center mt-4">
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
