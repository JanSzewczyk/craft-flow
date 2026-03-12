import { Users } from "lucide-react";

import { IllustrationCard } from "./illustration-card";

const CLIENTS = [
  { name: "Jan Kowalski", count: "3 zlecenia" },
  { name: "Anna Nowak", count: "1 zlecenie" },
  { name: "Piotr Wiśniewski", count: "5 zleceń" }
] as const;

export function CrmIllustration() {
  return (
    <IllustrationCard
      gradientClass="from-success/10 to-success/5"
      icon={<Users className="text-success h-16 w-16 opacity-20" aria-hidden="true" />}
      cardTitle="Baza klientów"
    >
      <div className="flex flex-col gap-2">
        {CLIENTS.map((client) => (
          <div key={client.name} className="flex items-center justify-between">
            <span className="text-body-xs text-foreground">{client.name}</span>
            <span className="text-body-xs text-muted-foreground">{client.count}</span>
          </div>
        ))}
      </div>
    </IllustrationCard>
  );
}
