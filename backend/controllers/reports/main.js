import { eq, and, or, ilike, desc, count } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { db } from "../../db/index.js";
import {
  reports,
  reportActivities,
  reportComments,
  activityLogs
} from "../../db/schema/reports.js";
import { users } from "../../db/schema/users.js";
import { notifications } from "../../db/schema/notifications.js";
import { logReportActivity } from "../../middleware/logger.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

export const createReport = async (req, res) => {
  try {
    const userId = req.user?.userId;

    // if (!userId) {
    //   return res.status(401).json({ error: "Unauthorized. User session missing." });
    // }

    const {
      title,
      category,
      description,
      locationName,
      latitude,
      longitude,
      photoUrl,
      isAnonymous = false,
    } = req.body;

    if (!title || !category || !description || !locationName) {
      return res.status(400).json({
        error: "Title, category, description, and location name are required fields.",
      });
    }

    const [{ value: totalReports }] = await db
      .select({ value: count() })
      .from(reports);
      
    const nextNumber = totalReports + 1;
    const reportCode = `#${String(nextNumber).padStart(4, "0")}`;

    const newReport = await db.transaction(async (tx) => {
      const [insertedReport] = await tx
        .insert(reports)
        .values({
          reportCode,
          title,
          category,
          description,
          locationName,
          latitude: latitude ? Number.parseFloat(latitude) : null,
          longitude: longitude ? Number.parseFloat(longitude) : null,
          photoUrl: photoUrl || null,
          isAnonymous: Boolean(isAnonymous),
          reporterId: userId,
          status: "new",
        })
        .returning();

      await logReportActivity(
        {
          reportId: insertedReport.id,
          reportCode: insertedReport.reportCode,
          actionType: "CREATED",
          status: "new",
        },
        tx
      );

      await tx.insert(reportActivities).values({
        reportId: insertedReport.id,
        actorId: userId,
        actionText: "Report created and submitted",
        dotColor: "bg-blue-500",
      });

      return insertedReport;
    });

    return res.status(201).json({
      message: "Report submitted successfully.",
      report: newReport, 
    });
  } catch (error) {
    console.error("Create report error:", error);
    return res.status(500).json({ error: "Internal server error submitting report." });
  }
};

