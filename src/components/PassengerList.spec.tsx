import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PassengerList } from "./PassengerList";

function renderList(props: Partial<Parameters<typeof PassengerList>[0]> = {}) {
  return render(
    <MemoryRouter>
      <PassengerList passengers={[]} isLoading={false} {...props} />
    </MemoryRouter>,
  );
}

describe("PassengerList", () => {
  it("shows the empty-state message when nobody confirmed presence (JOIN-25)", () => {
    renderList();

    expect(screen.getByText("Ninguém confirmou presença ainda")).toBeInTheDocument();
  });

  it("shows a loading message while fetching (JOIN-21)", () => {
    renderList({ isLoading: true });

    expect(screen.getByText(/carregando passageiras/i)).toBeInTheDocument();
  });

  it("links a passenger with a phone to WhatsApp using the stored digits (JOIN-22)", () => {
    renderList({ passengers: [{ id: 1, name: "Ana Souza", phone: "51999999999" }] });

    expect(screen.getByText("Ana Souza")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /whatsapp/i })).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/5551999999999"),
    );
  });

  it("renders the contact link compact, not full width, so it sits beside the name", () => {
    renderList({ passengers: [{ id: 1, name: "Ana Souza", phone: "51999999999" }] });

    const link = screen.getByRole("link", { name: /whatsapp/i });
    expect(link.className).toContain("w-auto");
    expect(link.className).not.toContain("w-full");
  });

  it("marks a passenger without a phone instead of rendering a link (JOIN-31)", () => {
    renderList({ passengers: [{ id: 2, name: "Sem Fone", phone: null }] });

    expect(screen.getByText("Sem Fone")).toBeInTheDocument();
    expect(screen.getByText("Telefone não informado")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /whatsapp/i })).not.toBeInTheDocument();
  });

  it("shows the error message instead of the list when the fetch failed (JOIN-21)", () => {
    renderList({ error: "Erro ao carregar passageiras." });

    expect(screen.getByText("Erro ao carregar passageiras.")).toBeInTheDocument();
    expect(screen.queryByText("Ninguém confirmou presença ainda")).not.toBeInTheDocument();
  });
});
