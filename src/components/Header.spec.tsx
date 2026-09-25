import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const { useAuthMock } = vi.hoisted(() => ({ useAuthMock: vi.fn() }));

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => useAuthMock(),
}));

import { Header } from "./Header";

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );
}

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
