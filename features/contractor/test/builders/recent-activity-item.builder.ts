import { build, oneOf, sequence } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { type RecentActivityItem } from "~/features/contractor/server/db/dashboard";

/**
 * Builder for RecentActivityItem test data.
 *
 * @example
 * const item = recentActivityItemBuilder.one();
 *
 * @example
 * const items = recentActivityItemBuilder.many(5);
 *
 * @example
 * const item = recentActivityItemBuilder.one({ traits: "active" });
 *
 * @example
 * const item = recentActivityItemBuilder.one({ overrides: { clientName: "Jan Kowalski" } });
 */
export const recentActivityItemBuilder = build<RecentActivityItem>({
  fields: {
    projectId: sequence((n) => `project-${n}`),
    projectName: () => `Remont ${faker.location.street()} ${faker.number.int({ min: 1, max: 50 })}`,
    projectStatus: oneOf("DRAFT", "ACTIVE", "COMPLETED", "ARCHIVED"),
    clientName: () => faker.person.fullName(),
    clientEmail: () => faker.internet.email(),
    lastClientViewAt: () => faker.date.recent({ days: 7 }),
    updatedAt: () => faker.date.recent({ days: 30 })
  },
  traits: {
    active: { overrides: { projectStatus: "ACTIVE" } },
    completed: { overrides: { projectStatus: "COMPLETED" } },
    draft: { overrides: { projectStatus: "DRAFT" } },
    archived: { overrides: { projectStatus: "ARCHIVED" } },
    noClientView: { overrides: { lastClientViewAt: null } }
  }
});
