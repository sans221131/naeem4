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
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[var(--surface-2)] mb-4">
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
              <span className="text-sm text-[var(--text-3)]">No image</span>
            </div>
          )}
          
          {/* Price badge */}
          <div className="absolute bottom-3 left-3">
            <span className="inline-block px-3 py-1.5 bg-white/95 backdrop-blur-sm text-sm font-medium text-[var(--text-1)] rounded-sm">
              {formatPrice}
            </span>
          </div>

          {/* Destination badge */}
          {destination && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-xs text-[var(--text-1)] rounded-sm">
                <span>{destination.flag}</span>
                <span>{destination.name}</span>
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <h3 className="font-serif text-lg text-[var(--text-1)] mb-2 group-hover:text-[var(--primary)] transition-colors duration-200 truncate whitespace-nowrap">
            {activity.name}
          </h3>
          <p className="text-sm text-[var(--text-2)] leading-relaxed line-clamp-2 mb-3">
            {truncate(activity.description, 100)}
          </p>
          
          {/* Meta */}
          <div className="flex items-center justify-between">
            {activity.reviewCount > 0 && (
              <span className="text-xs text-[var(--text-3)]">
                {activity.reviewCount} reviews
              </span>
            )}
            <span className="text-xs font-medium text-[var(--primary)] group-hover:underline">
              View details →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
