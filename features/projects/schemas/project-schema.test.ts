import { projectSchema } from "./project-schema";

const VALID_CLIENT_EXISTING = {
  mode: "existing" as const,
  clientId: "client-uuid-123"
};

const VALID_CLIENT_NEW = {
  mode: "new" as const,
  name: "Jan Kowalski",
  email: "jan@example.com",
  phone: null
};

const VALID_PROJECT_EXISTING_CLIENT = {
  name: "Projekt remontowy",
  description: null,
  templateId: "template-uuid-123",
  client: VALID_CLIENT_EXISTING
};

const VALID_PROJECT_NEW_CLIENT = {
  name: "Projekt remontowy",
  description: null,
  templateId: "template-uuid-123",
  client: VALID_CLIENT_NEW
};

describe("projectSchema", () => {
  test("accepts valid project with existing client", () => {
    expect(projectSchema.safeParse(VALID_PROJECT_EXISTING_CLIENT).success).toBe(true);
  });

  test("accepts valid project with new client", () => {
    expect(projectSchema.safeParse(VALID_PROJECT_NEW_CLIENT).success).toBe(true);
  });

  describe("name", () => {
    test("accepts exactly 3 characters (min boundary)", () => {
      expect(projectSchema.safeParse({ ...VALID_PROJECT_EXISTING_CLIENT, name: "ABC" }).success).toBe(true);
    });

    test("accepts max 100 characters", () => {
      expect(projectSchema.safeParse({ ...VALID_PROJECT_EXISTING_CLIENT, name: "A".repeat(100) }).success).toBe(true);
    });

    test("rejects name shorter than 3 characters", () => {
      const result = projectSchema.safeParse({ ...VALID_PROJECT_EXISTING_CLIENT, name: "AB" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Nazwa musi mieć co najmniej 3 znaki");
      }
    });

    test("rejects empty string", () => {
      const result = projectSchema.safeParse({ ...VALID_PROJECT_EXISTING_CLIENT, name: "" });
      expect(result.success).toBe(false);
    });

    test("rejects name longer than 100 characters", () => {
      const result = projectSchema.safeParse({ ...VALID_PROJECT_EXISTING_CLIENT, name: "A".repeat(101) });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Nazwa nie może przekraczać 100 znaków");
      }
    });
  });

  describe("description", () => {
    test("accepts null", () => {
      expect(projectSchema.safeParse({ ...VALID_PROJECT_EXISTING_CLIENT, description: null }).success).toBe(true);
    });

    test("accepts empty string", () => {
      expect(projectSchema.safeParse({ ...VALID_PROJECT_EXISTING_CLIENT, description: "" }).success).toBe(true);
    });

    test("accepts max 500 characters", () => {
      expect(projectSchema.safeParse({ ...VALID_PROJECT_EXISTING_CLIENT, description: "A".repeat(500) }).success).toBe(
        true
      );
    });

    test("rejects description longer than 500 characters", () => {
      const result = projectSchema.safeParse({ ...VALID_PROJECT_EXISTING_CLIENT, description: "A".repeat(501) });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Opis nie może przekraczać 500 znaków");
      }
    });
  });

  describe("templateId", () => {
    test("rejects empty string", () => {
      const result = projectSchema.safeParse({ ...VALID_PROJECT_EXISTING_CLIENT, templateId: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Szablon jest wymagany");
      }
    });
  });

  describe("client discriminated union", () => {
    describe("mode: existing", () => {
      test("accepts existing client with valid clientId", () => {
        expect(
          projectSchema.safeParse({
            ...VALID_PROJECT_EXISTING_CLIENT,
            client: { mode: "existing", clientId: "valid-id" }
          }).success
        ).toBe(true);
      });

      test("rejects existing client with empty clientId", () => {
        const result = projectSchema.safeParse({
          ...VALID_PROJECT_EXISTING_CLIENT,
          client: { mode: "existing", clientId: "" }
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]?.message).toBe("Klient jest wymagany");
        }
      });
    });

    describe("mode: new", () => {
      test("accepts new client with all required fields", () => {
        expect(
          projectSchema.safeParse({
            ...VALID_PROJECT_NEW_CLIENT,
            client: VALID_CLIENT_NEW
          }).success
        ).toBe(true);
      });

      test("rejects new client with invalid email", () => {
        const result = projectSchema.safeParse({
          ...VALID_PROJECT_NEW_CLIENT,
          client: { ...VALID_CLIENT_NEW, email: "not-an-email" }
        });
        expect(result.success).toBe(false);
      });

      test("rejects new client with name too short", () => {
        const result = projectSchema.safeParse({
          ...VALID_PROJECT_NEW_CLIENT,
          client: { ...VALID_CLIENT_NEW, name: "A" }
        });
        expect(result.success).toBe(false);
      });

      test("rejects when mode is missing", () => {
        const result = projectSchema.safeParse({
          ...VALID_PROJECT_NEW_CLIENT,
          client: { clientId: "some-id" }
        });
        expect(result.success).toBe(false);
      });
    });
  });
});
