const mocks = vi.hoisted(() => ({
  requireRole: vi.fn(),
  getPlanFeatures: vi.fn(),
  getTemplateListByContractor: vi.fn(),
  getTemplateCountByContractor: vi.fn(),
  getTemplateById: vi.fn(),
  createTemplate: vi.fn(),
  updateTemplate: vi.fn(),
  deleteTemplate: vi.fn(),
  canAddTemplate: vi.fn()
}));

vi.mock("~/features/auth/server/api/require-role", () => ({ requireRole: mocks.requireRole }));
vi.mock("~/features/billing/server", () => ({ getPlanFeatures: mocks.getPlanFeatures }));
vi.mock("~/features/templates/server/db/queries", () => ({
  getTemplateListByContractor: mocks.getTemplateListByContractor,
  getTemplateCountByContractor: mocks.getTemplateCountByContractor,
  getTemplateById: mocks.getTemplateById
}));
vi.mock("~/features/templates/server/db/mutations", () => ({
  createTemplate: mocks.createTemplate,
  updateTemplate: mocks.updateTemplate,
  deleteTemplate: mocks.deleteTemplate
}));
vi.mock("~/features/templates/server/permissions", () => ({ canAddTemplate: mocks.canAddTemplate }));

import {
  createTemplate,
  deleteTemplate,
  duplicateTemplate,
  getTemplateLimits,
  getTemplateList,
  updateTemplate
} from "~/features/templates/server/services/templates.service";
import { templateFormBuilder } from "~/features/templates/test/builders/template-form.builder";
import { templateBuilder } from "~/features/templates/test/builders/template.builder";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const contractorId = "contractor-123";
const templateId = "template-789";

const dbError = { code: "unknown", message: "DB error" };
const roleError = { code: "permission_denied", message: "Role check failed" };
const ownershipError = { code: "unauthorized", message: "Access denied" };

// ─── Helper: setup common happy-path mocks ────────────────────────────────────

