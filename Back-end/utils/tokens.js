import crypto from "crypto";

export const ACTIVATION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Create a one-time activation token.
 * @returns {{ token: string, hash: string, expires: Date }}
 *   `token` is sent in the email link (never stored);
 *   `hash` is what we persist and compare against.
 */
export const createActivationToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const hash = hashToken(token);
  const expires = new Date(Date.now() + ACTIVATION_TTL_MS);
  return { token, hash, expires };
};

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

/**
 * Cryptographically strong password that satisfies the app password policy
 * (>= 10 chars, at least one lower/upper/digit). Used for seeding admins.
 */
export const generateStrongPassword = (length = 16) => {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const special = "#@!$%*?";
  const all = upper + lower + digits + special;
  const pick = (set) => set[crypto.randomInt(set.length)];

  const chars = [pick(upper), pick(lower), pick(digits), pick(special)];
  for (let i = chars.length; i < length; i++) chars.push(pick(all));

  // Fisher–Yates shuffle with a CSPRNG so required chars aren't front-loaded.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
};
