import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key_here");
    req.admin = verified;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
