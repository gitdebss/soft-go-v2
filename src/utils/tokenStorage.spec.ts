import { beforeEach, describe, it, expect } from "vitest";
import { tokenStorage } from "./tokenStorage";

describe("tokenStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when no token was ever set", () => {
    expect(tokenStorage.getToken()).toBeNull();
  });

  it("round-trips a token through setToken/getToken", () => {
    tokenStorage.setToken("jwt.token.value");

    expect(tokenStorage.getToken()).toBe("jwt.token.value");
  });

  it("removes the token so getToken returns null after clearToken", () => {
    tokenStorage.setToken("jwt.token.value");

    tokenStorage.clearToken();

    expect(tokenStorage.getToken()).toBeNull();
  });
});
