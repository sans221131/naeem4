"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

interface Country {
  id: string;
  name: string;
  flag: string;
  image: string;
}

const countries: Country[] = [
  { id: "argentina", name: "Argentina", flag: "🇦🇷", image: "/countries/argentina.webp" },
  { id: "australia", name: "Australia", flag: "🇦🇺", image: "/countries/australia.webp" },
  { id: "austria", name: "Austria", flag: "🇦🇹", image: "/countries/austria.jpg" },
  { id: "bali", name: "Bali", flag: "🇮🇩", image: "/countries/bali.jpg" },
  { id: "belgium", name: "Belgium", flag: "🇧🇪", image: "/countries/belgium.jpg" },
  { id: "brazil", name: "Brazil", flag: "🇧🇷", image: "/countries/brazil.jpg" },
  { id: "bulgaria", name: "Bulgaria", flag: "🇧🇬", image: "/countries/bulgaria.jpg" },
  { id: "canada", name: "Canada", flag: "🇨🇦", image: "/countries/canada.webp" },
  { id: "china", name: "China", flag: "🇨🇳", image: "/countries/china.jpg" },
  { id: "croatia", name: "Croatia", flag: "🇭🇷", image: "/countries/coratia.jpg" },
  { id: "cuba", name: "Cuba", flag: "🇨🇺", image: "/countries/cuba.jpg" },
  { id: "czechia", name: "Czechia", flag: "🇨🇿", image: "/countries/czechia.jpeg" },
  { id: "denmark", name: "Denmark", flag: "🇩🇰", image: "/countries/denmark.jpg" },
  { id: "dominican", name: "Dominican Republic", flag: "🇩🇴", image: "/countries/dominican.jpg" },
  { id: "dubai", name: "Dubai", flag: "🇦🇪", image: "/countries/dubai.jpg" },
  { id: "egypt", name: "Egypt", flag: "🇪🇬", image: "/countries/egypt.avif" },
  { id: "france", name: "France", flag: "🇫🇷", image: "/countries/france.jpg" },
  { id: "germany", name: "Germany", flag: "🇩🇪", image: "/countries/germany.webp" },
  { id: "greece", name: "Greece", flag: "🇬🇷", image: "/countries/greece.jpg" },
  { id: "hungary", name: "Hungary", flag: "🇭🇺", image: "/countries/hungary.jpg" },
  { id: "india", name: "India", flag: "🇮🇳", image: "/countries/india.jpg" },
  { id: "ireland", name: "Ireland", flag: "🇮🇪", image: "/countries/ireland.webp" },
  { id: "italy", name: "Italy", flag: "🇮🇹", image: "/countries/italy.jpg" },
  { id: "jamaica", name: "Jamaica", flag: "🇯🇲", image: "/countries/jamiaca.jpg" },
  { id: "japan", name: "Japan", flag: "🇯🇵", image: "/countries/japan.jpg" },
  { id: "jordan", name: "Jordan", flag: "🇯🇴", image: "/countries/jordan.webp" },
  { id: "london", name: "London", flag: "🇬🇧", image: "/countries/london.jpg" },
  { id: "malaysia", name: "Malaysia", flag: "🇲🇾", image: "/countries/malaysia.webp" },
  { id: "mexico", name: "Mexico", flag: "🇲🇽", image: "/countries/mexico.avif" },
  { id: "morocco", name: "Morocco", flag: "🇲🇦", image: "/countries/morocco.avif" },
  { id: "netherlands", name: "Netherlands", flag: "🇳🇱", image: "/countries/netherlands.avif" },
  { id: "newzealand", name: "New Zealand", flag: "🇳🇿", image: "/countries/newzealand.webp" },
  { id: "norway", name: "Norway", flag: "🇳🇴", image: "/countries/Norway.jpg" },
  { id: "poland", name: "Poland", flag: "🇵🇱", image: "/countries/poland.avif" },
  { id: "portugal", name: "Portugal", flag: "🇵🇹", image: "/countries/portugal.jpg" },
  { id: "qatar", name: "Qatar", flag: "🇶🇦", image: "/countries/qatar.jpg" },
  { id: "romania", name: "Romania", flag: "🇷🇴", image: "/countries/romania.jpg" },
  { id: "saudi", name: "Saudi Arabia", flag: "🇸🇦", image: "/countries/saudi.jpg" },
  { id: "singapore", name: "Singapore", flag: "🇸🇬", image: "/countries/singapore.webp" },
  { id: "southafrica", name: "South Africa", flag: "🇿🇦", image: "/countries/southafrica.jpg" },
  { id: "southkorea", name: "South Korea", flag: "🇰🇷", image: "/countries/southkorea.jpg" },
  { id: "spain", name: "Spain", flag: "🇪🇸", image: "/countries/spain.webp" },
  { id: "sweden", name: "Sweden", flag: "🇸🇪", image: "/countries/sweden.webp" },
  { id: "switzerland", name: "Switzerland", flag: "🇨🇭", image: "/countries/switzerland.jpg" },
  { id: "thailand", name: "Thailand", flag: "🇹🇭", image: "/countries/thailand.jpg" },
  { id: "tunisia", name: "Tunisia", flag: "🇹🇳", image: "/countries/tunisia.webp" },
  { id: "turkey", name: "Turkey", flag: "🇹🇷", image: "/countries/turkey.jpg" },
  { id: "united-states", name: "United States", flag: "🇺🇸", image: "/countries/united-states.jpg" },
  { id: "vietnam", name: "Vietnam", flag: "🇻🇳", image: "/countries/vietnam.webp" },
];

