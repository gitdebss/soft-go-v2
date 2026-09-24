import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { IRide } from "../models/IRide";

const { createUserRideMock, toastSuccessMock, toastErrorMock, useAuthMock } =
  vi.hoisted(() => ({
    createUserRideMock: vi.fn(),
    toastSuccessMock: vi.fn(),
    toastErrorMock: vi.fn(),
    useAuthMock: vi.fn(),
  }));

vi.mock("../services/UserRideService", () => ({
  UserRideService: class {
    createUserRide = createUserRideMock;
  },
}));

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("react-hot-toast", () => ({
  default: { success: toastSuccessMock, error: toastErrorMock },
}));

import { Modal } from "./Modal";

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
  phone: "51999999999",
  isOwner: false,
  alreadyJoined: false,
} as IRide;

function renderModal(overrides: Partial<Parameters<typeof Modal>[0]> = {}) {
  const props = {
    ride,
    open: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    ...overrides,
  };

  return { ...render(<Modal {...props} />), props };
}

describe("Modal", () => {
  beforeEach(() => {
    createUserRideMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
    useAuthMock.mockReturnValue({
      user: { id: 2, name: "Ana Souza", email: "ana@example.com", phone: "51988887777" },
    });
  });

  it("renders no editable text field at all (JOIN-01)", () => {
    const { container } = renderModal();

    expect(container.querySelectorAll("input")).toHaveLength(0);
    expect(container.querySelectorAll("textarea")).toHaveLength(0);
  });

  it("shows the logged-in account name and its masked phone (JOIN-01)", () => {
    renderModal();

    expect(screen.getByText("Ana Souza")).toBeInTheDocument();
    expect(screen.getByText("(51) 98888-7777")).toBeInTheDocument();
  });

  it("shows a placeholder when the account has no phone (JOIN-31)", () => {
    useAuthMock.mockReturnValue({
      user: { id: 2, name: "Ana Souza", email: "ana@example.com", phone: null },
    });

    renderModal();

    expect(screen.getByText("Telefone não informado")).toBeInTheDocument();
  });

  it("confirms presence with the ride id only, then closes and reloads (JOIN-02, JOIN-09)", async () => {
    createUserRideMock.mockResolvedValue({ statusCode: 201, message: "Success", data: {} });
    const user = userEvent.setup();
    const { props } = renderModal();

    await user.click(screen.getByRole("button", { name: /confirmar presença/i }));

    await waitFor(() => expect(createUserRideMock).toHaveBeenCalledWith(7));
    expect(props.onClose).toHaveBeenCalled();
    expect(props.onSubmit).toHaveBeenCalled();
  });

  it("surfaces the backend message on a 409 and keeps the modal open (JOIN-05)", async () => {
    const conflict = Object.assign(new Error("conflict"), {
      isAxiosError: true,
      response: { status: 409, data: { message: "Você já confirmou presença nesta carona" } },
    });
    createUserRideMock.mockRejectedValue(conflict);
    const user = userEvent.setup();
    const { props } = renderModal();

    await user.click(screen.getByRole("button", { name: /confirmar presença/i }));

    await waitFor(() =>
      expect(toastErrorMock).toHaveBeenCalledWith("Você já confirmou presença nesta carona"),
    );
    expect(props.onClose).not.toHaveBeenCalled();
  });
});
