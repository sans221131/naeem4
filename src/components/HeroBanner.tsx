"use client";

import { Activity } from "../../db/schema";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import NextImage from "next/image";

interface HeroBannerProps {
  activities: Activity[];
}

const HEADER_OFFSET_PX = 64;

type MotionPref = "no-preference" | "reduce";

const AUTO_MS = 6000;
const TRANS_MS = 500;

function getMotionPref(): MotionPref {
  if (typeof window === "undefined") return "no-preference";
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
    ? "reduce"
    : "no-preference";
}

function formatPrice(activity: Activity) {
  const raw = activity.price;
  const currency = activity.currency ?? "";

  const num =
    typeof raw === "number" ? raw : typeof raw === "string" ? parseFloat(raw) : NaN;

  if (!isFinite(num) || num === 0) return { label: "Complimentary", sub: "Free entry" };

  return { label: `${currency} ${num.toFixed(0)}`, sub: "From" };
}

function cleanText(s: string) {
  return (
    s
      .replace(/:contentReference\[[^\]]*\]\{[^}]*\}/g, "")
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function extractHighlights(description?: string | null) {
  if (!description) return { bullets: [] as string[], summary: "" };

  const lines = description
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const bullets: string[] = [];
  for (const line of lines) {
    if (/^[-•*]\s+/.test(line)) {
      const b = cleanText(line.replace(/^[-•*]\s+/, ""));
      if (b.length >= 4) bullets.push(b);
    }
  }

  const blob = cleanText(description.replace(/\n+/g, " "));
  const summary = blob.length > 160 ? `${blob.slice(0, 160)}…` : blob;

  return { bullets: bullets.slice(0, 3), summary };
}

