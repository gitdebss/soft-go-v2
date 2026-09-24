import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./Input";
import { Textarea } from "./Textarea";

describe("Input label association", () => {
  it("associates the label with the control using the name when no id is given", () => {
    render(<Input label="Saindo de (cidade)" name="city" type="text" />);

    const control = screen.getByLabelText(/saindo de/i);
    expect(control).toHaveAttribute("id", "city");
  });

  it("prefers an explicit id over the name", () => {
    render(<Input label="E-mail" id="email-field" name="email" type="email" />);

    expect(screen.getByLabelText(/e-mail/i)).toHaveAttribute("id", "email-field");
  });

  it("keeps a visually hidden label reachable by its accessible name", () => {
    render(
      <Input label="Filtro por data" hideLabel name="filter" type="date" />,
    );

    expect(screen.getByLabelText(/filtro por data/i)).toBeInTheDocument();
  });
});

describe("Textarea label association", () => {
  it("associates the label with the textarea using the name when no id is given", () => {
    render(<Textarea label="Observação" name="obs" />);

    const control = screen.getByLabelText(/observação/i);
    expect(control.tagName).toBe("TEXTAREA");
    expect(control).toHaveAttribute("id", "obs");
  });
});
