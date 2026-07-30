import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { doubleCsrf } from "csrf-csrf";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import { Server } from "socket.io";
import os from "os";

import UserRouter from "./User/UserRouter.js";
import MemberRouter from "./Members/MemberRouter.js";
import PlanRouter from "./Plans/PlanRouter.js";
import CheckInRouter from "./CheckIn/CheckInRouter.js";
import {
  Login,
  Me,
  Logout,
  validateActivation,
  setPassword,
} from "./User/UserController.js";
import { verifyToken } from "./utils/verifyToken.js";
import { validate } from "./utils/validate.js";
import { loginSchema, setPasswordSchema } from "./utils/validators.js";
import { loginLockout } from "./utils/loginLockout.js";
import { isValidNonce } from "./utils/qrNonces.js";

dotenv.config();

const isProd = process.env.ProjectEnv === "production";

// Get the real local network IP
const networkInterfaces = os.networkInterfaces();
const localIP = Object.values(networkInterfaces)
  .flat()
  .find((iface) => iface.family === "IPv4" && !iface.internal)?.address ?? "localhost";

mongoose
  .connect(process.env.DatabaseConectionString)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const app = express();
// Trust the reverse proxy (nginx/Caddy/Cloudflare) so req.ip and `secure`
// cookies are evaluated correctly in production.
app.set("trust proxy", 1);
const server = createServer(app);

const PORT = process.env.PortProject || 5000;

const allowedOrigins = [
  process.env.FRONTEND_URL?.replace(/\/$/, ""),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ── Request Logger ──────────────────────────────────────────────
const COLORS = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  white: "\x1b[37m",
};

const METHOD_COLORS = {
  GET: COLORS.green,
  POST: COLORS.cyan,
  PUT: COLORS.yellow,
  PATCH: COLORS.yellow,
  DELETE: COLORS.red,
};

const statusColor = (code) => {
  if (code >= 500) return COLORS.red;
  if (code >= 400) return COLORS.yellow;
  if (code >= 300) return COLORS.cyan;
  return COLORS.green;
};

const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, url } = req;
  const methodClr = METHOD_COLORS[method] || COLORS.white;

  res.on("finish", () => {
    const ms = Date.now() - start;
    const code = res.statusCode;
    const time = new Date().toLocaleTimeString("en-US", { hour12: false });

    console.log(
      `${COLORS.dim}${time}${COLORS.reset}  ` +
      `${methodClr}${method.padEnd(7)}${COLORS.reset}` +
      `${COLORS.white}${url.padEnd(40)}${COLORS.reset}` +
      `${statusColor(code)}${code}${COLORS.reset}  ` +
      `${COLORS.dim}${ms}ms${COLORS.reset}`
    );
  });

  next();
};
// ────────────────────────────────────────────────────────────────

// ── WebSocket: authenticate handshake, validate events ──────────
const parseCookies = (str = "") =>
  str.split(";").reduce((acc, part) => {
    const idx = part.indexOf("=");
    if (idx > -1)
      acc[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
    return acc;
  }, {});

io.use((socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      parseCookies(socket.handshake.headers?.cookie).token;
    if (!token) return next(new Error("Unauthorized"));
    socket.user = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  // Only the gym display (kiosk / admin) may host the board.
  socket.on("join-display", () => {
    if (socket.user?.role !== "admin") return;
    socket.join("display");
  });

  socket.on("validate_checkin", (data) => {
    if (!data || typeof data !== "object") return; // reject malformed payloads
    const id = typeof data.id === "string" ? data.id : null;
    if (!id) return; // require the scanned nonce
    // Read-only: the displayed code stays valid for everyone else in line.
    if (!isValidNonce(id)) return; // unknown or expired nonce
    console.log(`check-in scan validated: nonce=${id} by user=${socket.user?.id}`);
    io.to("display").emit("welcomMsg", { data, userId: socket.user?.id });
  });
});

io.on("error", (error) => console.log("WebSocket error:", error));

// ── CSRF (double-submit cookie) ─────────────────────────────────
const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || process.env.JWT_SECRET,
  getSessionIdentifier: (req) => req.cookies?.token || req.ip || "anonymous",
  cookieName: isProd ? "__Host-fitcore.x-csrf-token" : "fitcore.x-csrf-token",
  cookieOptions: {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    path: "/",
  },
  size: 32,
  getCsrfTokenFromRequest: (req) => req.headers["x-csrf-token"],
});

// Bearer-authenticated (mobile) requests aren't cookie-driven → not CSRF-able.
const csrfProtect = (req, res, next) => {
  if (req.headers.authorization?.startsWith("Bearer")) return next();
  return doubleCsrfProtection(req, res, next);
};

// ── Middleware pile ─────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    hsts: isProd ? { maxAge: 15552000, includeSubDomains: true } : false,
  })
);
app.use(requestLogger);
app.use((req, res, next) => { req.io = io; next(); });
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Hand out a CSRF token (GET is not CSRF-protected). Call after login.
app.get("/csrf-token", (req, res) => {
  res.status(200).json({ csrfToken: generateCsrfToken(req, res) });
});

// ── Auth ────────────────────────────────────────────────────────
app.post("/Login", authLimiter, loginLockout, validate(loginSchema), Login);
app.get("/auth/me", verifyToken, Me);
app.post("/auth/logout", Logout);
app.get("/auth/activation/:uid/:token", authLimiter, validateActivation);
app.post("/auth/set-password", authLimiter, validate(setPasswordSchema), setPassword);

// ── Protected resources (CSRF enforced on cookie-based writes) ──
app.use("/User", verifyToken, csrfProtect, UserRouter);
app.use("/Member", verifyToken, csrfProtect, MemberRouter);
app.use("/Plan", verifyToken, csrfProtect, PlanRouter);
app.use("/CheckIn", verifyToken, csrfProtect, CheckInRouter);

app.all(/.*/, (req, res, next) => {
  const err = new Error(`${req.url} : can't find this url`);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({ message: err.message, status: statusCode });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`\nServer is running on:`);
  console.log(`  - Local:   http://localhost:${PORT}`);
  console.log(`  - Network: http://${localIP}:${PORT}\n`);
});
