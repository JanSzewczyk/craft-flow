type ContactItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

export function ContactItem({ icon, label, value }: ContactItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div
        className="bg-primary/10 text-primary mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg"
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-body-sm text-muted-foreground font-medium">{label}</p>
        <p className="text-body-default text-foreground">{value}</p>
      </div>
    </div>
  );
}
