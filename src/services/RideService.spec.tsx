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

import { RideService } from "./RideService";

describe("RideService", () => {
  const rideService = new RideService();

  beforeEach(() => {
    postMock.mockReset();
    getMock.mockReset();
    deleteMock.mockReset();
  });

  it("lists rides through the authenticated client, on a relative path (JOIN-17)", async () => {
    getMock.mockResolvedValue({ data: { statusCode: 200, message: "Success", data: [] } });

    await rideService.getAllRides("1,2", "2026-12-01");

    expect(getMock).toHaveBeenCalledWith("/rides", {
      params: { transportType: "1,2", date: "2026-12-01" },
    });
  });

  it("creates a ride without name or phone in the body (JOIN-16)", async () => {
    postMock.mockResolvedValue({ data: { statusCode: 201, message: "Success", data: [] } });

    const ride = {
      date: "2026-12-01",
      hour: "08:00",
      city: "São Leopoldo",
      transportTypeId: 1,
      totalSpots: 3,
      complement: null,
      obs: null,
    };

    await rideService.createRide(ride);

    expect(postMock).toHaveBeenCalledWith("/rides", ride);
    expect(postMock.mock.calls[0][1]).not.toHaveProperty("name");
    expect(postMock.mock.calls[0][1]).not.toHaveProperty("phone");
  });

  it("returns the rides carried in the response envelope (JOIN-07)", async () => {
    const ride = { id: 1, isOwner: true, alreadyJoined: false };
    getMock.mockResolvedValue({
      data: { statusCode: 200, message: "Success", data: [ride] },
    });

    const result = await rideService.loadRides();

    expect(result).toEqual([ride]);
  });

  it("cancels a ride through the authenticated client, with no body (CANCEL-04)", async () => {
    deleteMock.mockResolvedValue({
      data: { statusCode: 200, message: "Success", data: { id: 7, status: "canceled" } },
    });

    const result = await rideService.cancelRide(7);

    expect(deleteMock).toHaveBeenCalledWith("/rides/7");
    expect(result.data).toEqual({ id: 7, status: "canceled" });
  });
});
