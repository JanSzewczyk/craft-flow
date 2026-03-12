import { Mail } from "lucide-react";

import { Separator } from "@szum-tech/design-system";

import { IllustrationCard } from "./illustration-card";

export function EmailIllustration() {
  return (
    <IllustrationCard
      gradientClass="from-purple-500/10 to-purple-500/5"
      icon={<Mail className="h-16 w-16 text-purple-500 opacity-20" aria-hidden="true" />}
      cardTitle="Powiadomienie e-mail"
    >
      <Separator className="mb-3" />
      <p className="text-body-xs text-muted-foreground">
        <span className="text-foreground font-medium">Temat:</span> Twój projekt przeszedł do kolejnego etapu
      </p>
      <p className="text-body-xs text-muted-foreground mt-1.5">
        Etap &ldquo;Montaż u klienta&rdquo; został właśnie ukończony.
      </p>
    </IllustrationCard>
  );
}
