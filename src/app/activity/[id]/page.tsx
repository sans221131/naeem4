import { db } from "../../../../db/client";
import { activities } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BookingCard from "./BookingCard";

interface ActivityPageProps {
  params: Promise<{ id: string }>;
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const { id } = await params;

  // Fetch activity from database
  const [activity] = await db
    .select()
    .from(activities)
    .where(eq(activities.id, id))
    .limit(1);

  if (!activity) {
    notFound();
  }

  // Parse description to extract highlights, inclusions, exclusions, and extra sections
  const parseDescription = (desc: string) => {
    const normalized = desc
      .replace(/\\n/g, "\n")
      .replace(/\r\n/g, "\n")
      .replace(/\u2019/g, "'")
      .replace(/’/g, "'");
    const sections = {
      highlights: [] as string[],
      inclusions: [] as string[],
      exclusions: [] as string[],
      extraSections: [] as { title: string; items: string[] }[],
      overview: "",
    };

    const lines = normalized.split("\n");
    let currentSection: string = "overview";
    let currentExtraTitle = "";
    const overviewParts: string[] = [];

    const startExtraSection = (title: string) => {
      const existing = sections.extraSections.find((section) => section.title === title);
      if (!existing) {
        sections.extraSections.push({ title, items: [] });
      }
      currentExtraTitle = title;
      currentSection = "extra";
    };

    const addExtraItem = (text: string) => {
      const target = sections.extraSections.find((section) => section.title === currentExtraTitle);
      if (target) target.items.push(text);
    };

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const headerCandidate = trimmed.replace(/[:\-]+$/, "").trim();
      const lower = headerCandidate.toLowerCase();

      if (lower.includes("highlight")) {
        currentSection = "highlights";
        continue;
      }
      if (lower.includes("what's included") || lower.includes("whats included") || lower.includes("included") || lower.includes("inclusion")) {
        currentSection = "inclusions";
        continue;
      }
      if (lower.includes("not included") || lower.includes("exclusion") || lower.includes("exclude")) {
        currentSection = "exclusions";
        continue;
      }
      if (
        lower.includes("who it's for") ||
        lower.includes("who its for") ||
        lower.includes("eligibility") ||
        lower.includes("requirements") ||
        lower.includes("rules") ||
        lower.includes("good to know") ||
        lower.includes("what you'll actually do") ||
        lower.includes("what youll actually do") ||
        lower.includes("what you will do") ||
        lower.includes("what you'll do") ||
        lower.includes("what youll do")
      ) {
        startExtraSection(headerCandidate);
        continue;
      }

      const isBullet = /^[-•*]\s+/.test(trimmed);
      const text = isBullet ? trimmed.replace(/^[-•*]\s+/, "") : trimmed;

      switch (currentSection) {
        case "highlights":
          sections.highlights.push(text);
          break;
        case "inclusions":
          sections.inclusions.push(text);
          break;
        case "exclusions":
          sections.exclusions.push(text);
          break;
        case "extra":
          addExtraItem(text);
          break;
        default:
          overviewParts.push(text);
      }
    }

