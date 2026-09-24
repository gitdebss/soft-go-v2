import { describe, it, expect } from "vitest";
import { rideSchema } from "./rideSchema";

function validData(overrides: Record<string, unknown> = {}) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    date: tomorrow.toISOString().slice(0, 10),
    hour: "08:00",
    city: "São Leopoldo",
    transportTypeId: 1,
    totalSpots: 3,
    ...overrides,
  };
}

describe("rideSchema", () => {
  it("accepts a ride without name or phone, which now come from the account (JOIN-16)", () => {
    const result = rideSchema.safeParse(validData());

    expect(result.success).toBe(true);
  });

  it("no longer parses name or phone into the form data (JOIN-16)", () => {
    const result = rideSchema.safeParse(
      validData({ name: "Digitado", phone: "(51) 99999-9999" }),
    );

    expect(result.success).toBe(true);
    expect(result.data).not.toHaveProperty("name");
    expect(result.data).not.toHaveProperty("phone");
  });

  it("still rejects a city shorter than 3 characters", () => {
    const result = rideSchema.safeParse(validData({ city: "SL" }));

    expect(result.success).toBe(false);
  });

  it("still rejects a ride with no seats", () => {
    const result = rideSchema.safeParse(validData({ totalSpots: 0 }));

    expect(result.success).toBe(false);
  });

  it("still rejects a date in the past", () => {
    const result = rideSchema.safeParse(validData({ date: "2020-01-01" }));

    expect(result.success).toBe(false);
  });
});
