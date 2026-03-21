"use client";

import { useState } from "react";

import { CookieIcon, XIcon } from "lucide-react";

import { Button, Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@szum-tech/design-system";
import { type CookiePreferences, CookieSettingsModal } from "~/components/cookie-settings-modal";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setCookieConsent = (value: boolean) => {
    document.cookie = `cookieConsent=${value}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    setIsVisible(false);
  };

  const saveCookiePreferences = (preferences: CookiePreferences) => {
    document.cookie = `cookieConsent=true; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    document.cookie = `cookiePreferences=${JSON.stringify(preferences)}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <Card className="animate-in fade-in slide-in-from-bottom-4 fixed bottom-6 left-6 z-50 w-full max-w-sm duration-500">
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-x-4">
            <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
              <CookieIcon className="size-5" />
            </div>
            Cenimy Twoją prywatność
          </CardTitle>
          <CardAction>
            <button
              onClick={() => setCookieConsent(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Zamknij"
            >
              <XIcon className="size-5" />
            </button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Używamy plików cookie, aby poprawić komfort użytkowania, personalizować treści oraz analizować ruch na
            naszej stronie.
          </p>
        </CardContent>
        <CardFooter className="flex-row gap-2">
          <Button onClick={() => saveCookiePreferences({ analytics: true, marketing: true })}>
            Akceptuję wszystkie
          </Button>
          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
            Ustawienia
          </Button>
        </CardFooter>
      </Card>

      <CookieSettingsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={saveCookiePreferences}
        onRejectOptional={() => saveCookiePreferences({ analytics: false, marketing: false })}
      />
    </>
  );
}
