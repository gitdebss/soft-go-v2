import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const { createRideMock, navigateMock, useAuthMock } = vi.hoisted(() => ({
  createRideMock: vi.fn(),
  navigateMock: vi.fn(),
  useAuthMock: vi.fn(),
}));

vi.mock("../services/RideService", () => ({
  RideService: class {
    createRide = createRideMock;
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

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

import FormRide from "./FormRide";

function renderFormRide() {
  return render(
    <MemoryRouter>
      <FormRide />
    </MemoryRouter>,
  );
}

describe("FormRide", () => {
  beforeEach(() => {
    createRideMock.mockReset();
    navigateMock.mockReset();
    useAuthMock.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 1, name: "Ana Souza", email: "ana@example.com", phone: null },
    });
  });

  it("navigates to /login and renders no form without a session (JOIN-18)", async () => {
    useAuthMock.mockReturnValue({ isAuthenticated: false, isLoading: false, user: null });

    renderFormRide();

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith("/login"));
    expect(screen.queryByRole("button", { name: /publicar viagem/i })).not.toBeInTheDocument();
  });

  it("renders no name or phone field, since both come from the account (JOIN-16)", () => {
    renderFormRide();

    expect(screen.queryByLabelText(/seu nome/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/whatsapp/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/saindo de/i)).toBeInTheDocument();
  });

  it("submits a body without name or phone (JOIN-16)", async () => {
    createRideMock.mockResolvedValue({ statusCode: 201, message: "Success", data: [] });
    const user = userEvent.setup();
    renderFormRide();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await user.type(screen.getByLabelText(/^data/i), tomorrow.toISOString().slice(0, 10));
    await user.type(screen.getByLabelText(/horário/i), "08:00");
    await user.type(screen.getByLabelText(/saindo de/i), "São Leopoldo");
    await user.type(screen.getByLabelText(/número de vagas/i), "3");
    await user.click(screen.getByRole("button", { name: /publicar viagem/i }));

    await waitFor(() => expect(createRideMock).toHaveBeenCalled());

    const body = createRideMock.mock.calls[0][0];
    expect(body).not.toHaveProperty("name");
    expect(body).not.toHaveProperty("phone");
    expect(body.city).toBe("São Leopoldo");
    expect(body.totalSpots).toBe(3);
  });
});
