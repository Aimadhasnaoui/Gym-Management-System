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
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
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
  next(new Error(`${req.url} : can't find this url`, 404));
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(404).json({
    message: `${err.message}`,
    status: 404,
  });
});
// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
