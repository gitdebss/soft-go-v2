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
});
