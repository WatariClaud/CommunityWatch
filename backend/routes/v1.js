import { Router } from "express";
import { signup, login, forgotPassword, getMe, resetPassword } from "../controllers/accounts/main.js";
import {
  createReport,
  getReports,
  getReportById,
  getMyReports,
  updateReport,
  getNotifications,
  getRecentActivity,
  createReportComment,
} from "../controllers/reports/main.js";
import {
  authenticateToken,
  requireActiveUser,
} from "../middleware/accounts/main.js";

const router = Router();

// Accounts
router.post("/accounts/signup", signup);
router.post("/accounts/login", login);
router.post("/accounts/reset-password", resetPassword);
router.post("/accounts/forgot-password", forgotPassword);
router.get("/accounts/me", authenticateToken, requireActiveUser, getMe);

// Reports
router.get("/reports", getReports);
router.get("/reports/me", authenticateToken, requireActiveUser, getMyReports);
router.get("/reports/activity", getRecentActivity);
router.get("/reports/:id", getReportById);
router.post("/reports", createReport);
router.patch("/reports/:id", authenticateToken, requireActiveUser, updateReport);
router.post("/reports/:id/comments", authenticateToken, requireActiveUser, createReportComment);

//notifications
router.get("/notifications", authenticateToken, requireActiveUser, getNotifications);

export default router;