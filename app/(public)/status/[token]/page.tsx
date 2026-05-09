import * as React from "react";

import { WrenchIcon } from "lucide-react";
import { type Metadata } from "next";

import { Badge, Button, Card, CardContent, Header } from "@szum-tech/design-system";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandLogo } from "~/features/marketing/components/brand-logo";
import { ClientTracker, GuestTimeline } from "~/features/projects/components";
import { updateClientViewAction } from "~/features/projects/server/actions/update-client-view.action";
import { getPublicProjectView } from "~/features/projects/server/services/projects.service";
import { createLogger } from "~/lib/logger";
import { ProjectStatus } from "~/features/projects/server/db";

const logger = createLogger({ module: "guest-project-page" });

async function loadData({ token }: { token: string }) {
  const [error, publicProjectView] = await getPublicProjectView({ token });

  if (error) {
    logger.error({ token, errorCode: error.code }, "Failed to load public project");
    notFound();
  }

  logger.info({ token, projectId: publicProjectView.id }, "Successfully loaded public project");
  return { publicProjectView };
}

export async function generateMetadata({ params }: PageProps<"/status/[token]">): Promise<Metadata> {
  const { token } = await params;
  const [, project] = await getPublicProjectView({ token });

  return { title: project ? `${project.name} | CraftFlow` : "Projekt | CraftFlow" };
}

export default async function GuestProjectPage({ params }: PageProps<"/status/[token]">) {
  const { token } = await params;
  const { publicProjectView } = await loadData({ token });

  const { contractor } = publicProjectView;
  const activeStep = publicProjectView.steps.find((s) => !s.isCompleted) ?? null;
  const year = new Date().getFullYear();

  return (
    <div
      className="flex min-h-screen flex-col"
      style={contractor.brandColor ? ({ "--primary": contractor.brandColor } as React.CSSProperties) : undefined}
    >
      <Header>
        <div className="flex w-full items-center justify-between">
          {contractor.logoUrl ? (
            <Image
              src={contractor.logoUrl}
              alt={contractor.companyName}
              width={120}
              height={40}
              className="object-contain"
            />
          ) : (
            <BrandLogo />
          )}
          <Button asChild size="sm">
            <Link href="/sign-up">Utwórz konto</Link>
          </Button>
        </div>
      </Header>

      <ClientTracker projectId={publicProjectView.id} onTrackAction={updateClientViewAction} />

      <main className="flex-1 px-4 pt-24 pb-16 sm:px-6">
        <div className="container-3xl">
          <div className="mb-12 text-center">
            <div className="bg-muted mb-6 inline-flex size-16 items-center justify-center rounded-full">
              <WrenchIcon className="text-primary size-7" />
            </div>
            <p className="text-primary text-heading-h4 mb-2 uppercase">Projekt: {publicProjectView.name}</p>
            <h1 className="text-display-md mb-4">Sprawdź postępy realizacji {publicProjectView.name}</h1>
            {activeStep && publicProjectView.status === ProjectStatus.ACTIVE ? (
              <Badge variant="outline" className="mt-2">
                Aktualnie: {activeStep.title}
              </Badge>
            ) : null}
          </div>

          <GuestTimeline project={publicProjectView} />

          <Card className="mt-12 text-center">
            <CardContent className="flex flex-col items-center gap-4 py-8">
              <h4 className="text-lg font-bold">Chcesz historię wszystkich swoich zleceń w jednym miejscu?</h4>
              <p className="text-muted-foreground max-w-md text-sm">
                Załóż konto, aby śledzić postępy, przeglądać historię i kontaktować się z wykonawcami bezpośrednio.
              </p>
              <Button asChild>
                <Link href="/sign-up">Zarejestruj się</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-border bg-background border-t">
        <div className="container py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-muted-foreground text-body-sm">Copyright © {year} CraftFlow</p>

            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground text-body-xs transition-colors duration-200"
              >
                Polityka prywatności
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground text-body-xs transition-colors duration-200"
              >
                Regulamin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
