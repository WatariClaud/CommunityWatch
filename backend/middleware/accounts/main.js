import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users } from "../../db/schema/users.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access denied. Authentication token missing." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired. Please log in again." });
    }
    return res.status(403).json({ error: "Invalid or corrupted authentication token." });
  }
};

export const requireActiveUser = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized user session." });
    }

    const [user] = await db
      .select({
        id: users.id,
        role: users.role,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: "Authenticated user no longer exists." });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Your account has been deactivated." });
    }

    req.user.role = user.role;
    next();
  } catch (error) {
    console.error("Middleware requireActiveUser error:", error);
    return res.status(500).json({ error: "Internal server error during account verification." });
  }
};

export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json({ error: "Unauthorized access." });
    }

    const userRole = req.user.role.toLowerCase();
    const normalizedAllowed = allowedRoles.map((role) => role.toLowerCase());

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        error: `Forbidden. Requires one of the following roles: [${allowedRoles.join(", ")}]`,
      });
    }

    next();
  };
};