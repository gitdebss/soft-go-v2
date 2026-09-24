import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const { signUpMock, navigateMock } = vi.hoisted(() => ({
  signUpMock: vi.fn(),
  navigateMock: vi.fn(),
}));

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ signUp: signUpMock }),
}));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return { ...actual, useNavigate: () => navigateMock };
});

import SignUp from "./SignUp";

function renderSignUp() {
  return render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>,
  );
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^nome/i), "Ana Souza");
  await user.type(screen.getByLabelText(/^e-mail/i), "ana@example.com");
  await user.type(screen.getByLabelText(/^senha/i), "password123");
  await user.type(screen.getByLabelText(/confirmar senha/i), "password123");
}

describe("SignUp", () => {
  beforeEach(() => {
    signUpMock.mockReset();
    navigateMock.mockReset();
  });

  it("renders all 5 fields with labels, including the optional phone (JOIN-12)", () => {
    renderSignUp();

    expect(screen.getByLabelText(/^nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/whatsapp/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
  });

  it("shows a validation error when the password is shorter than 8 characters", async () => {
    const user = userEvent.setup();
    renderSignUp();

    await user.type(screen.getByLabelText(/^nome/i), "Ana Souza");
    await user.type(screen.getByLabelText(/^e-mail/i), "ana@example.com");
    await user.type(screen.getByLabelText(/^senha/i), "123");
    await user.type(screen.getByLabelText(/confirmar senha/i), "123");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(
      await screen.findByText("A senha deve ter pelo menos 8 caracteres"),
    ).toBeInTheDocument();
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it("shows a validation error when password and confirmation do not match", async () => {
    const user = userEvent.setup();
    renderSignUp();

    await user.type(screen.getByLabelText(/^nome/i), "Ana Souza");
    await user.type(screen.getByLabelText(/^e-mail/i), "ana@example.com");
    await user.type(screen.getByLabelText(/^senha/i), "password123");
    await user.type(
      screen.getByLabelText(/confirmar senha/i),
      "different123",
    );
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(
      await screen.findByText("As senhas não coincidem"),
    ).toBeInTheDocument();
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it("shows a validation error for an invalid email format", async () => {
    const user = userEvent.setup();
    renderSignUp();

    await user.type(screen.getByLabelText(/^nome/i), "Ana Souza");
    await user.type(screen.getByLabelText(/^e-mail/i), "not-an-email");
    await user.type(screen.getByLabelText(/^senha/i), "password123");
    await user.type(screen.getByLabelText(/confirmar senha/i), "password123");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(
      await screen.findByText("Informe um e-mail válido"),
    ).toBeInTheDocument();
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it("shows validation errors for empty required fields on submit", async () => {
    const user = userEvent.setup();
    renderSignUp();

    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(
      await screen.findByText("O nome é obrigatório"),
    ).toBeInTheDocument();
    expect(screen.getByText("O e-mail é obrigatório")).toBeInTheDocument();
    expect(
      screen.getByText("A senha deve ter pelo menos 8 caracteres"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("A confirmação de senha é obrigatória"),
    ).toBeInTheDocument();
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it("submits valid data, calls useAuth().signUp and navigates to /login on success", async () => {
    signUpMock.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderSignUp();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() =>
      expect(signUpMock).toHaveBeenCalledWith({
        name: "Ana Souza",
        email: "ana@example.com",
        password: "password123",
        phone: undefined,
      }),
    );
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  it("submits the phone as digits only when it is filled in (JOIN-10)", async () => {
    signUpMock.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderSignUp();

    await fillValidForm(user);
    await user.type(screen.getByLabelText(/whatsapp/i), "(51) 99999-9999");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() =>
      expect(signUpMock).toHaveBeenCalledWith({
        name: "Ana Souza",
        email: "ana@example.com",
        password: "password123",
        phone: "51999999999",
      }),
    );
  });

  it("shows the duplicate-email error returned by the backend", async () => {
    const axiosError = {
      isAxiosError: true,
      response: { status: 409, data: { message: "e-mail já cadastrado" } },
    };
    signUpMock.mockRejectedValue(axiosError);
    const user = userEvent.setup();
    renderSignUp();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(
      await screen.findByText("e-mail já cadastrado"),
    ).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
