import { v4 as uuidv4 } from "uuid";

// Long enough to outlive the display's 60s rotation, so there is never a gap
// where the code on screen has expired but its replacement hasn't loaded.
export const QR_TTL_MS = 90_000;

const nonces = new Map(); // id -> expiry (ms)

const sweep = (now = Date.now()) => {
  for (const [id, exp] of nonces) if (exp <= now) nonces.delete(id);
};

/**
 * Mint a nonce for the check-in display.
 *
 * Reusable until it expires: the wall display shows one code to everyone in
 * line, so several members scan the same id within its TTL and each must be
 * greeted. Replay is bounded by QR_TTL_MS, not by single use — the real
 * authorisation is the authenticated POST /CheckIn the phone makes.
 */
export const issueNonce = () => {
  sweep();
  const id = uuidv4();
  const expiresAt = Date.now() + QR_TTL_MS;
  nonces.set(id, expiresAt);
  return { id, url: `checkin:${id}`, expiresAt };
};

/** Read-only check. Never consumes a still-valid nonce. */
export const isValidNonce = (id) => {
  const exp = nonces.get(id);
  if (!exp) return false;
  if (exp <= Date.now()) {
    nonces.delete(id);
    return false;
  }
  return true;
};