export const getReports = async (req, res) => {
  try {
    const { searchQuery, status, category, page = 1, limit = 10, mine } = req.query;
    const pageNum = Number.parseInt(page, 10);
    const limitNum = Number.parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];

    if (searchQuery) {
      const search = `%${searchQuery}%`;
      
      conditions.push(
        or(
          ilike(reports.title, search),
          ilike(reports.description, search),
          ilike(reports.locationName, search),
          ilike(reports.reportCode, search),
        )
      );
    }

    if (status) {
      conditions.push(eq(reports.status, status));
    }

    if (category) {
      conditions.push(eq(reports.category, category));
    }

    if (mine === "true") {
      
      const authHeader = req.headers["authorization"];
      const token = authHeader?.split(" ")[1];
      
      if (!token) {
        return res.status(401).json({ error: "Access denied. Authentication token missing." });
      }
      
      const decoded = jwt.verify(token, JWT_SECRET);
      
      req.user = decoded;
      const currentUserId = req.user.userId;
      console.log(req.user)
      if (!currentUserId) {
        return res.status(401).json({ error: "Unauthorized: User session not found." });
      }
      conditions.push(eq(reports.reporterId, currentUserId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
      .select({
        id: reports.id,
        reportCode: reports.reportCode,
        title: reports.title,
        category: reports.category,
        description: reports.description,
        locationName: reports.locationName,
        latitude: reports.latitude,
        longitude: reports.longitude,
        photoUrl: reports.photoUrl,
        status: reports.status,
        isAnonymous: reports.isAnonymous,
        createdAt: reports.createdAt,
        updatedAt: reports.updatedAt,
        reporter: {
          id: users.id,
          fullName: users.fullName,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(reports)
      .leftJoin(users, eq(reports.reporterId, users.id))
      .where(whereClause)
      .orderBy(desc(reports.createdAt))
      .limit(limitNum)
      .offset(offset);

    const [{ value: totalCount }] = await db
      .select({ value: count() })
      .from(reports)
      .where(whereClause);

    const sanitizedData = data.map((report) => ({
      ...report,
      reporter: report.isAnonymous ? null : report.reporter,
    }));

    return res.status(200).json({
      reports: sanitizedData,
      pagination: {
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
        currentPage: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error("View reports error:", error);
    return res.status(500).json({ error: "Failed to retrieve reports." });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const reportId = Number.parseInt(id, 10);

    if (Number.isNaN(reportId)) {
      return res.status(400).json({ error: "Invalid report IDDDDDDDDDDDDDDDDD." });
    }

    const [report] = await db
      .select({
        id: reports.id,
        reportCode: reports.reportCode,
        title: reports.title,
        category: reports.category,
        description: reports.description,
        locationName: reports.locationName,
        latitude: reports.latitude,
        longitude: reports.longitude,
        photoUrl: reports.photoUrl,
        status: reports.status,
        isAnonymous: reports.isAnonymous,
        createdAt: reports.createdAt,
        updatedAt: reports.updatedAt,
        reporterId: reports.reporterId,
      })
      .from(reports)
      .where(eq(reports.id, reportId))
      .limit(1);

    if (!report) {
      return res.status(404).json({ error: "Report not found." });
    }

    const activities = await db
      .select({
        id: reportActivities.id,
        actionText: reportActivities.actionText,
        dotColor: reportActivities.dotColor,
        createdAt: reportActivities.createdAt,
        actor: {
          fullName: users.fullName,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(reportActivities)
      .leftJoin(users, eq(reportActivities.actorId, users.id))
      .where(eq(reportActivities.reportId, reportId))
      .orderBy(desc(reportActivities.createdAt));

    const comments = await db
      .select({
        id: reportComments.id,
        commentText: reportComments.commentText,
        createdAt: reportComments.createdAt,
        author: {
          id: users.id,
          fullName: users.fullName,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(reportComments)
      .leftJoin(users, eq(reportComments.authorId, users.id))
      .where(eq(reportComments.reportId, reportId))
      .orderBy(desc(reportComments.createdAt));

    return res.status(200).json({
      report,
      activities,
      comments,
    });
  } catch (error) {
    console.error("View single report error:", error);
    return res.status(500).json({ error: "Failed to retrieve report details." });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized session." });
    }

    const myReports = await db
      .select()
      .from(reports)
      .where(eq(reports.reporterId, userId))
      .orderBy(desc(reports.createdAt));

    return res.status(200).json({
      reports: myReports,
    });
  } catch (error) {
    console.error("View my reports error:", error);
    return res.status(500).json({ error: "Failed to retrieve your reports." });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const reportId = Number.parseInt(id, 10);
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (Number.isNaN(reportId)) {
      return res.status(400).json({ error: "Invalid report ID." });
    }

    const { title, category, description, locationName, status } = req.body;

    const [existingReport] = await db
      .select()
      .from(reports)
      .where(eq(reports.id, reportId))
      .limit(1);

    if (!existingReport) {
      return res.status(404).json({ error: "Report not found." });
    }

    const isCreator = existingReport.reporterId === userId;
    const isElevatedUser = ["officer", "admin"].includes(userRole);

    console.log(userRole, isCreator, isElevatedUser, existingReport.reporterId, userId);
    if (!isCreator && !isElevatedUser) {
      return res.status(403).json({ error: "Forbidden. You cannot update this report." });
    }

    const updatedReport = await db.transaction(async (tx) => {
      const fieldsToUpdate = {
        updatedAt: new Date(),
      };

      if (title) fieldsToUpdate.title = title;
      if (category) fieldsToUpdate.category = category;
      if (description) fieldsToUpdate.description = description;
      if (locationName) fieldsToUpdate.locationName = locationName;
      if (status) fieldsToUpdate.status = status;

      const [updated] = await tx
        .update(reports)
        .set(fieldsToUpdate)
        .where(eq(reports.id, reportId))
        .returning();

      const statusChanged = status && status !== existingReport.status;
      const actionMessage = statusChanged
        ? `Report status updated to '${status.replace("_", " ")}'`
        : "Report details were updated";

      await tx.insert(reportActivities).values({
        reportId,
        actorId: userId,
        actionText: actionMessage,
        dotColor: statusChanged ? "bg-amber-500" : "bg-blue-500",
      });

      const notificationList = [];

      notificationList.push({
        userId: userId,
        reportId: reportId,
        type: statusChanged ? "status_change" : "alert",
        title: "Report Updated",
        message: `You successfully updated report ${existingReport.reportCode || `#${reportId}`} to ${status ? status.replace("_", " ") : existingReport.status}.`,
        iconBg: "bg-blue-50 text-blue-600",
      });

      if (existingReport.reporterId && existingReport.reporterId !== userId) {
        notificationList.push({
          userId: existingReport.reporterId,
          reportId: reportId,
          type: statusChanged ? "status_change" : "alert",
          title: "Your Report Was Updated",
          message: `Your report ${existingReport.reportCode || `#${reportId}`} was updated by an officer/administrator.`,
          iconBg: "bg-amber-50 text-amber-600",
        });
      }

      // FIX: Replaced `updatedReport` with `updated` and passed transaction runner `tx`
      await logReportActivity(
        {
          reportId: updated.id,
          reportCode: updated.reportCode,
          status: updated.status,
          actionType: updated.status,
        },
        tx
      );

      await tx.insert(notifications).values(notificationList);

      return updated;
    });

    return res.status(200).json({
      message: "Report updated successfully.",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Update report error:", error);
    return res.status(500).json({ error: "Failed to update report." });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized session." });
    }

    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));

    return res.status(200).json({
      notifications: userNotifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return res.status(500).json({ error: "Failed to retrieve notifications." });
  }
}

export const getRecentActivity = async (req, res) => {
  console.log("getting recent activity........")
  try {
    const logs = await db
      .select({
        id: activityLogs.id,
        message: activityLogs.message,
        actionType: activityLogs.actionType,
        createdAt: activityLogs.createdAt,
      })
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(10);

    const formattedActivities = logs.map((log) => {
      let dotColor = "bg-amber-500";
      if (log.actionType === "CREATED") dotColor = "bg-red-500";
      else if (log.actionType === "IN_PROGRESS") dotColor = "bg-blue-500";
      else if (log.actionType === "RESOLVED") dotColor = "bg-green-500";

      const dateObj = new Date(log.createdAt);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const formattedTime = dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return {
        id: log.id,
        text: log.message,
        time: `${formattedDate} - ${formattedTime}`,
        dotColor,
      };
    });

    return res.status(200).json({ activities: formattedActivities });
  } catch (error) {
    console.error("Fetch activity logs error:", error);
    return res.status(500).json({ error: "Failed to retrieve activity log." });
  }
};

export const createReportComment = async (req, res) => {
  try {
    const { id } = req.params;
    const reportId = Number.parseInt(id, 10);
    const authorId = req.user?.userId;
    const { commentText } = req.body;

    if (Number.isNaN(reportId)) {
      return res.status(400).json({ error: "Invalid report ID." });
    }

    if (!commentText?.trim()) {
      return res.status(400).json({ error: "Comment text cannot be empty." });
    }

    if (!authorId) {
      return res.status(401).json({ error: "Unauthorized. User session missing." });
    }

    const [existingReport] = await db
      .select()
      .from(reports)
      .where(eq(reports.id, reportId))
      .limit(1);

    if (!existingReport) {
      return res.status(404).json({ error: "Report not found." });
    }

    const newCommentWithActor = await db.transaction(async (tx) => {
      const [insertedComment] = await tx
        .insert(reportComments)
        .values({
          reportId,
          authorId,
          commentText: commentText.trim(),
        })
        .returning();

      await tx.insert(reportActivities).values({
        reportId,
        actorId: authorId,
        actionText: `Commented: "${commentText.trim()}"`,
        dotColor: "bg-blue-500",
      });

      await logReportActivity(
        {
          reportId,
          reportCode: existingReport.reportCode,
          status: existingReport.status,
          actionType: "COMMENT_ADDED",
        },
        tx
      );

      if (existingReport.reporterId && existingReport.reporterId !== authorId) {
        await tx.insert(notifications).values([
          {
            userId: existingReport.reporterId,
            reportId,
            type: "comment",
            title: "New Comment on Your Report",
            message: `Someone commented on report ${existingReport.reportCode || `#${reportId}`}.`,
            iconBg: "bg-blue-50 text-blue-600",
          },
        ]);
      }

      return insertedComment;
    });

    return res.status(201).json({
      message: "Comment posted successfully.",
      comment: newCommentWithActor,
    });
  } catch (error) {
    console.error("Create report comment error:", error);
    return res.status(500).json({ error: "Failed to post comment." });
  }
};