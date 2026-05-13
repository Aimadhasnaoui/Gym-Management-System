import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import UserRouter from "./User/UserRouter.js";
import MemberRouter from "./Members/MemberRouter.js";
import PlanRouter from "./Plans/PlanRouter.js";
import CheckInRouter from "./CheckIn/CheckInRouter.js";
import { Login, Me, Logout } from "./User/UserController.js";
import { verifyToken } from "./utils/verifyToken.js";
import { v4 as uuidv4 } from "uuid";
import os from "os";

// Get the real local network IP
const networkInterfaces = os.networkInterfaces();
const localIP = Object.values(networkInterfaces)
  .flat()
  .find((iface) => iface.family === "IPv4" && !iface.internal)?.address ?? "localhost";

dotenv.config();

mongoose
  .connect(process.env.DatabaseConectionString)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PortProject || 5000;

const allowedOrigins = [
  process.env.FRONTEND_URL?.replace(/\/$/, ""),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

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

app.use((req, res, next) => {
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
});
// ────────────────────────────────────────────────────────────────

// WebSocket
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join-display", () => socket.join("display"));

  socket.on("requestQR", () => {
    const qrId = uuidv4();
    const qrUrl = `checkin:${qrId}`;
    io.to("display").emit("newQR", { url: qrUrl, id: qrId });
  });

  socket.on("validate_checkin", (data) => {
    console.log("QR Code scanned:", data);
    io.to("display").emit("welcomMsg", { data });
  });
});

io.on("error", (error) => console.log("WebSocket error:", error));

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
app.use(express.json());
app.use(cookieParser());

app.post("/Login", Login);
app.get("/auth/me", verifyToken, Me);
app.post("/auth/logout", Logout);
app.use("/User", verifyToken, UserRouter);
app.use("/Member", verifyToken, MemberRouter);
app.use("/Plan", verifyToken, PlanRouter);
app.use("/CheckIn", verifyToken, CheckInRouter);

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