export default function HeroBanner({
  activities,
}: HeroBannerProps) {
  const len = activities?.length ?? 0;
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  const [paused, setPaused] = useState(false);
  const [motionPref, setMotionPref] = useState<MotionPref>("no-preference");

  // progress bar restart key
  const [progressKey, setProgressKey] = useState(0);

  const activeRef = useRef(0);
  const animRef = useRef(false);
  const hoverRef = useRef(false);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    setMotionPref(getMotionPref());
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setMotionPref(mq.matches ? "reduce" : "no-preference");

    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  // keep index valid
  useEffect(() => {
    if (len === 0) return;
    if (active > len - 1) setActive(0);
  }, [len, active]);

  const goTo = (nextIdx: number) => {
    if (len <= 1) return;
    if (nextIdx === activeRef.current) return;

    if (motionPref === "reduce") {
      setPrev(null);
      setActive((nextIdx + len) % len);
      setProgressKey((k) => k + 1);
      return;
    }

    if (animRef.current) return;
    animRef.current = true;

    const from = activeRef.current;
    const to = (nextIdx + len) % len;

    setPrev(from);
    setActive(to);
    setProgressKey((k) => k + 1);

    window.setTimeout(() => {
      setPrev(null);
      animRef.current = false;
    }, TRANS_MS);
  };

  const next = () => goTo(activeRef.current + 1);
  const prevFn = () => goTo(activeRef.current - 1);

  // autoplay
  useEffect(() => {
    if (len <= 1) return;
    if (paused || hoverRef.current || motionPref === "reduce") return;

    const id = window.setInterval(() => next(), AUTO_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [len, paused, motionPref, progressKey]);

  // keyboard
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (len <= 1) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prevFn();
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [len, motionPref]);

  // preload next image
  useEffect(() => {
    if (len <= 1) return;
    const nextIdx = (active + 1) % len;
    const nextImg = activities[nextIdx]?.imageUrl as string | undefined;
    if (!nextImg) return;
    const img = new Image();
    img.src = nextImg;
  }, [active, len, activities]);

  const current = activities?.[active] as Activity | undefined;
  const previous = (prev !== null ? (activities?.[prev] as Activity | undefined) : null) as
    | Activity
    | null
    | undefined;

  const { bullets, summary } = extractHighlights(current?.description);

  if (!current) return null;

  const currentImg = current.imageUrl;
  const prevImg = previous ? previous.imageUrl : undefined;

  const title = current.name;
  const destinationId = current.destinationId ?? "";

  const reviewCount = current.reviewCount ?? 0;
  const reviewsLabel =
    typeof reviewCount !== "undefined" && reviewCount !== null
      ? Number(reviewCount) > 0
        ? `${Number(reviewCount).toLocaleString()} reviews`
        : "No reviews yet"
      : null;

  const { label: priceLabel, sub: priceSub } = formatPrice(current);

  const heroStyle = ({
    ["--heroH"]: `calc(100svh - ${HEADER_OFFSET_PX}px)`,
  } as unknown) as React.CSSProperties;

  return (
    <section
      suppressHydrationWarning
      style={heroStyle}
      className="relative w-full bg-[var(--bg)] lg:h-[var(--heroH)]"
    >
      <div className="container-editorial py-6 sm:py-8 lg:py-4 lg:h-full">
        {/* Main Grid */}
        <div
          className="grid gap-6 lg:gap-8 lg:h-full lg:min-h-0 lg:grid-cols-12 lg:items-stretch"
          onMouseEnter={() => (hoverRef.current = true)}
          onMouseLeave={() => (hoverRef.current = false)}
        >
          {/* LEFT - Image Section */}
          <div className="lg:col-span-7 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
            <div className="relative overflow-hidden rounded-lg bg-[var(--surface-2)] lg:flex-1 lg:min-h-0">
              <div className="relative h-[300px] sm:h-[360px] md:h-[480px] lg:h-full">
                {/* Previous layer for transition */}
                {previous && motionPref !== "reduce" && prevImg && (
                  <NextImage
                    src={prevImg}
                    alt={previous!.name}
                    fill
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-out"
                    style={{ opacity: 0 }}
                    unoptimized
                  />
                )}

                {/* Current image */}
                {currentImg ? (
                  <NextImage
                    src={currentImg}
                    alt={title}
                    fill
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-2)]">
                    <p className="text-sm text-[var(--text-3)]">No image available</p>
                  </div>
                )}

                {/* Subtle gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Destination badge */}
                {destinationId && (
                  <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
                    <span className="inline-block rounded-sm bg-white/90 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-[var(--text-1)] backdrop-blur-sm">
                      {String(destinationId)}
                    </span>
                  </div>
                )}

                {/* Navigation arrows */}
                {len > 1 && (
                  <>
                    <button
                      onClick={prevFn}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/90 text-[var(--text-1)] backdrop-blur-sm transition-all duration-200 hover:bg-white"
                      aria-label="Previous"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={next}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/90 text-[var(--text-1)] backdrop-blur-sm transition-all duration-200 hover:bg-white"
                      aria-label="Next"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Progress bar */}
                {len > 1 && !paused && motionPref !== "reduce" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                    <div
                      key={progressKey}
                      className="h-full bg-white"
                      style={{ width: "0%", animation: `heroProgress ${AUTO_MS}ms linear forwards` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Slide indicators */}
            {len > 1 && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {activities.slice(0, 5).map((a, i) => (
                    <button
                      key={(a as Activity).id ?? `${(a as Activity).name}-${i}`}
                      onClick={() => goTo(i)}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        i === active 
                          ? "w-6 bg-[var(--primary)]" 
                          : "w-1.5 bg-[var(--border)] hover:bg-[var(--text-3)]"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                  {len > 5 && (
                    <span className="ml-1 text-xs text-[var(--text-3)]">+{len - 5}</span>
                  )}
                </div>

                <button
                  onClick={() => setPaused((p) => !p)}
                  className="text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors duration-200"
                  aria-label={paused ? "Resume" : "Pause"}
                >
                  {paused ? "Resume" : "Pause"}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT - Content Section */}
          <div className="lg:col-span-5 lg:h-full lg:min-h-0 lg:overflow-y-auto">
            <div className="flex h-full min-h-0 flex-col">
              {/* Header */}
              <div className="mb-4 sm:mb-6">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--text-3)]">
                  Featured Experience
                </p>
                <span className="text-xs text-[var(--text-3)]">
                  {active + 1} of {len}
                </span>
              </div>

              {/* Title */}
              <h1 className="mb-4 font-serif text-3xl md:text-4xl lg:text-5xl leading-tight text-[var(--text-1)] line-clamp-2 sm:line-clamp-3 lg:line-clamp-2">
                {title}
              </h1>

              {/* Summary */}
              {summary && (
                <p className="mb-6 max-w-md text-base leading-relaxed text-[var(--text-2)] line-clamp-3 sm:line-clamp-2 lg:mb-4 lg:line-clamp-2">
                  {summary}
                </p>
              )}

              {/* Highlights */}
              {bullets.length > 0 && (
                <ul className="mb-8 space-y-3 lg:mb-6 lg:space-y-2 lg:[&>li:nth-child(n+3)]:hidden">
                  {bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--primary)] flex-shrink-0" />
                      <span className="text-sm text-[var(--text-2)]">{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Price & CTA */}
              <div className="mt-auto border-t border-[var(--border)] pt-4 sm:pt-6">
                <div className="mb-4 flex items-baseline gap-2 sm:mb-6">
                  <span className="text-xs uppercase tracking-wider text-[var(--text-3)]">{priceSub}</span>
                  <span className="font-serif text-2xl text-[var(--text-1)]">{priceLabel}</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/activity/${current.id}`}
                    className="btn btn-primary w-full sm:w-auto text-center"
                  >
                    View Experience
                  </Link>
                  <Link
                    href="/destinations"
                    className="btn btn-secondary w-full sm:w-auto text-center"
                  >
                    Browse All
                  </Link>
                </div>

                <p className="mt-4 text-xs text-[var(--text-3)]">
                  Use arrow keys to navigate • Space to pause
                </p>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes heroProgress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    </section>
  );
}
