"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Review = {
  id: string;
  name: string;
  location: string;
  destination: string;
  text: string;
  image?: string;
};

const reviews: Review[] = [
  {
    id: "r1",
    name: "Ayaan M.",
    location: "Mumbai",
    destination: "Dubai",
    text: "Clear pricing, instant confirmation. This is how travel booking should be.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "r2",
    name: "Sara K.",
    location: "London",
    destination: "Bali",
    text: "No tourist traps, just authentic experiences. Every activity was worth it.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "r3",
    name: "Faizan A.",
    location: "Delhi",
    destination: "Paris",
    text: "Got a real person who sorted my booking change in 10 minutes.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "r4",
    name: "Hina R.",
    location: "Toronto",
    destination: "Japan",
    text: "High-end feel but transparent prices. Planning my Japan trip was so simple.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "r5",
    name: "Arjun S.",
    location: "Bengaluru",
    destination: "Switzerland",
    text: "A travel site that doesn't overwhelm you. I could decide fast.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "r6",
    name: "Priya D.",
    location: "Singapore",
    destination: "Morocco",
    text: "From the first click to the actual experience, everything felt premium.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
  },
];

export default function ReviewsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  const activeReview = reviews[activeIndex];

  // Scroll to make active card visible
  const scrollToActive = useCallback((index: number) => {
    if (scrollRef.current && cardRefs.current[index]) {
      const container = scrollRef.current;
      const card = cardRefs.current[index];
      if (!card) return;
      
      const containerRect = container.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      
      // Calculate scroll position to center the card
      const scrollLeft = card.offsetLeft - containerRect.width / 2 + cardRect.width / 2;
      
      container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: "smooth"
      });
    }
  }, []);

  // Auto-cycle through reviews
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % reviews.length;
        return next;
      });
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isPaused]);

  // Scroll to active card when it changes
  useEffect(() => {
    scrollToActive(activeIndex);
  }, [activeIndex, scrollToActive]);

  // Calculate card opacity based on scroll position
  const getCardStyle = (index: number) => {
    if (!scrollRef.current || !cardRefs.current[index]) {
      return { opacity: 1, transform: "scale(1)" };
    }
    
    const container = scrollRef.current;
    const card = cardRefs.current[index];
    if (!card) return { opacity: 1, transform: "scale(1)" };
    
    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    
    // Calculate how far the card is from the edges
    const leftEdge = cardRect.left - containerRect.left;
    const rightEdge = containerRect.right - cardRect.right;
    
    const fadeZone = 120; // pixels from edge where fade starts
    
    let opacity = 1;
    if (leftEdge < fadeZone) {
      opacity = Math.max(0, leftEdge / fadeZone);
    } else if (rightEdge < fadeZone) {
      opacity = Math.max(0, rightEdge / fadeZone);
    }
    
    return { 
      opacity,
      transform: opacity < 1 ? `scale(${0.95 + opacity * 0.05})` : "scale(1)"
    };
  };

  const [, forceUpdate] = useState(0);
  
  // Update opacity on scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      forceUpdate(n => n + 1);
    };
    
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="bg-[var(--surface-1)] py-20 md:py-28 overflow-hidden">
      <div className="container-editorial">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--primary)] mb-3">
            Testimonials
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--text-1)] mb-4">
            What Travelers Say
          </h2>
          <div className="flex items-center justify-center gap-6 text-sm text-[var(--text-3)]">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.154c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.95c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.286-3.95a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.154a1 1 0 00.95-.69l1.286-3.95z" />
              </svg>
              <span className="font-medium text-[var(--text-1)]">4.9</span> average rating
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
            <span><span className="font-medium text-[var(--text-1)]">500+</span> happy travelers</span>
          </div>
        </div>

        {/* Featured Review Card */}
        <div 
          className="max-w-3xl mx-auto mb-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="bg-[var(--primary)] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.8" fill="currentColor" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#dots)" />
              </svg>
            </div>
            
            <div className="relative text-center">
              {/* Quote icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-6">
                <svg className="w-6 h-6 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>
              </div>
              
              {/* Quote */}
              <blockquote 
                key={activeReview.id} 
                className="font-serif text-2xl md:text-3xl lg:text-4xl leading-snug mb-8 animate-fade-in"
              >
                {activeReview.text}
              </blockquote>
              
              {/* Author */}
              <div key={`author-${activeReview.id}`} className="flex items-center justify-center gap-4 animate-fade-in">
                <img 
                  src={activeReview.image} 
                  alt={activeReview.name}
                  className="w-14 h-14 rounded-full object-cover ring-4 ring-white/20"
                />
                <div className="text-left">
                  <p className="font-medium text-lg">{activeReview.name}</p>
                  <p className="text-sm text-white/70">{activeReview.location} → {activeReview.destination}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Pills */}
        <div className="flex justify-center gap-2 mb-12">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex 
                  ? "w-8 bg-[var(--primary)]" 
                  : "w-2 bg-[var(--border)] hover:bg-[var(--text-3)]"
              }`}
              aria-label={`View review ${i + 1}`}
            />
          ))}
        </div>

        {/* Review Cards Carousel */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Gradient overlays */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--surface-1)] via-[var(--surface-1)]/80 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--surface-1)] via-[var(--surface-1)]/80 to-transparent pointer-events-none z-10" />
          
          <div 
            ref={scrollRef}
            className="flex gap-5 py-4 overflow-x-auto scrollbar-hide px-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {reviews.map((review, index) => {
              const isActive = index === activeIndex;
              const cardStyle = getCardStyle(index);
              
              return (
                <button
                  key={review.id}
                  ref={el => { cardRefs.current[index] = el; }}
                  onClick={() => setActiveIndex(index)}
                  style={{
                    opacity: cardStyle.opacity,
                    transform: cardStyle.transform,
                  }}
                  className={`
                    group flex-shrink-0 w-[320px] text-left rounded-2xl p-6 
                    transition-all duration-300 ease-out
                    ${isActive 
                      ? "bg-[var(--primary)] text-white shadow-2xl shadow-[var(--primary)]/25 scale-105" 
                      : "bg-[var(--bg)] shadow-lg shadow-black/5"
                    }
                  `}
                >
                  {/* Header with stars and destination */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${isActive ? "text-white/90" : "text-amber-400"}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.154c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.95c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.286-3.95a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.154a1 1 0 00.95-.69l1.286-3.95z" />
                        </svg>
                      ))}
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-[var(--surface-1)] text-[var(--text-3)]"
                    }`}>
                      {review.destination}
                    </span>
                  </div>
                  
                  {/* Quote */}
                  <p className={`text-[15px] leading-relaxed mb-5 ${
                    isActive ? "text-white/90" : "text-[var(--text-2)]"
                  }`}>
                    &ldquo;{review.text}&rdquo;
                  </p>
                  
                  {/* Author */}
                  <div className={`flex items-center gap-3 pt-4 border-t ${
                    isActive ? "border-white/20" : "border-[var(--border)]"
                  }`}>
                    <img 
                      src={review.image} 
                      alt={review.name}
                      className={`w-11 h-11 rounded-full object-cover ring-2 ${
                        isActive ? "ring-white/30" : "ring-[var(--border)]"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${
                        isActive ? "text-white" : "text-[var(--text-1)]"
                      }`}>
                        {review.name}
                      </p>
                      <p className={`text-sm ${
                        isActive ? "text-white/60" : "text-[var(--text-3)]"
                      }`}>
                        {review.location}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </section>
  );
}
