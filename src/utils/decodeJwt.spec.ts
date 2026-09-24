import { describe, it, expect } from "vitest";
import { decodeJwt } from "./decodeJwt";

// Codifica como um emissor de JWT real: o payload vira bytes UTF-8 antes do
// base64. `btoa` direto na string nem aceitaria um nome acentuado.
function base64UrlEncode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function buildToken(payload: object): string {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  return `${header}.${body}.fakesignature`;
}

describe("decodeJwt", () => {
  it("decodes a valid token into the expected payload shape", () => {
    const payload = {
      sub: 1,
      name: "Ana Souza",
      email: "ana@example.com",
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    const token = buildToken(payload);

    const result = decodeJwt(token);

    expect(result).toEqual(payload);
  });

  // Sem decodificar os bytes como UTF-8, "Débora Conceição" chega como
  // "DÃ©bora ConceiÃ§Ã£o" e é isso que a usuária vê no app.
  it("keeps accented names intact", () => {
    const payload = {
      sub: 1,
      name: "Débora Conceição",
      email: "debora@example.com",
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    const result = decodeJwt(buildToken(payload));

    expect(result?.name).toBe("Débora Conceição");
  });

  it("returns null for a malformed token instead of throwing", () => {
    expect(() => decodeJwt("not-a-jwt")).not.toThrow();
    expect(decodeJwt("not-a-jwt")).toBeNull();
  });

  it("returns null when the payload segment is not valid base64/JSON", () => {
    const result = decodeJwt("header.%%%notbase64%%%.signature");

    expect(result).toBeNull();
  });

  it("still decodes a token whose exp is in the past (expiry check is not decodeJwt's job)", () => {
    const payload = {
      sub: 2,
      name: "Bruno Lima",
      email: "bruno@example.com",
      exp: Math.floor(Date.now() / 1000) - 3600,
    };
    const token = buildToken(payload);

    const result = decodeJwt(token);

    expect(result).toEqual(payload);
  });

  it("returns null for an empty string", () => {
    expect(decodeJwt("")).toBeNull();
  });
});
