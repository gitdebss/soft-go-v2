import { describe, it, expect, vi, beforeEach } from "vitest";

const postMock = vi.fn();
const getMock = vi.fn();
const deleteMock = vi.fn();

vi.mock("../lib/apiClient", () => ({
  apiClient: {
    post: (...args: unknown[]) => postMock(...args),
    get: (...args: unknown[]) => getMock(...args),
    delete: (...args: unknown[]) => deleteMock(...args),
  },
}));

import { UserRideService } from "./UserRideService";

describe("UserRideService", () => {
  const userRideService = new UserRideService();

  beforeEach(() => {
    postMock.mockReset();
    getMock.mockReset();
    deleteMock.mockReset();
  });

  it("confirms presence with a POST carrying no body (JOIN-02)", async () => {
    postMock.mockResolvedValue({
      data: { statusCode: 201, message: "Success", data: { id: 1, name: "Ana" } },
    });

    await userRideService.createUserRide(42);

    expect(postMock).toHaveBeenCalledWith("/user-ride/42");
    expect(postMock.mock.calls[0]).toHaveLength(1);
  });

  it("fetches the passengers of a ride through the authenticated client (JOIN-21)", async () => {
    getMock.mockResolvedValue({
      data: { statusCode: 200, message: "Success", data: [] },
    });

    const result = await userRideService.getUsersByRideId(42);

    expect(getMock).toHaveBeenCalledWith("/user-ride/42");
    expect(result.data).toEqual([]);
  });

  it("cancels the presence with a DELETE carrying no body (LEAVE-03)", async () => {
    deleteMock.mockResolvedValue({
      data: { statusCode: 200, message: "Success", data: { id: 42 } },
    });

    const result = await userRideService.cancelUserRide(42);

    expect(deleteMock).toHaveBeenCalledWith("/user-ride/42");
    expect(deleteMock.mock.calls[0]).toHaveLength(1);
    expect(result.data).toEqual({ id: 42 });
  });

  it("no longer offers a global passenger listing (JOIN-24)", () => {
    expect(
      (userRideService as unknown as Record<string, unknown>).getAllUsers,
    ).toBeUndefined();
  });
});
