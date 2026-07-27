import { z } from "zod";

// ── Reusable field primitives ──────────────────────────────────────────────
export const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid identifier");

/** Shared password policy: >= 10 chars with upper, lower and a digit. */
export const passwordField = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .max(128, "Password is too long")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[0-9]/, "Password must contain a digit");

const email = z.string().trim().toLowerCase().email("Invalid email").max(200);
const name = z.string().trim().min(2, "Too short").max(100);

// ── Auth ────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required").max(128),
});

export const setPasswordSchema = z.object({
  userId: objectId,
  token: z.string().min(20, "Invalid token").max(200),
  password: passwordField,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required").max(128),
  newPassword: passwordField,
});

// ── User (admin-managed) ─────────────────────────────────────────────────────
export const userCreateSchema = z.object({
  FullName: name,
  Email: email,
  password: passwordField,
  role: z.enum(["admin", "member"]).default("member"),
});

// password is intentionally omitted → Zod strips it, so editUser can never
// set/overwrite a password (and never escalate via a raw hash).
export const userUpdateSchema = z
  .object({
    FullName: name.optional(),
    Email: email.optional(),
    role: z.enum(["admin", "member"]).optional(),
  })
  .strict()
  .partial();

// ── Member ────────────────────────────────────────────────────────────────
export const memberCreateSchema = z.object({
  FullName: name,
  Email: email,
  phone: z.string().trim().min(3, "Too short").max(30),
  address: z.string().trim().min(2, "Too short").max(200),
  Plan: objectId,
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.enum(["active", "inactive", "Expiring"]).optional(),
});

export const memberUpdateSchema = z.object({
  FullName: name.optional(),
  Email: email.optional(),
  phone: z.string().trim().min(3).max(30).optional(),
  address: z.string().trim().min(2).max(200).optional(),
  Plan: objectId.optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.enum(["active", "inactive", "Expiring"]).optional(),
});

// ── Plan ────────────────────────────────────────────────────────────────────
export const planCreateSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  price: z.coerce.number().nonnegative("Price must be >= 0"),
  duration: z.coerce.number().int().positive("Duration must be a positive integer"),
});

export const planUpdateSchema = planCreateSchema.partial();

// ── Check-in ────────────────────────────────────────────────────────────────
export const checkInCreateSchema = z.object({
  MemberId: objectId,
  CheckIn: z.coerce.date().optional(),
});

export const checkInUpdateSchema = z.object({
  MemberId: objectId.optional(),
  CheckIn: z.coerce.date().optional(),
});