function setupRole() {
  mocks.requireRole.mockResolvedValue([null, undefined]);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("templates.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // getTemplateList
  // ---------------------------------------------------------------------------

  describe("getTemplateList", () => {
    const options = { page: 1, perPage: 10 };

    test("delegates to getTemplateListByContractor with contractorId", async () => {
      const listResult = { items: [], pagination: {} };
      mocks.getTemplateListByContractor.mockResolvedValue([null, listResult]);

      const [err, result] = await getTemplateList({ contractorId, options });

      expect(err).toBeNull();
      expect(result).toBe(listResult);
      expect(mocks.getTemplateListByContractor).toHaveBeenCalledWith({ contractorId, options });
    });
  });

  // ---------------------------------------------------------------------------
  // getTemplateLimits
  // ---------------------------------------------------------------------------

  describe("getTemplateLimits", () => {
    test("returns error when getTemplateCountByContractor fails", async () => {
      mocks.getTemplateCountByContractor.mockResolvedValue([dbError, null]);

      const [err, result] = await getTemplateLimits({ contractorId });

      expect(err).toBe(dbError);
      expect(result).toBeNull();
      expect(mocks.getPlanFeatures).not.toHaveBeenCalled();
    });

    test("returns used and max from plan features on success", async () => {
      mocks.getTemplateCountByContractor.mockResolvedValue([null, 3]);
      mocks.getPlanFeatures.mockResolvedValue({
        limitations: { templates: 10 }
      });

      const [err, result] = await getTemplateLimits({ contractorId });

      expect(err).toBeNull();
      expect(result).toEqual({ used: 3, max: 10 });
    });

    test("returns null max when plan has unlimited templates", async () => {
      mocks.getTemplateCountByContractor.mockResolvedValue([null, 5]);
      mocks.getPlanFeatures.mockResolvedValue({
        limitations: { templates: null }
      });

      const [err, result] = await getTemplateLimits({ contractorId });

      expect(err).toBeNull();
      expect(result).toEqual({ used: 5, max: null });
    });
  });

  // ---------------------------------------------------------------------------
  // createTemplate
  // ---------------------------------------------------------------------------

  describe("createTemplate", () => {
    const formData = templateFormBuilder.one();

    test("returns error when requireRole fails", async () => {
      mocks.requireRole.mockResolvedValue([roleError, null]);

      const [err, result] = await createTemplate({ contractorId, formData });

      expect(err).toBe(roleError);
      expect(result).toBeNull();
      expect(mocks.canAddTemplate).not.toHaveBeenCalled();
    });

    test("returns error when canAddTemplate fails (limit reached)", async () => {
      setupRole();
      const limitError = { code: "limit_exceeded", message: "Limit reached" };
      mocks.canAddTemplate.mockResolvedValue([limitError, null]);

      const [err, result] = await createTemplate({ contractorId, formData });

      expect(err).toBe(limitError);
      expect(result).toBeNull();
      expect(mocks.createTemplate).not.toHaveBeenCalled();
    });

    test("returns error when createTemplate DB call fails", async () => {
      setupRole();
      mocks.canAddTemplate.mockResolvedValue([null, undefined]);
      mocks.createTemplate.mockResolvedValue([dbError, null]);

      const [err, result] = await createTemplate({ contractorId, formData });

      expect(err).toBe(dbError);
      expect(result).toBeNull();
    });

    test("creates template and returns it on success", async () => {
      setupRole();
      mocks.canAddTemplate.mockResolvedValue([null, undefined]);
      const template = templateBuilder.one({ overrides: { contractorId } });
      mocks.createTemplate.mockResolvedValue([null, template]);

      const [err, result] = await createTemplate({ contractorId, formData });

      expect(err).toBeNull();
      expect(result).toBe(template);
    });

    test("calls createTemplate with correct contractorId and mapped step data", async () => {
      setupRole();
      mocks.canAddTemplate.mockResolvedValue([null, undefined]);
      const template = templateBuilder.one({ overrides: { contractorId } });
      mocks.createTemplate.mockResolvedValue([null, template]);

      await createTemplate({ contractorId, formData });

      expect(mocks.createTemplate).toHaveBeenCalledWith({
        contractorId,
        createTemplateData: expect.objectContaining({
          name: formData.name,
          description: formData.description,
          steps: formData.steps.map((s, i) => ({
            title: s.title,
            description: s.description ?? null,
            orderIndex: i
          }))
        })
      });
    });
  });

  // ---------------------------------------------------------------------------
  // updateTemplate
  // ---------------------------------------------------------------------------

  describe("updateTemplate", () => {
    const formData = templateFormBuilder.one();

    test("returns error when requireRole fails", async () => {
      mocks.requireRole.mockResolvedValue([roleError, null]);

      const [err, result] = await updateTemplate({ contractorId, templateId, formData });

      expect(err).toBe(roleError);
      expect(result).toBeNull();
    });

    test("returns error when ownership check fails (template not found)", async () => {
      setupRole();
      const notFoundError = { code: "not_found", message: "Template not found" };
      mocks.getTemplateById.mockResolvedValue([notFoundError, null]);

      const [err, result] = await updateTemplate({ contractorId, templateId, formData });

      expect(err).toBe(notFoundError);
      expect(result).toBeNull();
      expect(mocks.updateTemplate).not.toHaveBeenCalled();
    });

    test("returns error when ownership check fails (belongs to another contractor)", async () => {
      setupRole();
      const otherContractorTemplate = templateBuilder.one({
        overrides: { contractorId: "other-contractor-id" }
      });
      mocks.getTemplateById.mockResolvedValue([null, otherContractorTemplate]);

      const [err, result] = await updateTemplate({ contractorId, templateId, formData });

      expect(err).not.toBeNull();
      expect(err?.code).toBe("unauthorized");
      expect(result).toBeNull();
    });

    test("returns error when updateTemplate DB call fails", async () => {
      setupRole();
      const ownedTemplate = templateBuilder.one({ overrides: { contractorId, id: templateId } });
      mocks.getTemplateById.mockResolvedValue([null, ownedTemplate]);
      mocks.updateTemplate.mockResolvedValue([dbError, null]);

      const [err, result] = await updateTemplate({ contractorId, templateId, formData });

      expect(err).toBe(dbError);
      expect(result).toBeNull();
    });

    test("updates template and returns it on success", async () => {
      setupRole();
      const ownedTemplate = templateBuilder.one({ overrides: { contractorId, id: templateId } });
      const updatedTemplate = templateBuilder.one({
        overrides: { contractorId, id: templateId, name: formData.name }
      });
      mocks.getTemplateById.mockResolvedValue([null, ownedTemplate]);
      mocks.updateTemplate.mockResolvedValue([null, updatedTemplate]);

      const [err, result] = await updateTemplate({ contractorId, templateId, formData });

      expect(err).toBeNull();
      expect(result).toBe(updatedTemplate);
    });

    test("calls updateTemplate with mapped steps including orderIndex", async () => {
      setupRole();
      const ownedTemplate = templateBuilder.one({ overrides: { contractorId, id: templateId } });
      const updatedTemplate = templateBuilder.one({ overrides: { contractorId, id: templateId } });
      mocks.getTemplateById.mockResolvedValue([null, ownedTemplate]);
      mocks.updateTemplate.mockResolvedValue([null, updatedTemplate]);

      await updateTemplate({ contractorId, templateId, formData });

      expect(mocks.updateTemplate).toHaveBeenCalledWith({
        id: templateId,
        updateInput: {
          name: formData.name,
          description: formData.description,
          steps: formData.steps.map((s, i) => ({ title: s.title, description: s.description ?? null, orderIndex: i }))
        }
      });
    });
  });

  // ---------------------------------------------------------------------------
  // deleteTemplate
  // ---------------------------------------------------------------------------

  describe("deleteTemplate", () => {
    test("returns error when requireRole fails", async () => {
      mocks.requireRole.mockResolvedValue([roleError, null]);

      const [err, result] = await deleteTemplate({ contractorId, templateId });

      expect(err).toBe(roleError);
      expect(result).toBeNull();
    });

    test("returns error when ownership check fails", async () => {
      setupRole();
      mocks.getTemplateById.mockResolvedValue([ownershipError, null]);

      const [err, result] = await deleteTemplate({ contractorId, templateId });

      expect(err).toBe(ownershipError);
      expect(result).toBeNull();
      expect(mocks.deleteTemplate).not.toHaveBeenCalled();
    });

    test("returns error when deleteTemplate DB call fails", async () => {
      setupRole();
      const ownedTemplate = templateBuilder.one({ overrides: { contractorId, id: templateId } });
      mocks.getTemplateById.mockResolvedValue([null, ownedTemplate]);
      mocks.deleteTemplate.mockResolvedValue([dbError, null]);

      const [err, result] = await deleteTemplate({ contractorId, templateId });

      expect(err).toBe(dbError);
      expect(result).toBeNull();
    });

    test("returns id on successful deletion", async () => {
      setupRole();
      const ownedTemplate = templateBuilder.one({ overrides: { contractorId, id: templateId } });
      mocks.getTemplateById.mockResolvedValue([null, ownedTemplate]);
      mocks.deleteTemplate.mockResolvedValue([null, ownedTemplate]);

      const [err, result] = await deleteTemplate({ contractorId, templateId });

      expect(err).toBeNull();
      expect(result).toEqual({ id: templateId });
    });
  });

  // ---------------------------------------------------------------------------
  // duplicateTemplate
  // ---------------------------------------------------------------------------

  describe("duplicateTemplate", () => {
    test("returns error when requireRole fails", async () => {
      mocks.requireRole.mockResolvedValue([roleError, null]);

      const [err, result] = await duplicateTemplate({ contractorId, templateId });

      expect(err).toBe(roleError);
      expect(result).toBeNull();
    });

    test("returns error when canAddTemplate fails (limit reached)", async () => {
      setupRole();
      const limitError = { code: "limit_exceeded", message: "Limit reached" };
      mocks.canAddTemplate.mockResolvedValue([limitError, null]);

      const [err, result] = await duplicateTemplate({ contractorId, templateId });

      expect(err).toBe(limitError);
      expect(result).toBeNull();
      expect(mocks.getTemplateById).not.toHaveBeenCalled();
    });

    test("returns error when ownership check fails", async () => {
      setupRole();
      mocks.canAddTemplate.mockResolvedValue([null, undefined]);
      mocks.getTemplateById.mockResolvedValue([ownershipError, null]);

      const [err, result] = await duplicateTemplate({ contractorId, templateId });

      expect(err).toBe(ownershipError);
      expect(result).toBeNull();
      expect(mocks.createTemplate).not.toHaveBeenCalled();
    });

    test("returns error when createTemplate DB call fails", async () => {
      setupRole();
      mocks.canAddTemplate.mockResolvedValue([null, undefined]);
      const ownedTemplate = templateBuilder.one({
        overrides: { contractorId, id: templateId, name: "Original Name" }
      });
      mocks.getTemplateById.mockResolvedValue([null, ownedTemplate]);
      mocks.createTemplate.mockResolvedValue([dbError, null]);

      const [err, result] = await duplicateTemplate({ contractorId, templateId });

      expect(err).toBe(dbError);
      expect(result).toBeNull();
    });

    test("returns the duplicated template on success", async () => {
      setupRole();
      mocks.canAddTemplate.mockResolvedValue([null, undefined]);
      const ownedTemplate = templateBuilder.one({
        overrides: { contractorId, id: templateId, name: "Original Name" }
      });
      const newTemplate = templateBuilder.one({
        overrides: { contractorId, name: "[Kopia] Original Name" }
      });
      mocks.getTemplateById.mockResolvedValue([null, ownedTemplate]);
      mocks.createTemplate.mockResolvedValue([null, newTemplate]);

      const [err, result] = await duplicateTemplate({ contractorId, templateId });

      expect(err).toBeNull();
      expect(result).toBe(newTemplate);
    });

    test("calls createTemplate with '[Kopia] <original name>' and copies steps from existing template", async () => {
      setupRole();
      mocks.canAddTemplate.mockResolvedValue([null, undefined]);
      const ownedTemplate = templateBuilder.one({
        overrides: { contractorId, id: templateId, name: "My Template" }
      });
      const newTemplate = templateBuilder.one({
        overrides: { contractorId, name: "[Kopia] My Template" }
      });
      mocks.getTemplateById.mockResolvedValue([null, ownedTemplate]);
      mocks.createTemplate.mockResolvedValue([null, newTemplate]);

      await duplicateTemplate({ contractorId, templateId });

      expect(mocks.createTemplate).toHaveBeenCalledWith({
        contractorId,
        createTemplateData: {
          name: "[Kopia] My Template",
          description: ownedTemplate.description,
          steps: ownedTemplate.steps
        }
      });
    });
  });
});
