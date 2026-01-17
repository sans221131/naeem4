import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  featured?: boolean;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ 
  children, 
  className = "", 
  featured = false, 
  hover = true,
  padding = "md"
}: CardProps) {
  return (
    <div
      className={`
        ${featured ? "bg-[var(--surface-2)]" : "bg-[var(--surface-1)]"}
        border border-[var(--border)] rounded-[var(--radius-lg)]
        ${hover ? "transition-all duration-200 ease-out hover:border-[var(--text-3)] hover:-translate-y-0.5" : ""}
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardImage({ 
  src, 
  alt, 
  aspectRatio = "4/3" 
}: { 
  src?: string; 
  alt: string;
  aspectRatio?: string;
}) {
  return (
    <div 
      className="relative overflow-hidden rounded-t-[var(--radius-lg)] bg-[var(--surface-2)]"
      style={{ aspectRatio }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg className="w-12 h-12 text-[var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default Card;
