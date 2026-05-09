import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import UserRouter from "./User/UserRouter.js";
import MemberRouter from "./Members/MemberRouter.js";
import PlanRouter from "./Plans/PlanRouter.js";
import CheckInRouter from "./CheckIn/CheckInRouter.js";

import { Login, Me, Logout } from "./User/UserController.js";
import { verifyToken } from "./utils/verifyToken.js";

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
const PORT = process.env.PortProject || 5000;

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL?.replace(/\/$/, ""),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

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
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on:`);
  console.log(`  - Local:   http://localhost:${PORT}`);
  console.log(`  - Network: http://192.168.1.13:${PORT}`);
});
