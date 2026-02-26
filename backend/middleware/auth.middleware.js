import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "fallback_secret", (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    
    req.userId = decoded.userId;
    next();
  });
};

// Optional authentication - allows both authenticated and anonymous users
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    // No token provided, continue as anonymous
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET || "fallback_secret", (err, decoded) => {
    if (err) {
      // Invalid token, continue as anonymous
      return next();
    }
    
    req.userId = decoded.userId;
    next();
  });
};
