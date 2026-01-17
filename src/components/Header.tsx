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

      <header className="sticky top-0 z-50 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)]/50">
        <div className="container-editorial">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link 
              href="/" 
              className="group flex items-center gap-2"
            >
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center text-[var(--bg)] font-serif text-sm font-semibold">
                Y
              </span>
              <span className="font-serif text-lg font-medium text-[var(--text-1)] group-hover:text-[var(--primary)] transition-colors duration-300">
                YourBrand
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-[var(--surface-1)]/50 backdrop-blur-sm px-2 py-1.5 rounded-full border border-[var(--border)]/50">
              <Link 
                href="/destinations" 
                className="px-4 py-2 text-sm text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface-2)] rounded-full transition-all duration-300"
              >
                Destinations
              </Link>
              <Link 
                href="/#faq" 
                className="px-4 py-2 text-sm text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface-2)] rounded-full transition-all duration-300"
              >
                FAQ
              </Link>
              <button 
                onClick={handleRandomDestination}
                className="px-4 py-2 text-sm text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface-2)] rounded-full transition-all duration-300 flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                </svg>
                Surprise Me
              </button>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => setShowContactForm(true)}
                className="text-sm font-medium text-[var(--text-2)] hover:text-[var(--primary)] transition-colors duration-300"
              >
                Contact
              </button>
              <Link 
                href="/destinations"
                className="px-5 py-2.5 text-sm font-medium bg-[var(--primary)] text-[var(--bg)] rounded-full hover:bg-[var(--primary-hover)] transition-all duration-300 shadow-lg shadow-[var(--primary)]/20 hover:shadow-[var(--primary)]/30 hover:-translate-y-0.5"
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
