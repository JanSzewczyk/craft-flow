import * as React from "react";

import { type Metadata } from "next";

import { auth } from "@clerk/nextjs/server";
import { createLogger } from "~/lib/logger";

export const metadata: Metadata = { title: "Moje projekty | CraftFlow" };

const logger = createLogger({ module: "client-page" });

async function loadData() {
  const { userId } = await auth();
  logger.info({ userId }, "Successfully loaded client portal");
}

export default async function ClientPortalPage() {
  await loadData();

  return (
    <div>
      <h1 className="text-heading-h2 mb-6">Moje projekty</h1>
      <p className="text-muted-foreground">
        Nie masz jeszcze żadnych projektów. Skontaktuj się z wykonawcą, aby zobaczyć postępy swoich zleceń.
      </p>
    </div>
  );
}
