"use client";

import Image from "next/image";
import Link from "next/link";
import type { Activity } from "@/../../db/schema";

interface ActivityCardProps {
  activity: Activity;
  destination?: { name: string; flag: string };
  formatPrice: string;
}

export default function ActivityCard({ activity, destination, formatPrice }: ActivityCardProps) {
  const truncate = (text: string, maxLength: number): string => {
    if (!text) return "";
    const cleaned = text
      .replace(/:contentReference\[[^\]]*\]\{[^}]*\}/g, "")
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength)}…` : cleaned;
  };

  return (
    <article className="group">
      <Link href={`/activity/${activity.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--surface-2)] mb-4">
          {activity.imageUrl ? (
            <Image
              src={activity.imageUrl}
              alt={activity.name}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-sm text-[var(--text-3)]">No image</span>
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Price badge */}
          <div className="absolute bottom-3 left-3">
            <span className="inline-block px-3 py-1.5 bg-[var(--surface-1)]/90 backdrop-blur-md text-sm font-semibold text-[var(--primary)] rounded-full border border-[var(--border)]/50">
              {formatPrice}
            </span>
          </div>

          {/* Destination badge */}
          {destination && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface-1)]/90 backdrop-blur-md text-xs font-medium text-[var(--text-1)] rounded-full border border-[var(--border)]/50">
                <span>{destination.flag}</span>
                <span>{destination.name}</span>
              </span>
            </div>
          )}
          
          {/* Hover action indicator */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--primary)] text-[var(--bg)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="font-serif text-lg text-[var(--text-1)] group-hover:text-[var(--primary)] transition-colors duration-300 line-clamp-1">
            {activity.name}
          </h3>
          <p className="text-sm text-[var(--text-3)] leading-relaxed line-clamp-2">
            {truncate(activity.description, 100)}
          </p>
          
          {/* Meta */}
          <div className="flex items-center justify-between pt-2">
            {activity.reviewCount > 0 && (
              <span className="text-xs text-[var(--text-3)] flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {activity.reviewCount} reviews
              </span>
            )}
            <span className="text-xs font-medium text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Explore →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
