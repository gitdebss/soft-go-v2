import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type { IRide } from "../models/IRide";

const { loadRidesMock, navigateMock, useAuthMock } = vi.hoisted(() => ({
  loadRidesMock: vi.fn(),
  navigateMock: vi.fn(),
  useAuthMock: vi.fn(),
}));

vi.mock("../services/RideService", () => ({
  RideService: class {
    loadRides = loadRidesMock;
  },
}));

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

import Home from "./Home";

const ride = {
  id: 7,
  date: "2026-12-01",
  hour: "08:00",
  city: "São Leopoldo",
  name: "Dona da Carona",
  transportType: { id: 1, name: "Carro" },
  totalSpots: 3,
  occupiedSpots: 1,
  availableSpots: 2,
  phone: null,
  isOwner: false,
  alreadyJoined: false,
} as IRide;

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
}

describe("Home", () => {
  beforeEach(() => {
    loadRidesMock.mockReset();
    navigateMock.mockReset();
    loadRidesMock.mockResolvedValue([ride]);
    useAuthMock.mockReturnValue({
      isAuthenticated: true,
      user: { id: 2, name: "Ana Souza", email: "ana@example.com", phone: null },
    });
  });

  it("navigates to /login without opening the modal when there is no session (JOIN-03)", async () => {
    useAuthMock.mockReturnValue({ isAuthenticated: false, user: null });
    const user = userEvent.setup();
    renderHome();

    const button = await screen.findByRole("button", { name: /vou junto/i });
    await user.click(button);

    expect(navigateMock).toHaveBeenCalledWith("/login");
    expect(screen.queryByText(/quero ir junto/i)).not.toBeInTheDocument();
  });

  it("opens the modal for the selected ride when there is a session (JOIN-03)", async () => {
    const user = userEvent.setup();
    renderHome();

    const button = await screen.findByRole("button", { name: /vou junto/i });
    await user.click(button);

    await waitFor(() =>
      expect(screen.getByText("Quero ir junto!")).toBeInTheDocument(),
    );
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
