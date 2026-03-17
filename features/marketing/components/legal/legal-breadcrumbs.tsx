import { ChevronRightIcon, HomeIcon } from "lucide-react";

import Link from "next/link";

type LegalBreadcrumbsProps = { label: string };

export function LegalBreadcrumbs({ label }: LegalBreadcrumbsProps) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="text-body-sm text-muted-foreground flex items-center gap-2">
        <li>
          <Link href="/">
            <HomeIcon className="size-4" aria-hidden />
            <span className="sr-only">Strona główna</span>
          </Link>
        </li>
        <li>
          <ChevronRightIcon className="size-4" aria-hidden />
        </li>
        <li>
          <span aria-current="page" className="text-foreground font-medium">
            {label}
          </span>
        </li>
      </ol>
    </nav>
  );
}
