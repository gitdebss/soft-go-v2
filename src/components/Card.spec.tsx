import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { IRide } from "../models/IRide";
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
  isOwner: false,
  alreadyJoined: false,
} as IRide;

function renderCard(overrides: Partial<IRide> = {}) {
  const ride = { ...baseRide, ...overrides } as IRide;

  return render(
    <MemoryRouter>
      <Card ride={ride} onOpenModal={vi.fn()} />
    </MemoryRouter>,
  );
}

describe("Card confirmation button", () => {
  it('offers "Vou junto" enabled when there are seats and no relation to the ride (JOIN-07)', () => {
    renderCard();

    const button = screen.getByRole("button", { name: /vou junto/i });
    expect(button).toBeEnabled();
  });

  it('shows "Sua carona" disabled for the owner (JOIN-08)', () => {
    renderCard({ isOwner: true });

    const button = screen.getByRole("button", { name: /sua carona/i });
    expect(button).toBeDisabled();
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
