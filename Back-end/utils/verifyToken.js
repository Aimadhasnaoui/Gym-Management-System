import jwt from "jsonwebtoken";
import Member from "../Members/Members.js";
import { httpError } from "./AppError.js";

export const verifyToken = (req, res, next) => {
  let token;

  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(httpError("Not authorized to access this route, no token", 401));
  }

  try {
    // Pin the algorithm so a token forged with alg:'none' or an asymmetric
    // confusion attack cannot be accepted.
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    req.user = decoded;
    next();
  } catch (err) {
    return next(
      httpError("Not authorized to access this route, invalid token", 401),
    );
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        httpError(
          `User role ${req.user?.role} is not authorized to access this route`,
          403,
        ),
      );
    }
    next();
  };
};

/**
 * Allow admins through unconditionally; allow a `member` only when the
 * :id route param is their OWN member record. Blocks members from reading
 * other members' data or check-ins.
 */
export const authorizeSelfOrAdmin = async (req, res, next) => {
  try {
    if (req.user?.role === "admin") return next();

    const member = await Member.findOne({ userId: req.user.id }).select("_id");
    if (member && String(member._id) === String(req.params.id)) return next();

    return next(httpError("Not authorized to access this resource", 403));
  } catch (err) {
    next(err);
  }
};

/**
 * Check-in creation: admins may create for anyone (kiosk / manual); a member
 * may only create a check-in for THEMSELVES (body.MemberId === own member id).
 */
export const authorizeCheckInCreate = async (req, res, next) => {
  try {
    if (req.user?.role === "admin") return next();

    const member = await Member.findOne({ userId: req.user.id }).select("_id");
    if (member && String(member._id) === String(req.body?.MemberId)) return next();

    return next(httpError("Not authorized to create this check-in", 403));
  } catch (err) {
    next(err);
  }
};
