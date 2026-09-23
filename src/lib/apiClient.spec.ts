import { describe, it, expect, vi, beforeEach } from "vitest";

const getTokenMock = vi.fn();
const clearTokenMock = vi.fn();

vi.mock("../utils/tokenStorage", () => ({
  tokenStorage: {
    getToken: () => getTokenMock(),
    setToken: vi.fn(),
    clearToken: () => clearTokenMock(),
  },
}));

import { apiClient } from "./apiClient";

// axios does not expose interceptor internals in its public types; cast through
// `unknown` to reach the registered handlers so the interceptor logic itself
// (not axios's types) is what these tests exercise.
type RequestFulfilled = (config: { headers: Record<string, string> }) => unknown;
type ResponseRejected = (error: unknown) => unknown;

function getRequestFulfilled(): RequestFulfilled {
  const handlers = (
    apiClient.interceptors.request as unknown as {
      handlers: Array<{ fulfilled: RequestFulfilled }>;
    }
  ).handlers;
  return handlers[0].fulfilled;
}

function getResponseRejected(): ResponseRejected {
  const handlers = (
    apiClient.interceptors.response as unknown as {
      handlers: Array<{ rejected: ResponseRejected }>;
    }
  ).handlers;
  return handlers[0].rejected;
}

describe("apiClient", () => {
  beforeEach(() => {
    getTokenMock.mockReset();
    clearTokenMock.mockReset();
  });

  it("uses the fallback baseURL when VITE_API_URL is not set", () => {
    expect(apiClient.defaults.baseURL).toBe("http://localhost:3000");
  });

  it("request interceptor attaches Authorization header when a token is present", async () => {
    getTokenMock.mockReturnValue("abc.def.ghi");

    const fulfilled = getRequestFulfilled();
    const config = (await fulfilled({ headers: {} })) as {
      headers: Record<string, string>;
    };

    expect(config.headers.Authorization).toBe("Bearer abc.def.ghi");
  });

  it("request interceptor does not attach Authorization header when there is no token", async () => {
    getTokenMock.mockReturnValue(null);

    const fulfilled = getRequestFulfilled();
    const config = (await fulfilled({ headers: {} })) as {
      headers: Record<string, string>;
    };

    expect(config.headers.Authorization).toBeUndefined();
  });

  it("response interceptor clears the token and rethrows on a 401 response", async () => {
    const rejected = getResponseRejected();
    const error = { response: { status: 401 } };

    await expect(rejected(error)).rejects.toBe(error);
    expect(clearTokenMock).toHaveBeenCalledTimes(1);
  });

  it("response interceptor rethrows without clearing the token on a non-401 response", async () => {
    const rejected = getResponseRejected();
    const error = { response: { status: 500 } };

    await expect(rejected(error)).rejects.toBe(error);
    expect(clearTokenMock).not.toHaveBeenCalled();
  });
});
