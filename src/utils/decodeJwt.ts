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
    const decoded = atob(padded);
    const parsed = JSON.parse(decoded);

    return parsed as DecodedJwt;
  } catch {
    return null;
  }
}
