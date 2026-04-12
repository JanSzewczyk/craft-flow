import { PlusIcon } from "lucide-react";

type CreateTemplateCardProps = {
  onClick: () => void;
};

export function CreateTemplateCard({ onClick }: CreateTemplateCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30 flex min-h-45 flex-col items-center justify-center gap-3 rounded border-2 border-dashed p-6 text-center transition-colors"
    >
      <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded">
        <PlusIcon className="size-6" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <p className="text-heading-h4">Nowy Szablon</p>
        <p className="text-mute">Złóż kilka etapów dla swoich standardowych projektów.</p>
      </div>
    </button>
  );
}
