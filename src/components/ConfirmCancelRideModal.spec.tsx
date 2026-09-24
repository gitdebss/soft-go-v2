import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { IRide } from "../models/IRide";
import { ConfirmCancelRideModal } from "./ConfirmCancelRideModal";

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
  status: "active",
  isOwner: true,
  alreadyJoined: false,
} as IRide;

function renderModal(overrides: Partial<Parameters<typeof ConfirmCancelRideModal>[0]> = {}) {
  const onConfirm = vi.fn();
  const onClose = vi.fn();

  render(
    <ConfirmCancelRideModal
      ride={ride}
      open
      onClose={onClose}
      onConfirm={onConfirm}
      {...overrides}
    />,
  );

  return { onConfirm, onClose };
}

describe("ConfirmCancelRideModal", () => {
  it("confirms nothing just by opening (CANCEL-03)", () => {
    const { onConfirm } = renderModal();

    expect(screen.getByRole("heading", { name: /cancelar carona/i })).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("closes without confirming when the owner backs out (CANCEL-03)", async () => {
    const { onConfirm, onClose } = renderModal();

    await userEvent.click(screen.getByRole("button", { name: /voltar/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("confirms once when the owner goes through with it (CANCEL-03)", async () => {
    const { onConfirm } = renderModal();

    await userEvent.click(screen.getByRole("button", { name: /sim, cancelar carona/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  // Um segundo DELETE na mesma carona voltaria 409 e viraria um toast de erro
  // para uma ação que deu certo.
  it("blocks a second confirmation while the first is in flight", async () => {
    const { onConfirm } = renderModal({ isSubmitting: true });

    const confirm = screen.getByRole("button", { name: /sim, cancelar carona/i });

    expect(confirm).toBeDisabled();

    await userEvent.click(confirm);

    expect(onConfirm).not.toHaveBeenCalled();
  });
});
