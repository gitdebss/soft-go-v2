import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type { IRide } from "../models/IRide";

const { loadMyRidesMock, navigateMock, useAuthMock } = vi.hoisted(() => ({
  loadMyRidesMock: vi.fn(),
  navigateMock: vi.fn(),
  useAuthMock: vi.fn(),
}));

vi.mock("../services/RideService", () => ({
  RideService: class {
    loadMyRides = loadMyRidesMock;
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

import MyRides from "./MyRides";

const YESTERDAY = "2000-01-01";
const FUTURE = "2099-01-01";

function buildRide(overrides: Partial<IRide> = {}): IRide {
  return {
    id: 1,
    date: FUTURE,
    hour: "08:00",
    city: "São Leopoldo",
    name: "Dona da Carona",
    transportType: { id: 1, name: "Carro" },
    totalSpots: 3,
    occupiedSpots: 1,
    availableSpots: 2,
    phone: "51999999999",
    status: "active",
    isOwner: true,
    alreadyJoined: false,
    ...overrides,
  } as IRide;
}

const ativa = buildRide({ id: 1, date: FUTURE, status: "active", city: "Ativa" });
const inativa = buildRide({ id: 2, date: YESTERDAY, status: "active", city: "Inativa" });
const cancelada = buildRide({ id: 3, date: FUTURE, status: "canceled", city: "Cancelada" });

function renderMyRides() {
  return render(
    <MemoryRouter>
      <MyRides />
    </MemoryRouter>,
  );
}

describe("MyRides", () => {
  beforeEach(() => {
    loadMyRidesMock.mockReset();
    navigateMock.mockReset();
    loadMyRidesMock.mockResolvedValue([ativa, inativa, cancelada]);
    useAuthMock.mockReturnValue({ isAuthenticated: true, isLoading: false });
  });

  it("redirects to /login without fetching when there is no session (MYRIDES-02)", () => {
    useAuthMock.mockReturnValue({ isAuthenticated: false, isLoading: false });

    renderMyRides();

    expect(navigateMock).toHaveBeenCalledWith("/login");
    expect(loadMyRidesMock).not.toHaveBeenCalled();
  });

  it("shows only the active ride on first load, with no filter chosen (MYRIDES-01, MYRIDES-07)", async () => {
    renderMyRides();

    await screen.findByText("Ativa");

    expect(screen.queryByText("Inativa")).not.toBeInTheDocument();
    expect(screen.queryByText("Cancelada")).not.toBeInTheDocument();
  });

  it('adds a category to the view when its chip is checked, as a union (MYRIDES-08)', async () => {
    const user = userEvent.setup();
    renderMyRides();
    await screen.findByText("Ativa");

    await user.click(screen.getByRole("checkbox", { name: /inativas/i }));

    expect(screen.getByText("Ativa")).toBeInTheDocument();
    expect(screen.getByText("Inativa")).toBeInTheDocument();
    expect(screen.queryByText("Cancelada")).not.toBeInTheDocument();
  });

  it('falls back to "ativa" when every chip is unchecked (MYRIDES-09)', async () => {
    const user = userEvent.setup();
    renderMyRides();
    await screen.findByText("Ativa");

    await user.click(screen.getByRole("checkbox", { name: /^ativas$/i }));

    expect(await screen.findByText("Ativa")).toBeInTheDocument();
    expect(screen.queryByText("Inativa")).not.toBeInTheDocument();
    expect(screen.queryByText("Cancelada")).not.toBeInTheDocument();
  });

  it("shows the union of every checked category (MYRIDES-10)", async () => {
    const user = userEvent.setup();
    renderMyRides();
    await screen.findByText("Ativa");

    await user.click(screen.getByRole("checkbox", { name: /inativas/i }));
    await user.click(screen.getByRole("checkbox", { name: /canceladas/i }));

    expect(screen.getByText("Ativa")).toBeInTheDocument();
    expect(screen.getByText("Inativa")).toBeInTheDocument();
    expect(screen.getByText("Cancelada")).toBeInTheDocument();
  });

  it("refetches with the chosen date, keeping the current status filter (MYRIDES-11)", async () => {
    renderMyRides();
    await screen.findByText("Ativa");
    loadMyRidesMock.mockClear();
    loadMyRidesMock.mockResolvedValue([ativa]);

    const filter = screen.getByLabelText(/filtro por data/i);
    await userEvent.type(filter, "2026-03-05");

    await waitFor(() => expect(loadMyRidesMock).toHaveBeenCalledWith("2026-03-05"));
  });

  it("clears the date filter and shows every date again when the field is emptied (MYRIDES-13)", async () => {
    renderMyRides();
    await screen.findByText("Ativa");

    const filter = screen.getByLabelText(/filtro por data/i);
    await userEvent.type(filter, "2026-03-05");
    await waitFor(() => expect(loadMyRidesMock).toHaveBeenCalledWith("2026-03-05"));

    loadMyRidesMock.mockClear();
    loadMyRidesMock.mockResolvedValue([ativa, inativa, cancelada]);
    await userEvent.clear(filter);

    await waitFor(() => expect(loadMyRidesMock).toHaveBeenCalledWith(undefined));
  });

  it("does not restrict the date filter to today or later (MYRIDES-12)", () => {
    renderMyRides();

    const filter = screen.getByLabelText(/filtro por data/i);

    expect(filter).not.toHaveAttribute("min");
  });

  it('offers the "Vou pra Soft" button linking to /form-ride (MYRIDES-14)', async () => {
    renderMyRides();
    await screen.findByText("Ativa");

    const link = screen.getByRole("link", { name: /vou pra soft/i });

    expect(link).toHaveAttribute("href", "/form-ride");
  });

  it("shows the empty state when no ride matches the current filters", async () => {
    loadMyRidesMock.mockResolvedValue([]);

    renderMyRides();

    expect(await screen.findByText(/nenhuma corrida encontrada/i)).toBeInTheDocument();
  });
});
