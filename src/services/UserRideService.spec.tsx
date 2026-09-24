import { describe, it, expect, vi, beforeEach } from "vitest";

const postMock = vi.fn();
const getMock = vi.fn();

vi.mock("../lib/apiClient", () => ({
  apiClient: {
    post: (...args: unknown[]) => postMock(...args),
    get: (...args: unknown[]) => getMock(...args),
  },
}));

import { UserRideService } from "./UserRideService";

describe("UserRideService", () => {
  const userRideService = new UserRideService();

  beforeEach(() => {
    postMock.mockReset();
    getMock.mockReset();
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

  it("no longer offers a global passenger listing (JOIN-24)", () => {
    expect(
      (userRideService as unknown as Record<string, unknown>).getAllUsers,
    ).toBeUndefined();
  });
});
