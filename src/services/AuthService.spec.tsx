import { describe, it, expect, vi, beforeEach } from "vitest";

const postMock = vi.fn();
const getMock = vi.fn();

vi.mock("../lib/apiClient", () => ({
  apiClient: {
    post: (...args: unknown[]) => postMock(...args),
    get: (...args: unknown[]) => getMock(...args),
  },
}));

import { AuthService } from "./AuthService";

describe("AuthService", () => {
  const authService = new AuthService();

  beforeEach(() => {
    postMock.mockReset();
    getMock.mockReset();
  });

  it("signUp posts to /auth/signup with the given payload and returns the response envelope", async () => {
    const envelope = {
      statusCode: 201,
      message: "Success",
      data: { id: 1, name: "Ana Souza", email: "ana@example.com" },
    };
    postMock.mockResolvedValue({ data: envelope });

    const payload = {
      name: "Ana Souza",
      email: "ana@example.com",
      password: "password123",
    };
    const result = await authService.signUp(payload);

    expect(postMock).toHaveBeenCalledWith("/auth/signup", payload);
    expect(result).toEqual(envelope);
  });

  it("signIn posts to /auth/login with the given payload and returns { accessToken }", async () => {
    const envelope = {
      statusCode: 200,
      message: "Success",
      data: { accessToken: "jwt.token.value" },
    };
    postMock.mockResolvedValue({ data: envelope });

    const payload = { email: "ana@example.com", password: "password123" };
    const result = await authService.signIn(payload);

    expect(postMock).toHaveBeenCalledWith("/auth/login", payload);
    expect(result).toEqual({ accessToken: "jwt.token.value" });
  });

  it("getMe calls GET /auth/me and returns the response envelope", async () => {
    const envelope = {
      statusCode: 200,
      message: "Success",
      data: { id: 1, name: "Ana Souza", email: "ana@example.com" },
    };
    getMock.mockResolvedValue({ data: envelope });

    const result = await authService.getMe();

    expect(getMock).toHaveBeenCalledWith("/auth/me");
    expect(result).toEqual(envelope);
  });
});
