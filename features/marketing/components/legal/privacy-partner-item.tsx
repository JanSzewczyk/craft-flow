export type PrivacyPartnerItemProps = {
  name: string;
  category: string;
};

export function PrivacyPartnerItem({ name, category }: PrivacyPartnerItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-4">
      <div className="bg-primary size-2 shrink-0 rounded" aria-hidden />
      <span className="text-foreground font-bold">{name}</span>
      <span className="text-muted-foreground ml-auto text-xs">{category}</span>
    </div>
  );
}
