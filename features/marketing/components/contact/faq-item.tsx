type FaqItemProps = {
  question: string;
  answer: string;
};

export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-body-sm text-foreground font-semibold">{question}</dt>
      <dd className="text-body-sm text-muted-foreground">{answer}</dd>
    </div>
  );
}
