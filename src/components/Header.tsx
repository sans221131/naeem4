"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ContactForm from "./ContactForm";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleRandomDestination = async () => {
    try {
      const res = await fetch('/countries/manifest.json');
      const data = await res.json();
      const keys = Object.keys(data || {});
      if (keys.length === 0) return;
      const random = keys[Math.floor(Math.random() * keys.length)];
      router.push(`/destination/${encodeURIComponent(random)}`);
      setIsMenuOpen(false);
    } catch (e) {
      console.error('Failed to open random country', e);
    }
  };

  return (
    <>
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-[60] bg-[var(--surface-1)] border border-[var(--success)] text-[var(--text-1)] px-5 py-4 rounded-[var(--radius-lg)] shadow-lg flex items-center gap-3 animate-slide-in">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-sm">Message sent</p>
            <p className="text-xs text-[var(--text-2)]">We&apos;ll be in touch soon</p>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactForm && (
        <ContactForm
          onClose={() => setShowContactForm(false)}
          cartItems={[]}
          onSuccess={() => {
            setShowContactForm(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
          }}
        />
      )}

      <header className="sticky top-0 z-50 bg-[var(--surface-1)]/95 backdrop-blur-sm border-b border-[var(--border)]">
        <div className="container-editorial">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className="font-serif text-xl font-medium text-[var(--text-1)] hover:text-[var(--primary)] transition-colors duration-150"
            >
              YourBrand
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link 
                href="/destinations" 
                className="px-4 py-2 text-sm text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface-2)] rounded-[var(--radius-md)] transition-all duration-150"
              >
                Destinations
              </Link>
              <Link 
                href="/#faq" 
                className="px-4 py-2 text-sm text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface-2)] rounded-[var(--radius-md)] transition-all duration-150"
              >
                FAQ
              </Link>
              <button 
                onClick={handleRandomDestination}
                className="px-4 py-2 text-sm text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface-2)] rounded-[var(--radius-md)] transition-all duration-150"
              >
                Surprise Me
              </button>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={() => setShowContactForm(true)}
                className="px-4 py-2 text-sm font-medium text-[var(--text-1)] hover:text-[var(--primary)] transition-colors duration-150"
              >
                Contact
              </button>
              <Link 
                href="/destinations"
                className="px-4 py-2 text-sm font-medium bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] rounded-[var(--radius-md)] hover:bg-[var(--btn-primary-hover)] transition-colors duration-150"
              >
                Start Planning
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-[var(--text-1)] hover:bg-[var(--surface-2)] rounded-[var(--radius-md)] transition-colors duration-150"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-[var(--border)] animate-fade-in">
              <nav className="flex flex-col gap-1">
                <Link 
                  href="/destinations" 
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-3 text-[var(--text-1)] hover:bg-[var(--surface-2)] rounded-[var(--radius-md)] transition-colors duration-150"
                >
                  Destinations
                </Link>
                <Link 
                  href="/#faq" 
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-3 text-[var(--text-1)] hover:bg-[var(--surface-2)] rounded-[var(--radius-md)] transition-colors duration-150"
                >
                  FAQ
                </Link>
                <button 
                  onClick={handleRandomDestination}
                  className="px-3 py-3 text-left text-[var(--text-1)] hover:bg-[var(--surface-2)] rounded-[var(--radius-md)] transition-colors duration-150"
                >
                  Surprise Me
                </button>
                <button 
                  onClick={() => {
                    setShowContactForm(true);
                    setIsMenuOpen(false);
                  }}
                  className="px-3 py-3 text-left text-[var(--text-1)] hover:bg-[var(--surface-2)] rounded-[var(--radius-md)] transition-colors duration-150"
                >
                  Contact
                </button>
                <div className="pt-3 mt-2 border-t border-[var(--border)]">
                  <Link 
                    href="/destinations"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-3 text-center font-medium bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] rounded-[var(--radius-md)] hover:bg-[var(--btn-primary-hover)] transition-colors duration-150"
                  >
                    Start Planning
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
