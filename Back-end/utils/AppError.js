/**
 * Build an Error carrying an HTTP status code.
 * The global error handler in index.js reads `err.status`.
 */
export const httpError = (message, status = 500) => {
  const err = new Error(message);
  err.status = status;
  return err;
};
