// SPEC_DEVIATION: T14 originally imported the default `@testing-library/jest-dom`
// subpath, which augments Jest's `Expect` type, not Vitest's `Assertion` type.
// Runtime matchers worked either way (expect.extend is framework-agnostic), but
// no spec file exercised a DOM matcher under `tsc -b` until this phase's
// component tests (SignUp.spec.tsx, SignIn.spec.tsx), which surfaced TS2339 on
// every `toBeInTheDocument()` call. Switching to the `/vitest` subpath fixes the
// type augmentation; jest-dom v7 ships this subpath specifically for Vitest.
// Reason: required to satisfy this phase's "build" gate (`tsc -b`, no new
// errors); this is a one-line import-path fix to pre-existing test infra, not a
// behavior change.
import "@testing-library/jest-dom/vitest";
