const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  revalidatePath: vi.fn(),
  redirect: vi.fn(),
  setToastCookie: vi.fn(),
  createProject: vi.fn(),
  deleteProject: vi.fn(),
  updateProjectStatus: vi.fn(),
  updateStepCompletion: vi.fn(),
  trackClientView: vi.fn(),
  getProjectByPublicToken: vi.fn()
}));

vi.mock("server-only", () => ({}));
vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("~/lib/toast/server/toast.cookie", () => ({ setToastCookie: mocks.setToastCookie }));
vi.mock("~/features/projects/server/services/projects.service", () => ({
  createProject: mocks.createProject,
  softDeleteProject: mocks.deleteProject,
  updateProjectStatus: mocks.updateProjectStatus,
  updateStepCompletion: mocks.updateStepCompletion,
  trackClientView: mocks.trackClientView
}));
vi.mock("~/features/projects/server/db/queries", () => ({
  getProjectByPublicToken: mocks.getProjectByPublicToken
}));
vi.mock("~/lib/logger", () => {
  const noop = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), child: vi.fn() };
  noop.child.mockReturnValue(noop);
  return { default: noop, createLogger: vi.fn(() => noop) };
});

import { projectFormBuilder, projectBuilder } from "~/features/projects/test/builders";
import { ProjectStatus } from "~/features/projects/types/project";
import { SupabaseServiceError } from "~/lib/supabase/errors";

import { createProjectAction } from "./create-project.action";
import { deleteProjectAction } from "./delete-project.action";
import { updateProjectStatusAction } from "./update-project-status.action";
import { updateStepCompletionAction } from "./update-project-step.action";
import { updateClientViewAction } from "./update-client-view.action";

const AUTHENTICATED = { isAuthenticated: true, userId: "user-1" };
const UNAUTHENTICATED = { isAuthenticated: false, userId: null };

const formData = projectFormBuilder.one();
const mockProject = projectBuilder.one({ overrides: { id: "proj-1", contractorId: "user-1" } });

beforeEach(() => {
  vi.resetAllMocks();
  mocks.auth.mockResolvedValue(AUTHENTICATED);
  mocks.setToastCookie.mockResolvedValue(undefined);
});

// ─── createProjectAction ─────────────────────────────────────────────────────

describe("createProjectAction", () => {
  test("returns error when unauthenticated", async () => {
    mocks.auth.mockResolvedValue(UNAUTHENTICATED);
    const result = await createProjectAction(formData);
    expect(result).toEqual({ success: false, error: "Nie jesteś zalogowany" });
    expect(mocks.createProject).not.toHaveBeenCalled();
  });

  test("returns error when service fails with unknown error", async () => {
    mocks.createProject.mockResolvedValue([SupabaseServiceError.unknown(), null]);
    const result = await createProjectAction(formData);
    expect(result).toEqual({ success: false, error: "Wystąpił błąd serwera. Spróbuj ponownie." });
  });

  test("returns error when service fails with not_found", async () => {
    mocks.createProject.mockResolvedValue([SupabaseServiceError.notFound("Resource"), null]);
    const result = await createProjectAction(formData);
    expect(result).toEqual({ success: false, error: "Nie znaleziono wymaganego zasobu" });
  });

  test("returns error when service fails with limit_exceeded", async () => {
    mocks.createProject.mockResolvedValue([SupabaseServiceError.limitExceeded(10), null]);
    const result = await createProjectAction(formData);
    expect(result).toEqual({ success: false, error: "Przekroczono limit projektów dla aktualnego planu" });
  });

  test("returns error when permission denied", async () => {
    mocks.createProject.mockResolvedValue([SupabaseServiceError.unauthorized(), null]);
    const result = await createProjectAction(formData);
    expect(result).toEqual({ success: false, error: "Brak uprawnień do wykonania tej operacji" });
  });

  test("redirects to project page on success", async () => {
    mocks.createProject.mockResolvedValue([null, mockProject]);
    await createProjectAction(formData);
    expect(mocks.setToastCookie).toHaveBeenCalledWith("Projekt został utworzony pomyślnie");
    expect(mocks.redirect).toHaveBeenCalledWith(`/app/projects/${mockProject.id}`);
  });

  test("revalidates projects path on success", async () => {
    mocks.createProject.mockResolvedValue([null, mockProject]);
    await createProjectAction(formData);
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/app/projects");
  });

  test("calls service with correct userId and data", async () => {
    mocks.createProject.mockResolvedValue([null, mockProject]);
    await createProjectAction(formData);
    expect(mocks.createProject).toHaveBeenCalledWith({ contractorId: "user-1", formData });
  });
});

