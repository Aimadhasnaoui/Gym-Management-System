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
dotenv.config();
mongoose
  .connect(process.env.DatabaseConectionString)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
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

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL?.replace(/\/$/, ""),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

// WebSocket Server
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Web display page joins the "display" room
  socket.on("join-display", () => {
    socket.join("display");
  });

  // Mobile scanner requests a new unique QR code
  socket.on("requestQR", () => {
    const qrId = uuidv4(); // unique ID for this check-in session
    const qrUrl = `checkin:${qrId}`; // value the mobile will scan
    // Send ONLY to the display room (web frontend), not back to the mobile
    io.to("display").emit("newQR", { url: qrUrl, id: qrId });
  });
  //code qr has been scaned
  socket.on("validate_checkin", (data) => {
    console.log("QR Code scanned:", data);
     io.to("display").emit("welcomMsg", { data });

    // Handle the scanned QR code (e.g., save to database)
  });
});

io.on("error", (error) => {
  console.log("WebSocket error:", error);
});

app.use(function (req, res, next) {
  req.io = io;
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
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
  res.status(statusCode).json({
    message: err.message,
    status: statusCode,
  });
});
// Start Server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on:`);
  console.log(`  - Local:   http://localhost:${PORT}`);
  console.log(`  - Network: http://192.168.1.13:${PORT}`);
});
