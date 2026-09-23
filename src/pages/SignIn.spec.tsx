import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const { signInMock, navigateMock } = vi.hoisted(() => ({
  signInMock: vi.fn(),
  navigateMock: vi.fn(),
}));

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ signIn: signInMock }),
}));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return { ...actual, useNavigate: () => navigateMock };
});

import SignIn from "./SignIn";

function renderSignIn() {
  return render(
    <MemoryRouter>
      <SignIn />
    </MemoryRouter>,
  );
}

describe("SignIn", () => {
  beforeEach(() => {
    signInMock.mockReset();
    navigateMock.mockReset();
  });

  it("renders both fields with labels", () => {
    renderSignIn();

    expect(screen.getByLabelText(/^e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha/i)).toBeInTheDocument();
  });

  it("valid credentials submit and redirect to /", async () => {
    signInMock.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderSignIn();

    await user.type(screen.getByLabelText(/^e-mail/i), "ana@example.com");
    await user.type(screen.getByLabelText(/^senha/i), "password123");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() =>
      expect(signInMock).toHaveBeenCalledWith({
        email: "ana@example.com",
        password: "password123",
      }),
    );
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("wrong password shows the generic error message", async () => {
    const axiosError = {
      isAxiosError: true,
      response: { status: 401, data: { message: "E-mail ou senha inválidos" } },
    };
    signInMock.mockRejectedValue(axiosError);
    const user = userEvent.setup();
    renderSignIn();

    await user.type(screen.getByLabelText(/^e-mail/i), "ana@example.com");
    await user.type(screen.getByLabelText(/^senha/i), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(
      await screen.findByText("E-mail ou senha inválidos"),
    ).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("unknown email shows the exact same generic error message as wrong password", async () => {
    const axiosError = {
      isAxiosError: true,
      response: { status: 401, data: { message: "E-mail ou senha inválidos" } },
    };
    signInMock.mockRejectedValue(axiosError);
    const user = userEvent.setup();
    renderSignIn();

    await user.type(screen.getByLabelText(/^e-mail/i), "unknown@example.com");
    await user.type(screen.getByLabelText(/^senha/i), "password123");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(
      await screen.findByText("E-mail ou senha inválidos"),
    ).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("blocks submission client-side when fields are empty", async () => {
    const user = userEvent.setup();
    renderSignIn();

    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(
      await screen.findByText("O e-mail é obrigatório"),
    ).toBeInTheDocument();
    expect(screen.getByText("A senha é obrigatória")).toBeInTheDocument();
    expect(signInMock).not.toHaveBeenCalled();
  });
});
