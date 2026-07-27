import { httpError } from "./AppError.js";

/**
 * Express middleware factory: validate & sanitize a request part against a Zod schema.
 * On success, replaces req[source] with the parsed (unknown keys stripped) data.
 * On failure, forwards a 400 error with a readable message.
 *
 * @param {import("zod").ZodTypeAny} schema
 * @param {"body"|"query"|"params"} [source="body"]
 */
export const validate = (schema, source = "body") => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const message = result.error.issues
      .map((i) => `${i.path.join(".") || source}: ${i.message}`)
      .join("; ");
    return next(httpError(message, 400));
  }
  // Cannot reassign req.query in Express 5 (getter-only); mutate instead.
  if (source === "query") {
    Object.keys(req.query).forEach((k) => delete req.query[k]);
    Object.assign(req.query, result.data);
  } else {
    req[source] = result.data;
  }
  next();
};
