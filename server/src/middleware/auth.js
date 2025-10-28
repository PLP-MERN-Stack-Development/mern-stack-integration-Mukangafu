import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function (req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id).select("-passwordHash");
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
