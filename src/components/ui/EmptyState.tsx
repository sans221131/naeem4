import { type ReactNode } from "react";
import Button from "./Button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon ? (
        <div className="mb-4 text-[var(--text-3)]">{icon}</div>
      ) : (
        <div className="mb-4 w-16 h-16 rounded-full bg-[var(--surface-2)] flex items-center justify-center">
          <svg className="w-8 h-8 text-[var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
      )}
      <h3 className="font-serif text-h3 text-[var(--text-1)] mb-2">{title}</h3>
      {description && (
        <p className="text-[var(--text-2)] text-body max-w-sm mb-6">{description}</p>
      )}
      {action && (
        action.href ? (
          <a href={action.href}>
            <Button variant="primary">{action.label}</Button>
          </a>
        ) : (
          <Button variant="primary" onClick={action.onClick}>{action.label}</Button>
        )
      )}
    </div>
  );
}

export default EmptyState;
