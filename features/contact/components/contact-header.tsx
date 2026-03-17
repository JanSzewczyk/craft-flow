type ContactHeaderProps = {
  title: string;
  description: string;
};

export function ContactHeader({ title, description }: ContactHeaderProps) {
  return (
    <section className="bg-muted/30 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-display-md text-foreground">{title}</h1>
        <p className="text-lead mx-auto max-w-xl">{description}</p>
      </div>
    </section>
  );
}