    sections.overview = overviewParts.join("\n").trim() || normalized.trim();
    return sections;
  };

  const parsed = parseDescription(activity.description);

  const formatPrice = () => {
    const price = typeof activity.price === "string" ? parseFloat(activity.price) : Number(activity.price);
    if (!Number.isFinite(price) || price === 0) return "Free";
    return `${activity.currency} ${price.toFixed(0)}`;
  };

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Breadcrumb */}
        <div className="bg-[var(--surface-1)] border-b border-[var(--border)] px-4 py-3">
          <nav className="flex items-center gap-2 text-xs text-[var(--text-3)]">
            <Link href="/" className="hover:text-[var(--text-1)] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-[var(--text-1)] transition-colors">Destinations</Link>
            <span>/</span>
            <span className="text-[var(--text-2)] truncate">{activity.name}</span>
          </nav>
        </div>

        {/* Mobile Image */}
        <div className="relative aspect-[4/3] w-full">
          {activity.imageUrl ? (
            <Image
              src={activity.imageUrl}
              alt={activity.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-[var(--surface-2)]">
              <span className="text-sm text-[var(--text-3)]">No image</span>
            </div>
          )}
        </div>

        {/* Mobile Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Title & Price */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-3)] mb-2">
              Experience
            </p>
            <h1 className="font-serif text-2xl text-[var(--text-1)] leading-tight mb-4">
              {activity.name}
            </h1>
            <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-[var(--border)]">
              <span className="text-xs uppercase tracking-wider text-[var(--text-3)]">From</span>
              <span className="font-serif text-xl text-[var(--text-1)]">{formatPrice()}</span>
            </div>

            {/* Quick info */}
            <div className="grid grid-cols-2 gap-2 mb-6 text-xs text-[var(--text-2)]">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Instant confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Free cancellation</span>
              </div>
            </div>

            {/* Mobile Booking Card */}
            <BookingCard
              price={typeof activity.price === "string" ? parseFloat(activity.price) : Number(activity.price)}
              currency={activity.currency}
            />
          </div>

          {/* Overview */}
          <div className="pt-6 border-t border-[var(--border)]">
            <h2 className="font-serif text-lg text-[var(--text-1)] mb-3">Overview</h2>
            <p className="text-sm text-[var(--text-2)] leading-relaxed whitespace-pre-line">
              {parsed.overview}
            </p>
          </div>

          {/* Highlights */}
          {parsed.highlights.length > 0 && (
            <div className="pt-6 border-t border-[var(--border)]">
              <h2 className="font-serif text-lg text-[var(--text-1)] mb-3">Highlights</h2>
              <ul className="space-y-2">
                {parsed.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[var(--text-2)]">
                    <span className="text-[var(--primary)]">—</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Inclusions */}
          {parsed.inclusions.length > 0 && (
            <div className="pt-6 border-t border-[var(--border)]">
              <h2 className="font-serif text-lg text-[var(--text-1)] mb-3">What&apos;s Included</h2>
              <ul className="space-y-2">
                {parsed.inclusions.map((inclusion, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[var(--text-2)]">
                    <svg className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{inclusion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Exclusions */}
          {parsed.exclusions.length > 0 && (
            <div className="pt-6 border-t border-[var(--border)]">
              <h2 className="font-serif text-lg text-[var(--text-1)] mb-3">Not Included</h2>
              <ul className="space-y-2">
                {parsed.exclusions.map((exclusion, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[var(--text-2)]">
                    <svg className="w-4 h-4 text-[var(--text-3)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>{exclusion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Extra Sections */}
          {parsed.extraSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="pt-6 border-t border-[var(--border)]">
              <h2 className="font-serif text-lg text-[var(--text-1)] mb-3">{section.title}</h2>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 text-sm text-[var(--text-2)]">
                    <span className="text-[var(--text-3)]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Good to Know */}
          <div className="bg-[var(--surface-1)] rounded-lg p-4 border border-[var(--border)]">
            <h2 className="font-serif text-base text-[var(--text-1)] mb-3">Good to Know</h2>
            <div className="space-y-2 text-xs text-[var(--text-2)]">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Instant confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Mobile voucher accepted</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Free cancellation (48h)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Breadcrumb */}
        <section className="bg-[var(--surface-1)] border-b border-[var(--border)]">
          <div className="container-editorial py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors duration-200">Home</Link>
              <span className="text-[var(--text-3)]">/</span>
              <Link href="/destinations" className="text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors duration-200">Destinations</Link>
              <span className="text-[var(--text-3)]">/</span>
              <span className="text-[var(--text-1)] truncate">{activity.name}</span>
            </nav>
          </div>
        </section>

        {/* Hero Section */}
        <section className="bg-[var(--surface-1)]">
          <div className="container-editorial py-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Image */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[var(--surface-2)]">
                {activity.imageUrl ? (
                  <Image
                    src={activity.imageUrl}
                    alt={activity.name}
                    fill
                    className="object-cover"
                    priority
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-[var(--surface-2)]">
                  <span className="text-sm text-[var(--text-3)]">No image</span>
                </div>
              )}
            </div>

              {/* Content */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-3)] mb-3">
                  Experience
                </p>
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--text-1)] leading-tight mb-4">
                  {activity.name}
                </h1>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-xs uppercase tracking-wider text-[var(--text-3)]">From</span>
                  <span className="font-serif text-2xl text-[var(--text-1)]">{formatPrice()}</span>
                </div>

                {/* Quick info */}
                <div className="space-y-2 mb-8 pb-8 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
                    <svg className="w-4 h-4 text-[var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Instant confirmation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
                    <svg className="w-4 h-4 text-[var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Mobile voucher accepted</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
                    <svg className="w-4 h-4 text-[var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Free cancellation (48h)</span>
                  </div>
                </div>

                {/* Booking Card */}
                <div className="lg:block">
                  <BookingCard
                    price={typeof activity.price === "string" ? parseFloat(activity.price) : Number(activity.price)}
                    currency={activity.currency}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="bg-[var(--bg)]">
          <div className="container-editorial py-12">
            {/* Overview */}
            <div className="max-w-3xl mb-12 pb-12 border-b border-[var(--border)]">
              <h2 className="font-serif text-2xl text-[var(--text-1)] mb-4">Overview</h2>
              <p className="text-[var(--text-2)] leading-relaxed whitespace-pre-line">
                {parsed.overview}
              </p>
            </div>

            {/* Highlights */}
            {parsed.highlights.length > 0 && (
              <div className="max-w-3xl mb-12 pb-12 border-b border-[var(--border)]">
                <h2 className="font-serif text-2xl text-[var(--text-1)] mb-6">Highlights</h2>
                <ul className="space-y-3">
                  {parsed.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[var(--text-2)]">
                      <span className="text-[var(--primary)]">—</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Inclusions & Exclusions Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border)]">
              {/* Inclusions */}
              {parsed.inclusions.length > 0 && (
                <div>
                  <h2 className="font-serif text-xl text-[var(--text-1)] mb-4">What&apos;s Included</h2>
                  <ul className="space-y-2">
                    {parsed.inclusions.map((inclusion, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[var(--text-2)]">
                        <svg className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{inclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exclusions */}
              {parsed.exclusions.length > 0 && (
                <div>
                  <h2 className="font-serif text-xl text-[var(--text-1)] mb-4">Not Included</h2>
                  <ul className="space-y-2">
                    {parsed.exclusions.map((exclusion, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[var(--text-2)]">
                        <svg className="w-4 h-4 text-[var(--text-3)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>{exclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Extra Sections */}
            {parsed.extraSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="max-w-3xl mb-12 pb-12 border-b border-[var(--border)]">
                <h2 className="font-serif text-xl text-[var(--text-1)] mb-4">{section.title}</h2>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm text-[var(--text-2)]">
                      <span className="text-[var(--text-3)]">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Good to Know */}
            <div className="max-w-3xl bg-[var(--surface-1)] rounded-lg p-6 border border-[var(--border)]">
              <h2 className="font-serif text-xl text-[var(--text-1)] mb-4">Good to Know</h2>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-[var(--text-2)]">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Instant confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>Mobile voucher accepted</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Free cancellation (48h)</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span>English support available</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// BookingCard is a client component imported directly above.
