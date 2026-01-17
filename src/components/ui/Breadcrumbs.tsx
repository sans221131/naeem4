import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-[var(--text-3)]" aria-hidden="true">/</span>
            )}
            {isLast || !item.href ? (
              <span className="text-[var(--text-1)] font-medium">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-[var(--text-2)] hover:text-[var(--primary)] transition-colors duration-150"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
