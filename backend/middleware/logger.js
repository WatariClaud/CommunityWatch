import { db } from "../db";
import { activityLogs } from "../db/schema";

const logger = (req, res, next) => {
  console.log(`[API Request] ${req.method} ${req.url}`);
  next();
};


export const logReportActivity = async (
  { reportId, reportCode, status, actionType },
  dbOrTx = defaultDb
) => {
  let message = "";

  if (actionType === "CREATED") {
    message = `New report ${reportCode || `#${reportId}`} submitted`;
  } else if (status === "IN_PROGRESS") {
    message = `Report ${reportCode || `#${reportId}`} status changed to In Progress`;
  } else if (status === "RESOLVED") {
    message = `Report ${reportCode || `#${reportId}`} marked as Resolved`;
  } else {
    message = `Report ${reportCode || `#${reportId}`} updated to ${status}`;
  }

  await dbOrTx.insert(activityLogs).values({
    reportId,
    reportCode,
    actionType: actionType || status,
    message,
  });
};

module.exports = {
  logger,
  logReportActivity,
};