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

  // As queries usam placeholder porque os Inputs desta página não recebem `id`,
  // e o componente Input associa o label por `htmlFor={name}` - os labels não
  // apontam para controle nenhum. Bug de acessibilidade pré-existente, fora do
  // escopo desta task.
  it("renders no name or phone field, since both come from the account (JOIN-16)", () => {
    renderFormRide();

    expect(screen.queryByText("Seu nome")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Ex: João da Silva")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("(11) 99999-9999")).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ex: São Paulo")).toBeInTheDocument();
  });

  it("submits a body without name or phone (JOIN-16)", async () => {
    createRideMock.mockResolvedValue({ statusCode: 201, message: "Success", data: [] });
    const user = userEvent.setup();
    renderFormRide();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await user.type(screen.getByPlaceholderText(/selecione a data/i), tomorrow.toISOString().slice(0, 10));
    await user.type(screen.getByPlaceholderText(/selecione a hora/i), "08:00");
    await user.type(screen.getByPlaceholderText("Ex: São Paulo"), "São Leopoldo");
    await user.type(screen.getByPlaceholderText("Ex: 4"), "3");
    await user.click(screen.getByRole("button", { name: /publicar viagem/i }));

    await waitFor(() => expect(createRideMock).toHaveBeenCalled());

    const body = createRideMock.mock.calls[0][0];
    expect(body).not.toHaveProperty("name");
    expect(body).not.toHaveProperty("phone");
    expect(body.city).toBe("São Leopoldo");
    expect(body.totalSpots).toBe(3);
  });
});
