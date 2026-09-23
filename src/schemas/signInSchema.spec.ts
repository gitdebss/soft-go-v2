import { describe, it, expect } from "vitest";
import { signInSchema } from "./signInSchema";

describe("signInSchema", () => {
  it("accepts valid data", () => {
    const result = signInSchema.safeParse({
      email: "ana@example.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid email format", () => {
    const result = signInSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty email", () => {
    const result = signInSchema.safeParse({ email: "", password: "password123" });

    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = signInSchema.safeParse({ email: "ana@example.com", password: "" });

    expect(result.success).toBe(false);
  });
});
