import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type { IRide } from "../models/IRide";

const { getUsersByRideIdMock, cancelRideMock } = vi.hoisted(() => ({
  getUsersByRideIdMock: vi.fn(),
  cancelRideMock: vi.fn(),
}));

vi.mock("../services/UserRideService", () => ({
  UserRideService: class {
    getUsersByRideId = getUsersByRideIdMock;
  },
}));

vi.mock("../services/RideService", () => ({
  RideService: class {
    cancelRide = cancelRideMock;
  },
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

import { Card } from "./Card";

const baseRide = {
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
  status: "active",
  isOwner: false,
  alreadyJoined: false,
} as IRide;

function renderCard(overrides: Partial<IRide> = {}, onCanceled = vi.fn()) {
  const ride = { ...baseRide, ...overrides } as IRide;

  return {
    ...render(
      <MemoryRouter>
        <Card ride={ride} onOpenModal={vi.fn()} onCanceled={onCanceled} />
      </MemoryRouter>,
    ),
    onCanceled,
  };
}

beforeEach(() => {
  getUsersByRideIdMock.mockReset();
  cancelRideMock.mockReset();
});

describe("Card confirmation button", () => {
  it('offers "Vou junto" enabled when there are seats and no relation to the ride (JOIN-07)', () => {
    renderCard();

    const button = screen.getByRole("button", { name: /vou junto/i });
    expect(button).toBeEnabled();
  });

  it("offers the owner no action at all on her own ride (JOIN-08)", () => {
    renderCard({ isOwner: true });

    // Contatar a si mesma não faz sentido, e não há presença a confirmar.
    expect(screen.queryByRole("button", { name: /vou junto/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /sua carona/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /whatsapp/i })).not.toBeInTheDocument();
  });

  it("keeps the ride details visible for the owner, only the actions are gone (JOIN-08)", () => {
    renderCard({ isOwner: true });

    expect(screen.getByText("Dona da Carona")).toBeInTheDocument();
    expect(screen.getByText(/são leopoldo/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ver passageiras/i })).toBeInTheDocument();
  });

  it('shows "Você já vai nessa carona" disabled once presence is confirmed (JOIN-07)', () => {
    renderCard({ alreadyJoined: true });

    const button = screen.getByRole("button", { name: /você já vai nessa carona/i });
    expect(button).toBeDisabled();
  });

  it("disables the button when the ride has no seats left (JOIN-29)", () => {
    renderCard({ availableSpots: 0, occupiedSpots: 3 });

    const button = screen.getByRole("button", { name: /vou junto/i });
    expect(button).toBeDisabled();
  });
});

describe("Card owner contact", () => {
  it("links to the owner WhatsApp using the stored digits (JOIN-19)", () => {
    renderCard();

    const link = screen.getByRole("link", { name: /whatsapp/i });
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/5551999999999"),
    );
  });

  it("omits the WhatsApp button when the owner has no phone, keeping the card intact (JOIN-20)", () => {
    renderCard({ phone: null });

    expect(screen.queryByRole("link", { name: /whatsapp/i })).not.toBeInTheDocument();
    expect(screen.getByText("Dona da Carona")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /vou junto/i })).toBeInTheDocument();
  });
});

describe("Card passenger list", () => {
  it("hides the trigger on rides the viewer does not own (JOIN-26)", () => {
    renderCard({ isOwner: false });

    expect(screen.queryByRole("button", { name: /ver passageiras/i })).not.toBeInTheDocument();
    expect(getUsersByRideIdMock).not.toHaveBeenCalled();
  });

  it("fetches the passengers of that ride once when the owner expands it (JOIN-21)", async () => {
    getUsersByRideIdMock.mockResolvedValue({
      statusCode: 200,
      message: "Success",
      data: [{ id: 1, name: "Ana Souza", phone: "51999999999" }],
    });
    const user = userEvent.setup();
    renderCard({ isOwner: true });

    await user.click(screen.getByRole("button", { name: /ver passageiras/i }));

    await waitFor(() => expect(screen.getByText("Ana Souza")).toBeInTheDocument());
    expect(getUsersByRideIdMock).toHaveBeenCalledWith(7);

    await user.click(screen.getByRole("button", { name: /ver passageiras/i }));
    await user.click(screen.getByRole("button", { name: /ver passageiras/i }));

    expect(getUsersByRideIdMock).toHaveBeenCalledTimes(1);
  });

  it("shows an error message and keeps the card usable when the fetch fails (JOIN-21)", async () => {
    getUsersByRideIdMock.mockRejectedValue(new Error("network"));
    const user = userEvent.setup();
    renderCard({ isOwner: true });

    await user.click(screen.getByRole("button", { name: /ver passageiras/i }));

    await waitFor(() =>
      expect(screen.getByText("Erro ao carregar passageiras.")).toBeInTheDocument(),
    );
    expect(screen.getByText("Dona da Carona")).toBeInTheDocument();
  });
});

