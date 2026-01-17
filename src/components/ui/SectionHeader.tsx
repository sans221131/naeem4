import { type ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  centered?: boolean;
}

export function SectionHeader({ 
  title, 
  subtitle, 
  action, 
  centered = false 
}: SectionHeaderProps) {
  return (
    <div className={`mb-8 md:mb-12 ${centered ? "text-center" : "flex flex-col md:flex-row md:items-end md:justify-between gap-4"}`}>
      <div className={centered ? "max-w-2xl mx-auto" : ""}>
        <h2 className="font-serif text-h2 text-[var(--text-1)]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-[var(--text-2)] text-body max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className={centered ? "mt-6" : ""}>
          {action}
        </div>
      )}
    </div>
  );
}

export default SectionHeader;
