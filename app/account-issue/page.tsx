import { AlertTriangleIcon } from "lucide-react";
import { type Metadata } from "next";

import { SignOutButton } from "@clerk/nextjs";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Header } from "@szum-tech/design-system";
import { ThemeToggle } from "~/components/ui/theme-toggle";

export const metadata: Metadata = {
  title: "Problem z kontem"
};

export default function AccountIssuePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <svg className="size-5" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
              </svg>
            </div>
            <span className="text-body-xl text-foreground font-semibold">CraftFlow</span>
          </div>
          <ThemeToggle />
        </div>
      </Header>
      <div className="container flex flex-1 flex-col items-center justify-center py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="bg-warning/10 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
              <AlertTriangleIcon className="text-warning size-6" />
            </div>
            <CardTitle>Problem z kontem</CardTitle>
            <CardDescription>
              Wystąpił problem podczas konfiguracji Twojego konta. Wyloguj się i spróbuj zarejestrować ponownie. Jeśli
              problem będzie się powtarzał, skontaktuj się z nami.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <SignOutButton redirectUrl="/sign-in">
              <Button variant="error">Wyloguj się</Button>
            </SignOutButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
