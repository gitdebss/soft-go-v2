import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { IRide } from "../models/IRide";
import { ConfirmCancelPresenceModal } from "./ConfirmCancelPresenceModal";

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
  isOwner: false,
  alreadyJoined: true,
} as IRide;

function renderModal(overrides: Partial<Parameters<typeof ConfirmCancelPresenceModal>[0]> = {}) {
  const onConfirm = vi.fn();
  const onClose = vi.fn();

  render(
    <ConfirmCancelPresenceModal
      ride={ride}
      open
      onClose={onClose}
      onConfirm={onConfirm}
      {...overrides}
    />,
  );

  return { onConfirm, onClose };
}

describe("ConfirmCancelPresenceModal", () => {
  it("confirms nothing just by opening (LEAVE-02)", () => {
    const { onConfirm } = renderModal();

    expect(screen.getByRole("heading", { name: /cancelar presença/i })).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("closes without confirming when the passenger backs out (LEAVE-02)", async () => {
    const { onConfirm, onClose } = renderModal();

    await userEvent.click(screen.getByRole("button", { name: /voltar/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("confirms once when the passenger goes through with it (LEAVE-02)", async () => {
    const { onConfirm } = renderModal();

    await userEvent.click(screen.getByRole("button", { name: /sim, cancelar presença/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  // Um segundo DELETE na mesma carona voltaria 404 e viraria um toast de erro
  // para uma ação que deu certo.
  it("blocks a second confirmation while the first is in flight", async () => {
    const { onConfirm } = renderModal({ isSubmitting: true });

    const confirm = screen.getByRole("button", { name: /sim, cancelar presença/i });

    expect(confirm).toBeDisabled();

    await userEvent.click(confirm);

    expect(onConfirm).not.toHaveBeenCalled();
  });
});
