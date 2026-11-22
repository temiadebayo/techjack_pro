import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo/jsonld";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  tone?: "dark" | "bone";
}

export function Breadcrumbs({ items, tone = "dark" }: BreadcrumbsProps) {
  const mutedClass = tone === "bone" ? "text-obsidian/65" : "text-concrete-aa";
  const activeClass = tone === "bone" ? "text-obsidian" : "text-bone";

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.path} className="inline-flex items-center gap-2">
              {idx > 0 ? (
                <span aria-hidden="true" className="text-blood">
                  /
                </span>
              ) : null}
              {isLast ? (
                <span aria-current="page" className={activeClass}>
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className={`${mutedClass} transition-colors hover:text-blood`}
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
