import { httpError } from "./AppError.js";

/**
 * Lightweight in-memory per-account lockout after repeated failed logins.
 * NOTE: in-process only — for multi-instance production use a shared store
 * (Redis). Tracked in SECURITY-FOLLOWUPS.md.
 */
const attempts = new Map(); // email -> { count, lockUntil }
const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000; // 15 minutes

const key = (email) => (email || "").trim().toLowerCase();

/** Express middleware: reject the request while the account is locked. */
export const loginLockout = (req, res, next) => {
  const rec = attempts.get(key(req.body?.email));
  if (rec?.lockUntil && rec.lockUntil > Date.now()) {
    const mins = Math.ceil((rec.lockUntil - Date.now()) / 60000);
    return next(
      httpError(
        `Account temporarily locked after too many failed attempts. Try again in ${mins} minute(s).`,
        429,
      ),
    );
  }
  next();
};

export const recordLoginFailure = (email) => {
  const k = key(email);
  if (!k) return;
  const rec = attempts.get(k) || { count: 0, lockUntil: 0 };
  rec.count += 1;
  if (rec.count >= MAX_FAILURES) {
    rec.lockUntil = Date.now() + LOCK_MS;
    rec.count = 0;
  }
  attempts.set(k, rec);
};

export const clearLoginAttempts = (email) => {
  attempts.delete(key(email));
};
