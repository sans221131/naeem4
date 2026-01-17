"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Activity } from "../../db/schema";
import ContactForm from "./ContactForm";

interface Destination {
  id: string;
  name: string;
  flag: string;
}

const destinations: Destination[] = [
  { id: "dubai", name: "Dubai", flag: "🇦🇪" },
  { id: "bali", name: "Bali", flag: "🇮🇩" },
  { id: "france", name: "France", flag: "🇫🇷" },
  { id: "japan", name: "Japan", flag: "🇯🇵" },
  { id: "switzerland", name: "Switzerland", flag: "🇨🇭" },
];

function formatPrice(activity: Activity): string {
  const price = typeof activity.price === "string" ? parseFloat(activity.price) : Number(activity.price);
  if (!Number.isFinite(price) || price === 0) return "Free";
  return `${activity.currency} ${price.toFixed(0)}`;
}

function truncate(text: string, maxLength: number): string {
  if (!text) return "";
  const cleaned = text
    .replace(/:contentReference\[[^\]]*\]\{[^}]*\}/g, "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength)}…` : cleaned;
}

export default function CountriesSection({ activities }: { activities: Activity[] }) {
  const [activeDestination, setActiveDestination] = useState<string>(destinations[0].id);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const filteredActivities = useMemo(() => {
    return activities
      .filter((activity) => activity.destinationId === activeDestination && activity.isActive)
      .sort((a, b) => {
        const reviewDiff = (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
        if (reviewDiff !== 0) return reviewDiff;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 8);
  }, [activities, activeDestination]);

  const activeDestinationData = destinations.find((d) => d.id === activeDestination);

  // Split activities for magazine layout
  const featuredActivity = filteredActivities[0];
  const sideActivities = filteredActivities.slice(1, 3);
  const gridActivities = filteredActivities.slice(3, 7);

  const handleEnquire = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsContactOpen(true);
  };

  return (
    <section className="bg-[var(--bg)] py-16 md:py-24">
      <div className="container-editorial">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-3)] mb-3">
              Curated Experiences
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--text-1)]">
              Discover {activeDestinationData?.name}
            </h2>
          </div>

          {/* Destination Pills */}
          <div className="flex flex-wrap gap-2">
            {destinations.map((dest) => (
              <button
                key={dest.id}
                onClick={() => setActiveDestination(dest.id)}
                className={`
                  group relative px-4 py-2 text-sm transition-all duration-300
                  ${activeDestination === dest.id
                    ? "text-[var(--surface-1)]"
                    : "text-[var(--text-2)] hover:text-[var(--text-1)]"
                  }
                `}
              >
                {activeDestination === dest.id && (
                  <span className="absolute inset-0 bg-[var(--text-1)] rounded-full" />
                )}
                <span className="relative flex items-center gap-2">
                  <span>{dest.flag}</span>
                  <span className="font-medium">{dest.name}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[var(--border)] rounded-lg">
            <p className="font-serif text-2xl text-[var(--text-2)] mb-2">
              Coming Soon
            </p>
            <p className="text-sm text-[var(--text-3)]">
              We&apos;re adding experiences for {activeDestinationData?.name}
            </p>
          </div>
        ) : (
          <>
            {/* Magazine Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
              {/* Featured Card - Large */}
              {featuredActivity && (
                <div className="lg:col-span-7 group">
                  <Link href={`/activity/${featuredActivity.id}`} className="block relative">
                    <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden rounded-xl bg-[var(--surface-2)]">
                      {featuredActivity.imageUrl ? (
                        <Image
                          src={featuredActivity.imageUrl}
                          alt={featuredActivity.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-[var(--text-3)]">No image</span>
                        </div>
                      )}
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      {/* Content overlay */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <span className="inline-flex self-start px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-[var(--text-1)] rounded-full mb-3">
                          {formatPrice(featuredActivity)}
                        </span>
                        <h3 className="font-serif text-xl md:text-2xl lg:text-3xl text-white mb-2 line-clamp-2">
                          {featuredActivity.name}
                        </h3>
                        <p className="text-sm text-white/80 line-clamp-2 max-w-lg">
                          {truncate(featuredActivity.description, 120)}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleEnquire(featuredActivity)}
                    className="mt-3 text-sm font-medium text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
                  >
                    Enquire about this →
                  </button>
                </div>
              )}

              {/* Side Stack */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {sideActivities.map((activity) => (
                  <div key={activity.id} className="group flex-1">
                    <Link href={`/activity/${activity.id}`} className="block h-full">
                      <div className="relative h-full min-h-[180px] overflow-hidden rounded-xl bg-[var(--surface-2)]">
                        {activity.imageUrl ? (
                          <Image
                            src={activity.imageUrl}
                            alt={activity.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            unoptimized
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-[var(--text-3)]">No image</span>
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        
                        <div className="absolute inset-0 p-5 flex flex-col justify-end">
                          <span className="inline-flex self-start px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-[var(--text-1)] rounded-full mb-2">
                            {formatPrice(activity)}
                          </span>
                          <h3 className="font-serif text-lg text-white line-clamp-1">
                            {activity.name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Grid - Horizontal Cards */}
            {gridActivities.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {gridActivities.map((activity) => (
                  <div key={activity.id} className="group">
                    <Link href={`/activity/${activity.id}`} className="block">
                      <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-[var(--surface-2)] mb-3">
                        {activity.imageUrl ? (
                          <Image
                            src={activity.imageUrl}
                            alt={activity.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-xs text-[var(--text-3)]">No image</span>
                          </div>
                        )}
                        
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-[var(--text-1)] rounded">
                            {formatPrice(activity)}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="font-medium text-sm text-[var(--text-1)] line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
                        {activity.name}
                      </h3>
                      {activity.reviewCount > 0 && (
                        <p className="text-xs text-[var(--text-3)] mt-1">
                          {activity.reviewCount} reviews
                        </p>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* View All Link */}
            <div className="mt-10 text-center">
              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--border)] text-sm font-medium text-[var(--text-1)] rounded-full hover:bg-[var(--surface-1)] transition-colors duration-200"
              >
                View all {activeDestinationData?.name} experiences
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>

      {isContactOpen && (
        <ContactForm
          onClose={() => setIsContactOpen(false)}
          cartItems={selectedActivity ? [{
            id: selectedActivity.id,
            name: selectedActivity.name,
            price: selectedActivity.price,
            currency: selectedActivity.currency,
            type: 'activity'
          }] : []}
          onSuccess={() => {
            setIsContactOpen(false);
            setSelectedActivity(null);
          }}
        />
      )}
    </section>
  );
}

