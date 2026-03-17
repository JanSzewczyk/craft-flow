export type LegalCalloutProps = { children: React.ReactNode };

export function LegalCallout({ children }: LegalCalloutProps) {
  return <div className="border-primary bg-primary/5 rounded-r-lg border-l-4 p-4">{children}</div>;
}
