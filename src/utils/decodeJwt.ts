export interface DecodedJwt {
  sub: number;
  name: string;
  email: string;
  exp: number;
}

/**
 * Decodes a JWT's payload segment (base64url) without verifying its signature.
 * Returns null instead of throwing when the token is malformed.
 */
export function decodeJwt(token: string): DecodedJwt | null {
  if (!token || typeof token !== "string") {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [, payloadSegment] = parts;

  try {
    const base64 = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    // `atob` devolve um byte por caractere. Um "é" em UTF-8 são dois bytes
    // (0xC3 0xA9), que lidos assim viram "Ã©" — é preciso decodificar os bytes
    // como UTF-8 antes do JSON.parse, ou todo nome acentuado sai corrompido.
    const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(decoded);

    return parsed as DecodedJwt;
  } catch {
    return null;
  }
}
