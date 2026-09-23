import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { tokenStorage } from "../utils/tokenStorage";

const { signUpMock, signInMock, getMeMock } = vi.hoisted(() => ({
  signUpMock: vi.fn(),
  signInMock: vi.fn(),
  getMeMock: vi.fn(),
}));

vi.mock("../services/AuthService", () => ({
  AuthService: class {
    signUp = signUpMock;
    signIn = signInMock;
    getMe = getMeMock;
  },
}));

import { AuthProvider, useAuth } from "./AuthContext";

function base64UrlEncode(input: string): string {
  return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function buildToken(payload: object): string {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  return `${header}.${body}.fakesignature`;
}

const validPayload = {
  sub: 1,
  name: "Ana Souza",
  email: "ana@example.com",
  exp: Math.floor(Date.now() / 1000) + 3600,
};

const expiredPayload = {
  sub: 1,
  name: "Ana Souza",
  email: "ana@example.com",
  exp: Math.floor(Date.now() / 1000) - 3600,
};

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    signUpMock.mockReset();
    signInMock.mockReset();
    getMeMock.mockReset();
  });

  it("has no token on mount -> isAuthenticated is false once loading finishes", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("has a valid token on mount -> isAuthenticated is true and user is populated", async () => {
    tokenStorage.setToken(buildToken(validPayload));
    getMeMock.mockResolvedValue({
      statusCode: 200,
      message: "Success",
      data: { id: 1, name: "Ana Souza", email: "ana@example.com" },
    });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({
      id: 1,
      name: "Ana Souza",
      email: "ana@example.com",
    });
  });

  it("has an expired token on mount -> session is cleared and isAuthenticated is false", async () => {
    tokenStorage.setToken(buildToken(expiredPayload));

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(tokenStorage.getToken()).toBeNull();
    expect(getMeMock).not.toHaveBeenCalled();
  });

  it("signIn success stores the token and updates user/isAuthenticated", async () => {
    const token = buildToken(validPayload);
    signInMock.mockResolvedValue({ accessToken: token });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.signIn({
        email: "ana@example.com",
        password: "password123",
      });
    });

    expect(tokenStorage.getToken()).toBe(token);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({
      id: 1,
      name: "Ana Souza",
      email: "ana@example.com",
    });
  });

  it("logout clears the token and resets user/isAuthenticated", async () => {
    const token = buildToken(validPayload);
    signInMock.mockResolvedValue({ accessToken: token });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.signIn({
        email: "ana@example.com",
        password: "password123",
      });
    });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(tokenStorage.getToken()).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