export default function DestinationsPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      {/* Header Section */}
      <section className="bg-[var(--surface-1)] border-b border-[var(--border)]">
        <div className="container-editorial py-12 md:py-16">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link 
              href="/" 
              className="text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors duration-200"
            >
              Home
            </Link>
            <span className="text-[var(--text-3)]">/</span>
            <span className="text-[var(--text-1)]">Destinations</span>
          </nav>
          
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-3)] mb-3">
              {countries.length} Destinations
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--text-1)] leading-tight mb-4">
              Explore the World
            </h1>
            <p className="text-base md:text-lg text-[var(--text-2)] leading-relaxed">
              From ancient wonders to modern marvels, discover curated experiences across extraordinary destinations worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="py-12 md:py-20">
        <div className="container-editorial">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {countries.map((country) => (
              <article key={country.id} className="group">
                <Link href={`/destination/${country.id}`} className="block">
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[var(--surface-2)] mb-4">
                    <Image
                      src={country.image}
                      alt={country.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    
                    {/* Flag badge */}
                    <div className="absolute top-3 left-3">
                      <span className="text-2xl">{country.flag}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg text-[var(--text-1)] group-hover:text-[var(--primary)] transition-colors duration-200">
                      {country.name}
                    </h3>
                    <svg 
                      className="w-4 h-4 text-[var(--text-3)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>

                {/* Enquire Button */}
                <button
                  onClick={() => setIsContactOpen(true)}
                  className="mt-3 w-full py-2.5 text-sm font-medium border border-[var(--border)] text-[var(--text-2)] rounded-sm hover:border-[var(--text-3)] hover:text-[var(--text-1)] transition-all duration-200"
                >
                  Enquire
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[var(--surface-1)] border-t border-[var(--border)] py-16 md:py-24">
        <div className="container-editorial">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-3)] mb-3">
              Don&apos;t see your destination?
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--text-1)] mb-4">
              We&apos;re always expanding
            </h2>
            <p className="text-base text-[var(--text-2)] mb-8">
              Contact us to suggest a new destination or inquire about custom travel experiences.
            </p>
            <button
              onClick={() => setIsContactOpen(true)}
              className="btn btn-primary"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {isContactOpen && (
        <ContactForm
          onClose={() => setIsContactOpen(false)}
          cartItems={[]}
          onSuccess={() => setIsContactOpen(false)}
        />
      )}
    </main>
  );
}