describe("Card on a canceled ride", () => {
  it("says the ride is not happening anymore (CANCEL-16)", () => {
    renderCard({ status: "canceled" });

    expect(
      screen.getByText("Essa corrida não vai mais acontecer :("),
    ).toBeInTheDocument();
  });

  it("renders the card muted, apart from the active ones (CANCEL-17)", () => {
    const { container } = renderCard({ status: "canceled" });

    const card = container.querySelector("li");

    expect(card?.className).toContain("bg-surface-tertiary");
    expect(card?.className).toContain("grayscale");
    expect(card?.className).not.toContain("bg-surface-primary");
  });

  it("offers no action to someone who is not the owner (CANCEL-18)", () => {
    renderCard({ status: "canceled" });

    expect(screen.queryByRole("button", { name: /vou junto/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /whatsapp/i })).not.toBeInTheDocument();
  });

  // O vínculo das passageiras é preservado no cancelamento justamente para a
  // dona conseguir avisar cada uma.
  it("keeps the passenger list reachable by the owner (CANCEL-20)", () => {
    renderCard({ status: "canceled", isOwner: true });

    expect(screen.getByRole("button", { name: /ver passageiras/i })).toBeInTheDocument();
  });

  it("keeps showing how many seats were taken (CANCEL-21)", () => {
    renderCard({ status: "canceled" });

    expect(screen.getByText("1/3 Vagas")).toBeInTheDocument();
  });
});

describe("Card cancel action", () => {
  it("offers the owner a way to cancel her own ride (CANCEL-02)", () => {
    renderCard({ isOwner: true });

    expect(
      screen.getByRole("button", { name: /cancelar carona/i }),
    ).toBeInTheDocument();
  });

  it("offers it to nobody else (CANCEL-12)", () => {
    renderCard();

    expect(
      screen.queryByRole("button", { name: /cancelar carona/i }),
    ).not.toBeInTheDocument();
  });

  it("does not offer it again on a ride already canceled (CANCEL-19)", () => {
    renderCard({ isOwner: true, status: "canceled" });

    expect(
      screen.queryByRole("button", { name: /cancelar carona/i }),
    ).not.toBeInTheDocument();
  });

  // Cancelar não tem volta: o clique abre a confirmação, não o endpoint.
  it("asks before canceling anything (CANCEL-03)", async () => {
    const user = userEvent.setup();
    renderCard({ isOwner: true });

    await user.click(screen.getByRole("button", { name: /^cancelar carona$/i }));

    expect(
      screen.getByRole("heading", { name: /cancelar carona/i }),
    ).toBeInTheDocument();
    expect(cancelRideMock).not.toHaveBeenCalled();
  });

  it("cancels the ride and reloads the board once confirmed (CANCEL-04)", async () => {
    cancelRideMock.mockResolvedValue({
      statusCode: 200,
      message: "Success",
      data: { id: 7, status: "canceled" },
    });
    const user = userEvent.setup();
    const { onCanceled } = renderCard({ isOwner: true });

    await user.click(screen.getByRole("button", { name: /^cancelar carona$/i }));
    await user.click(screen.getByRole("button", { name: /sim, cancelar carona/i }));

    await waitFor(() => expect(cancelRideMock).toHaveBeenCalledWith(7));
    await waitFor(() => expect(onCanceled).toHaveBeenCalledTimes(1));
  });

  it("keeps the board untouched when the cancel request fails (CANCEL-04)", async () => {
    cancelRideMock.mockRejectedValue(new Error("network"));
    const user = userEvent.setup();
    const { onCanceled } = renderCard({ isOwner: true });

    await user.click(screen.getByRole("button", { name: /^cancelar carona$/i }));
    await user.click(screen.getByRole("button", { name: /sim, cancelar carona/i }));

    await waitFor(() => expect(cancelRideMock).toHaveBeenCalledTimes(1));
    expect(onCanceled).not.toHaveBeenCalled();
  });
});

describe("Card on a ride that already happened (owner view)", () => {
  it("hides the cancel action on a past active ride (MYRIDES-16)", () => {
    renderCard({ isOwner: true, date: "2020-01-01" });

    expect(
      screen.queryByRole("button", { name: /cancelar carona/i }),
    ).not.toBeInTheDocument();
  });

  it("still offers the cancel action on a ride yet to happen (MYRIDES-15)", () => {
    renderCard({ isOwner: true, date: "2099-01-01" });

    expect(
      screen.getByRole("button", { name: /cancelar carona/i }),
    ).toBeInTheDocument();
  });

  it("keeps the passenger list reachable on a past ride (MYRIDES-18)", () => {
    renderCard({ isOwner: true, date: "2020-01-01" });

    expect(screen.getByRole("button", { name: /ver passageiras/i })).toBeInTheDocument();
  });
});

describe("Card layout", () => {
  it("puts the cancel control beside the transport badge, icon only (CANCEL-02)", () => {
    renderCard({ isOwner: true });

    const cancelButton = screen.getByRole("button", { name: /^cancelar carona$/i });
    const badge = screen.getByText("Carro");

    // O nome acessível vem do aria-label: o botão não carrega texto visível.
    expect(cancelButton.textContent?.trim()).toBe("");
    expect(badge.parentElement).toContainElement(cancelButton);
  });

  // Crescer dentro do card esticaria a linha inteira da grade no desktop e
  // desalinharia os cards vizinhos.
  it("floats the passenger list out of the card flow from md up", async () => {
    getUsersByRideIdMock.mockResolvedValue({
      statusCode: 200,
      message: "Success",
      data: [],
    });
    const user = userEvent.setup();
    renderCard({ isOwner: true });

    await user.click(screen.getByRole("button", { name: /ver passageiras/i }));

    const emptyState = await screen.findByText(/ninguém confirmou presença ainda/i);

    expect(emptyState.parentElement?.className).toContain("md:absolute");
    expect(emptyState.parentElement?.className).toContain("md:top-full");
  });
});
