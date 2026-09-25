import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const { logoutMock, navigateMock, useAuthMock } = vi.hoisted(() => ({
  logoutMock: vi.fn(),
  navigateMock: vi.fn(),
  useAuthMock: vi.fn(),
}));

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return { ...actual, useNavigate: () => navigateMock };
});

import { Header } from "./Header";

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );
}

describe("Header", () => {
  beforeEach(() => {
    logoutMock.mockReset();
    navigateMock.mockReset();
    useAuthMock.mockReset();
  });

  it("shows an avatar with the correct initials when authenticated", () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, name: "Ana Souza", email: "ana@example.com" },
      logout: logoutMock,
    });

    renderHeader();

    expect(screen.getByText("AS")).toBeInTheDocument();
  });

  it("does not show the logout menu until the avatar is clicked", () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, name: "Ana Souza", email: "ana@example.com" },
      logout: logoutMock,
    });

    renderHeader();

    expect(screen.queryByRole("menuitem", { name: /sair/i })).not.toBeInTheDocument();
  });

  it("opens a menu with the logout option when the avatar is clicked", async () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, name: "Ana Souza", email: "ana@example.com" },
      logout: logoutMock,
    });
    const user = userEvent.setup();

    renderHeader();
    await user.click(screen.getByRole("button", { name: /menu da conta/i }));

    expect(screen.getByRole("menuitem", { name: /sair/i })).toBeInTheDocument();
  });

  it("calls useAuth().logout and navigates to /login when the logout menu item is clicked", async () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, name: "Ana Souza", email: "ana@example.com" },
      logout: logoutMock,
    });
    const user = userEvent.setup();

    renderHeader();
    await user.click(screen.getByRole("button", { name: /menu da conta/i }));
    await user.click(screen.getByRole("menuitem", { name: /sair/i }));

    expect(logoutMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  it("closes the menu when clicking outside of it", async () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, name: "Ana Souza", email: "ana@example.com" },
      logout: logoutMock,
    });
    const user = userEvent.setup();

    renderHeader();
    await user.click(screen.getByRole("button", { name: /menu da conta/i }));
    expect(screen.getByRole("menuitem", { name: /sair/i })).toBeInTheDocument();

    await user.click(document.body);

    expect(screen.queryByRole("menuitem", { name: /sair/i })).not.toBeInTheDocument();
  });

  it("shows an 'Entrar' link pointing to /login when not authenticated", () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: logoutMock,
    });

    renderHeader();

    const link = screen.getByRole("link", { name: /entrar/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/login");
  });
});

describe("Header navigation", () => {
  beforeEach(() => {
    useAuthMock.mockReturnValue({ isAuthenticated: false, user: null, logout: vi.fn() });
  });

  // Um link relativo resolveria contra a rota atual: partindo de /form-ride,
  // "my-rides" viraria "/form-ride/my-rides" em vez da tela certa.
  it('points "Minhas Corridas" at the absolute path, not a relative one', () => {
    renderHeader();

    const link = screen.getByRole("link", { name: /minhas corridas/i });

    expect(link).toHaveAttribute("href", "/my-rides");
  });
});
