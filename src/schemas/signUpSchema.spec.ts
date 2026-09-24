import { describe, it, expect } from "vitest";
import { signUpSchema } from "./signUpSchema";

function validData(overrides: Partial<Record<string, string>> = {}) {
  return {
    name: "Ana Souza",
    email: "ana@example.com",
    password: "password123",
    confirmPassword: "password123",
    ...overrides,
  };
}

describe("signUpSchema", () => {
  it("accepts valid data", () => {
    const result = signUpSchema.safeParse(validData());

    expect(result.success).toBe(true);
  });

  it("accepts an empty phone, because the field is optional (JOIN-12)", () => {
    const result = signUpSchema.safeParse(validData({ phone: "" }));

    expect(result.success).toBe(true);
  });

  it("accepts a masked Brazilian mobile number (JOIN-12)", () => {
    const result = signUpSchema.safeParse(validData({ phone: "(51) 99999-9999" }));

    expect(result.success).toBe(true);
  });

  it("rejects a malformed phone with the exact message (JOIN-12)", () => {
    const result = signUpSchema.safeParse(validData({ phone: "51999" }));

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Informe um celular válido. Ex: (51) 99999-9999",
    );
  });

  it("rejects an empty name", () => {
    const result = signUpSchema.safeParse(validData({ name: "" }));

    expect(result.success).toBe(false);
  });

  it("rejects a name longer than 100 characters", () => {
    const result = signUpSchema.safeParse(validData({ name: "a".repeat(101) }));

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email format", () => {
    const result = signUpSchema.safeParse(validData({ email: "not-an-email" }));

    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = signUpSchema.safeParse(
      validData({ password: "short1", confirmPassword: "short1" }),
    );

    expect(result.success).toBe(false);
  });

  it("rejects when password and confirmPassword do not match", () => {
    const result = signUpSchema.safeParse(
      validData({ password: "password123", confirmPassword: "different123" }),
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes("confirmPassword"))).toBe(
        true,
      );
    }
  });

  it("rejects an empty confirmPassword", () => {
    const result = signUpSchema.safeParse(validData({ confirmPassword: "" }));

    expect(result.success).toBe(false);
  });

  it("rejects a whitespace-only password with a required message, not the min-length one", () => {
    const result = signUpSchema.safeParse(
      validData({ password: "        ", confirmPassword: "        " }),
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordIssue = result.error.issues.find(
        (issue) => issue.path.length === 1 && issue.path[0] === "password",
      );
      expect(passwordIssue?.message).toBe("A senha é obrigatória");
    }
  });

  it("rejects a whitespace-only name", () => {
    const result = signUpSchema.safeParse(validData({ name: "   " }));

    expect(result.success).toBe(false);
  });

  it("accepts a name and password with real content surrounded by leading/trailing whitespace, without mutating the submitted password", () => {
    const result = signUpSchema.safeParse(
      validData({
        name: "  Ana Souza  ",
        password: "  password123  ",
        confirmPassword: "  password123  ",
      }),
    );

    expect(result.success).toBe(true);
    if (result.success) {
      // name is safe to trim (display-only, no round-trip comparison).
      expect(result.data.name).toBe("Ana Souza");
      // password must reach the submit payload exactly as typed - trimming it
      // here would hash a different string at signup than a later login
      // (which never trims) would send.
      expect(result.data.password).toBe("  password123  ");
      expect(result.data.confirmPassword).toBe("  password123  ");
    }
  });
});
