import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./Input";
import { Textarea } from "./Textarea";

// Props do componente que não são atributos HTML. Se vazarem no spread, o React
// as rejeita com "React does not recognize the ... prop on a DOM element".
const NON_DOM_PROPS = ["label", "hidelabel", "helptext", "error"];

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

describe("component props do not leak onto the DOM element", () => {

  it("keeps Input's own props off the rendered input", () => {
    render(
      <Input
        label="Cidade"
        hideLabel
        helpText="Opcional"
        error="Campo inválido"
        name="city"
        type="text"
      />,
    );

    const control = screen.getByLabelText(/cidade/i);
    NON_DOM_PROPS.forEach((prop) => expect(control).not.toHaveAttribute(prop));
    // ...enquanto os atributos HTML legítimos seguem passando.
    expect(control).toHaveAttribute("type", "text");
    expect(control).toHaveAttribute("name", "city");
  });

  it("keeps Textarea's own props off the rendered textarea", () => {
    render(
      <Textarea
        label="Observação"
        hideLabel
        helpText="Opcional"
        error="Campo inválido"
        name="obs"
      />,
    );

    const control = screen.getByLabelText(/observação/i);
    NON_DOM_PROPS.forEach((prop) => expect(control).not.toHaveAttribute(prop));
    expect(control).toHaveAttribute("name", "obs");
  });

  it("still renders the error and help text as visible messages", () => {
    render(
      <Input
        label="Cidade"
        helpText="Opcional para facilitar o encontro."
        error="Campo inválido"
        name="city"
        type="text"
      />,
    );

    expect(screen.getByText("Campo inválido")).toBeInTheDocument();
    expect(screen.getByText("Opcional para facilitar o encontro.")).toBeInTheDocument();
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