// ─── deleteProjectAction ─────────────────────────────────────────────────────

describe("deleteProjectAction", () => {
  test("returns error when unauthenticated", async () => {
    mocks.auth.mockResolvedValue(UNAUTHENTICATED);
    const result = await deleteProjectAction("proj-1");
    expect(result).toEqual({ success: false, error: "Nie jesteś zalogowany" });
    expect(mocks.deleteProject).not.toHaveBeenCalled();
  });

  test("returns error when service fails with not_found", async () => {
    mocks.deleteProject.mockResolvedValue([SupabaseServiceError.notFound("Project"), null]);
    const result = await deleteProjectAction("proj-1");
    expect(result).toEqual({ success: false, error: "Nie znaleziono wymaganego zasobu" });
  });

  test("returns error when permission denied", async () => {
    mocks.deleteProject.mockResolvedValue([SupabaseServiceError.unauthorized(), null]);
    const result = await deleteProjectAction("proj-1");
    expect(result).toEqual({ success: false, error: "Brak uprawnień do wykonania tej operacji" });
  });

  test("returns error on unknown service error", async () => {
    mocks.deleteProject.mockResolvedValue([SupabaseServiceError.unknown(), null]);
    const result = await deleteProjectAction("proj-1");
    expect(result).toEqual({ success: false, error: "Wystąpił błąd serwera. Spróbuj ponownie." });
  });

  test("sets toast and redirects to projects list on success", async () => {
    mocks.deleteProject.mockResolvedValue([null, { id: "proj-1" }]);
    await deleteProjectAction("proj-1");
    expect(mocks.setToastCookie).toHaveBeenCalledWith("Projekt został usunięty");
    expect(mocks.redirect).toHaveBeenCalledWith("/app/projects");
  });

  test("calls service with correct contractorId and projectId", async () => {
    mocks.deleteProject.mockResolvedValue([null, { id: "proj-1" }]);
    await deleteProjectAction("proj-1");
    expect(mocks.deleteProject).toHaveBeenCalledWith({ contractorId: "user-1", projectId: "proj-1" });
  });
});

// ─── updateProjectStatusAction ───────────────────────────────────────────────

describe("updateProjectStatusAction", () => {
  test("returns error when unauthenticated", async () => {
    mocks.auth.mockResolvedValue(UNAUTHENTICATED);
    const result = await updateProjectStatusAction("proj-1", ProjectStatus.ACTIVE);
    expect(result).toEqual({ success: false, error: "Nie jesteś zalogowany" });
    expect(mocks.updateProjectStatus).not.toHaveBeenCalled();
  });

  test("returns error when service fails with not_found", async () => {
    mocks.updateProjectStatus.mockResolvedValue([SupabaseServiceError.notFound("Project"), null]);
    const result = await updateProjectStatusAction("proj-1", ProjectStatus.ACTIVE);
    expect(result).toEqual({ success: false, error: "Nie znaleziono wymaganego zasobu" });
  });

  test("returns error when permission denied", async () => {
    mocks.updateProjectStatus.mockResolvedValue([SupabaseServiceError.unauthorized(), null]);
    const result = await updateProjectStatusAction("proj-1", ProjectStatus.ACTIVE);
    expect(result).toEqual({ success: false, error: "Brak uprawnień do wykonania tej operacji" });
  });

  test("returns error on unknown service error", async () => {
    mocks.updateProjectStatus.mockResolvedValue([SupabaseServiceError.unknown(), null]);
    const result = await updateProjectStatusAction("proj-1", ProjectStatus.ACTIVE);
    expect(result).toEqual({ success: false, error: "Wystąpił błąd serwera. Spróbuj ponownie." });
  });

  test("revalidates project and projects paths on success", async () => {
    mocks.updateProjectStatus.mockResolvedValue([null, undefined]);
    await updateProjectStatusAction("proj-1", ProjectStatus.ACTIVE);
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/app/projects/proj-1");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/app/projects");
  });

  test("returns success with activation message when status is ACTIVE", async () => {
    mocks.updateProjectStatus.mockResolvedValue([null, undefined]);
    const result = await updateProjectStatusAction("proj-1", ProjectStatus.ACTIVE);
    expect(result).toEqual({ success: true, data: undefined, message: "Projekt został aktywowany" });
  });

  test("returns success with completion message when status is COMPLETED", async () => {
    mocks.updateProjectStatus.mockResolvedValue([null, undefined]);
    const result = await updateProjectStatusAction("proj-1", ProjectStatus.COMPLETED);
    expect(result).toEqual({ success: true, data: undefined, message: "Projekt został zakończony" });
  });

  test("calls service with correct contractorId, projectId and newStatus", async () => {
    mocks.updateProjectStatus.mockResolvedValue([null, undefined]);
    await updateProjectStatusAction("proj-1", ProjectStatus.ACTIVE);
    expect(mocks.updateProjectStatus).toHaveBeenCalledWith({
      contractorId: "user-1",
      projectId: "proj-1",
      newStatus: ProjectStatus.ACTIVE
    });
  });
});

