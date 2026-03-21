import { useState } from "react";

import { BarChart3Icon, MailIcon, ShieldIcon } from "lucide-react";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  Switch
} from "@szum-tech/design-system";
import { BrandLogo } from "~/components/ui/brand-logo";

export type CookiePreferences = { analytics: boolean; marketing: boolean };

type CookieSettingsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (preferences: CookiePreferences) => void;
  onRejectOptional: () => void;
  defaultPreferences?: CookiePreferences;
};

const COOKIE_CATEGORIES = [
  {
    id: "essential" as const,
    name: "Niezbędne",
    description: "Wymagane do działania Clerka, Stripe i Firebase",
    icon: ShieldIcon,
    alwaysOn: true
  },
  {
    id: "analytics" as const,
    name: "Analityczne",
    description: "Pomóż nam ulepszać wydajność dashboardu",
    icon: BarChart3Icon,
    alwaysOn: false
  },
  {
    id: "marketing" as const,
    name: "Marketingowe",
    description: "Pozwól nam przesyłać personalizowane porady przez Resend",
    icon: MailIcon,
    alwaysOn: false
  }
] as const;

export function CookieSettingsModal({
  open,
  onOpenChange,
  onSave,
  onRejectOptional,
  defaultPreferences = { analytics: true, marketing: false }
}: CookieSettingsModalProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  const getChecked = (id: (typeof COOKIE_CATEGORIES)[number]["id"]) => {
    if (id === "essential") return true;
    return preferences[id];
  };

  const handleToggle = (id: (typeof COOKIE_CATEGORIES)[number]["id"], value: boolean) => {
    if (id === "essential") return;
    setPreferences((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent width="md" showCloseButton>
        <DialogHeader>
          <BrandLogo />
          <DialogTitle className="mt-4">Ustawienia prywatności</DialogTitle>
          <DialogDescription>
            Zdecyduj, które dane możemy przetwarzać, aby ulepszać Twój cyfrowy warsztat.
          </DialogDescription>
        </DialogHeader>

        <ItemGroup>
          {COOKIE_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Item key={category.id}>
                <ItemMedia variant="icon">
                  <Icon />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{category.name}</ItemTitle>
                  <ItemDescription>{category.description}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Switch
                    checked={getChecked(category.id)}
                    onCheckedChange={(value) => handleToggle(category.id, value)}
                    disabled={category.alwaysOn}
                    aria-label={category.name}
                  />
                </ItemActions>
              </Item>
            );
          })}
        </ItemGroup>

        <DialogFooter className="mt-2 flex-col gap-3 sm:flex-row">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1" onClick={onRejectOptional}>
              Odrzuć opcjonalne
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button className="flex-1" onClick={() => onSave(preferences)}>
              Zapisz preferencje
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
