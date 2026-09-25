import { describe, it, expect } from "vitest";
import { classifyRide } from "./classifyRide";

const TODAY = "2026-03-05";

describe("classifyRide", () => {
  it('classifies a canceled ride as "cancelada", whatever the date (MYRIDES-05)', () => {
    expect(classifyRide({ status: "canceled", date: "2020-01-01" }, TODAY)).toBe("cancelada");
    expect(classifyRide({ status: "canceled", date: "2030-01-01" }, TODAY)).toBe("cancelada");
  });

  it('classifies an active ride dated today or later as "ativa" (MYRIDES-03)', () => {
    expect(classifyRide({ status: "active", date: TODAY }, TODAY)).toBe("ativa");
    expect(classifyRide({ status: "active", date: "2030-01-01" }, TODAY)).toBe("ativa");
  });

  it('classifies an active ride dated before today as "inativa" (MYRIDES-04)', () => {
    expect(classifyRide({ status: "active", date: "2020-01-01" }, TODAY)).toBe("inativa");
  });
});