// ─── updateStepCompletionAction ──────────────────────────────────────────────

describe("updateStepCompletionAction", () => {
  test("returns error when unauthenticated", async () => {
    mocks.auth.mockResolvedValue(UNAUTHENTICATED);
    const result = await updateStepCompletionAction("step-1", "proj-1", true);
    expect(result).toEqual({ success: false, error: "Nie jesteś zalogowany" });
    expect(mocks.updateStepCompletion).not.toHaveBeenCalled();
  });

  test("returns error when service fails with not_found", async () => {
    mocks.updateStepCompletion.mockResolvedValue([SupabaseServiceError.notFound("ProjectStep"), null]);
    const result = await updateStepCompletionAction("step-1", "proj-1", true);
    expect(result).toEqual({ success: false, error: "Nie znaleziono wymaganego zasobu" });
  });

  test("returns error when permission denied", async () => {
    mocks.updateStepCompletion.mockResolvedValue([SupabaseServiceError.unauthorized(), null]);
    const result = await updateStepCompletionAction("step-1", "proj-1", true);
    expect(result).toEqual({ success: false, error: "Brak uprawnień do wykonania tej operacji" });
  });

  test("returns error on unknown service error", async () => {
    mocks.updateStepCompletion.mockResolvedValue([SupabaseServiceError.unknown(), null]);
    const result = await updateStepCompletionAction("step-1", "proj-1", true);
    expect(result).toEqual({ success: false, error: "Wystąpił błąd serwera. Spróbuj ponownie." });
  });

  test("revalidates project path on success", async () => {
    mocks.updateStepCompletion.mockResolvedValue([null, undefined]);
    await updateStepCompletionAction("step-1", "proj-1", true);
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/app/projects/proj-1");
  });

  test("returns success on step marked completed", async () => {
    mocks.updateStepCompletion.mockResolvedValue([null, undefined]);
    const result = await updateStepCompletionAction("step-1", "proj-1", true);
    expect(result).toEqual({ success: true, data: undefined });
  });

  test("returns success on step marked uncompleted", async () => {
    mocks.updateStepCompletion.mockResolvedValue([null, undefined]);
    const result = await updateStepCompletionAction("step-1", "proj-1", false);
    expect(result).toEqual({ success: true, data: undefined });
  });

  test("calls service with correct arguments", async () => {
    mocks.updateStepCompletion.mockResolvedValue([null, undefined]);
    await updateStepCompletionAction("step-1", "proj-1", true);
    expect(mocks.updateStepCompletion).toHaveBeenCalledWith({
      contractorId: "user-1",
      stepId: "step-1",
      projectId: "proj-1",
      isCompleted: true
    });
  });
});

// ─── updateClientViewAction ──────────────────────────────────────────────────

describe("updateClientViewAction", () => {
  test("does nothing when token is empty string", async () => {
    await updateClientViewAction("");
    expect(mocks.getProjectByPublicToken).not.toHaveBeenCalled();
    expect(mocks.trackClientView).not.toHaveBeenCalled();
  });

  test("does nothing when project not found", async () => {
    mocks.getProjectByPublicToken.mockResolvedValue([SupabaseServiceError.notFound("Project"), null]);
    await updateClientViewAction("valid-token");
    expect(mocks.trackClientView).not.toHaveBeenCalled();
  });

  test("tracks client view when project found", async () => {
    mocks.getProjectByPublicToken.mockResolvedValue([null, { id: "proj-1" }]);
    await updateClientViewAction("valid-token");
    expect(mocks.trackClientView).toHaveBeenCalledWith({ projectId: "proj-1" });
  });

  test("calls getProjectByPublicToken with the token", async () => {
    mocks.getProjectByPublicToken.mockResolvedValue([null, { id: "proj-1" }]);
    mocks.trackClientView.mockResolvedValue(undefined);
    await updateClientViewAction("abc123token");
    expect(mocks.getProjectByPublicToken).toHaveBeenCalledWith({ token: "abc123token" });
  });
});
