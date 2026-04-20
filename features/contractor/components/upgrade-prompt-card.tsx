import { LockIcon, PaletteIcon, MailIcon } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@szum-tech/design-system";
import Link from "next/link";

const VARIANT_CONFIG = {
  branding: {
    icon: PaletteIcon,
    title: "Dostosuj wygląd swojej marki",
    description: "Zmień logo, kolor przewodni i spraw, by Twoi klienci widzieli profesjonalny, spójny branding.",
    benefits: [
      "Własne logo firmy w panelu klienta",
      "Kolor przewodni dopasowany do Twojej marki",
      "Podgląd na żywo zmian brandingu"
    ]
  },
  email: {
    icon: MailIcon,
    title: "Personalizuj szablony e-mail",
    description: "Dostosuj treść powiadomień wysyłanych do Twoich klientów — spraw, by wyglądały profesjonalnie.",
    benefits: [
      "Własny temat i treść wiadomości powitalnej",
      "Zmienne dynamiczne (imię klienta, nazwa projektu)",
      "Kolejne szablony wkrótce"
    ]
  }
} as const;

type UpgradePromptCardProps = {
  variant: "branding" | "email";
};

export function UpgradePromptCard({ variant }: UpgradePromptCardProps) {
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  return (
    <Card className="container-xl border-dashed">
      <CardHeader className="text-center">
        <div className="bg-muted mx-auto mb-3 flex size-12 items-center justify-center rounded-full">
          <Icon className="text-muted-foreground size-6" />
        </div>
        <CardTitle>{config.title}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="text-body-sm text-muted-foreground space-y-2">
          {config.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2">
              <span className="text-primary mt-0.5">&#10003;</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="justify-center">
        <Button asChild startIcon={<LockIcon />}>
          <Link href="/app/settings">Zmień plan</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
