import { CalendarIcon, DownloadIcon } from "lucide-react";

import { Badge, Button } from "@szum-tech/design-system";

type LegalPageHeaderProps = {
  title: string;
  lastUpdated: string;
  downloadHref?: string;
};

export function LegalPageHeader({ title, lastUpdated, downloadHref }: LegalPageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-display-sm font-poppins text-foreground mb-4">{title}</h1>
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="secondary">
          <CalendarIcon className="size-3.5" aria-hidden />
          {lastUpdated}
        </Badge>
        {downloadHref && (
          <Button variant="outline" size="sm" asChild>
            <a href={downloadHref} download>
              <DownloadIcon className="size-4" aria-hidden />
              Pobierz PDF
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
