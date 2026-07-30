import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { issueNonce, isValidNonce, QR_TTL_MS } from "./qrNonces.js";

test("issueNonce returns an id, a checkin: url and a numeric expiry", () => {
  const { id, url, expiresAt } = issueNonce();
  assert.equal(typeof id, "string");
  assert.equal(url, `checkin:${id}`);
  assert.equal(typeof expiresAt, "number");
  assert.ok(expiresAt > Date.now());
});

test("a freshly issued nonce validates", () => {
  const { id } = issueNonce();
  assert.equal(isValidNonce(id), true);
});

test("a nonce survives repeated validation - the display code is multi-use", () => {
  // The whole point of the change: three members scan the same wall QR and
  // each one must still validate.
  const { id } = issueNonce();
  assert.equal(isValidNonce(id), true);
  assert.equal(isValidNonce(id), true);
  assert.equal(isValidNonce(id), true);
});

test("a nonce is rejected once its TTL has elapsed", (t) => {
  t.mock.timers.enable({ apis: ["Date"] });
  const { id } = issueNonce();

  t.mock.timers.tick(QR_TTL_MS - 1);
  assert.equal(isValidNonce(id), true, "still inside the TTL");

  t.mock.timers.tick(2);
  assert.equal(isValidNonce(id), false, "past the TTL");
});

test("an unknown id is rejected", () => {
  assert.equal(isValidNonce("not-a-real-nonce"), false);
});

test("each call mints a distinct id", () => {
  assert.notEqual(issueNonce().id, issueNonce().id);
});
