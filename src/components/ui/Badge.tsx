import { type ReactNode } from "react";

type BadgeVariant = "neutral" | "active" | "accent" | "success" | "warning";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral: "bg-[var(--chip-bg)] text-[var(--chip-text)] border-[var(--chip-border)]",
  active: "bg-[var(--chip-active-bg)] text-[var(--chip-active-text)] border-transparent",
  accent: "bg-[var(--chip-accent-bg)] text-[var(--chip-accent-text)] border-transparent",
  success: "bg-emerald-50 text-emerald-700 border-transparent",
  warning: "bg-amber-50 text-amber-700 border-transparent",
};

export function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5
        text-xs font-medium
        border rounded-full
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;
