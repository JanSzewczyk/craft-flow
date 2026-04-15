import { describe, expect, test } from "vitest";

import { templateSchema, templateStepSchema } from "./template-schema";

const validStep = { title: "Projekt", description: null };

describe("templateStepSchema", () => {
  describe("title", () => {
    test("accepts single character", () => {
      expect(templateStepSchema.safeParse({ title: "A", description: null }).success).toBe(true);
    });

    test("accepts max 80 characters", () => {
      expect(templateStepSchema.safeParse({ title: "A".repeat(80), description: null }).success).toBe(true);
    });

    test("rejects empty string", () => {
      const result = templateStepSchema.safeParse({ title: "", description: null });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Nazwa etapu nie może być pusta");
      }
    });

    test("rejects title longer than 80 characters", () => {
      const result = templateStepSchema.safeParse({ title: "A".repeat(81), description: null });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Nazwa etapu nie może przekraczać 80 znaków");
      }
    });
  });

  describe("description", () => {
    test("accepts null", () => {
      expect(templateStepSchema.safeParse({ title: "Projekt", description: null }).success).toBe(true);
    });

    test("accepts string value", () => {
      expect(templateStepSchema.safeParse({ title: "Projekt", description: "Opis etapu" }).success).toBe(true);
    });
  });
});

describe("templateSchema", () => {
  describe("name", () => {
    test("accepts single character", () => {
      expect(templateSchema.safeParse({ name: "A", description: null, steps: [validStep] }).success).toBe(true);
    });

    test("accepts max 255 characters", () => {
      expect(templateSchema.safeParse({ name: "A".repeat(255), description: null, steps: [validStep] }).success).toBe(
        true
      );
    });

    test("rejects empty string", () => {
      const result = templateSchema.safeParse({ name: "", description: null, steps: [validStep] });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Nazwa szablonu nie może być pusta");
      }
    });

    test("rejects name longer than 255 characters", () => {
      const result = templateSchema.safeParse({ name: "A".repeat(256), description: null, steps: [validStep] });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Nazwa szablonu nie może przekraczać 255 znaków");
      }
    });
  });

  describe("description", () => {
    test("accepts null", () => {
      expect(templateSchema.safeParse({ name: "Szablon", description: null, steps: [validStep] }).success).toBe(true);
    });

    test("accepts string value", () => {
      expect(
        templateSchema.safeParse({ name: "Szablon", description: "Opis szablonu", steps: [validStep] }).success
      ).toBe(true);
    });
  });

  describe("steps", () => {
    test("accepts single step", () => {
      expect(templateSchema.safeParse({ name: "Szablon", description: null, steps: [validStep] }).success).toBe(true);
    });

    test("accepts multiple steps", () => {
      expect(
        templateSchema.safeParse({ name: "Szablon", description: null, steps: [validStep, validStep, validStep] })
          .success
      ).toBe(true);
    });

    test("rejects empty steps array", () => {
      const result = templateSchema.safeParse({ name: "Szablon", description: null, steps: [] });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Szablon musi zawierać co najmniej jeden etap");
      }
    });

    test("validates each step in the array", () => {
      const result = templateSchema.safeParse({
        name: "Szablon",
        description: null,
        steps: [{ title: "", description: null }]
      });
      expect(result.success).toBe(false);
    });
  });
});
