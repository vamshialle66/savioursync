const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../logs/activity.log");

// Ensure logs folder exists
if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

function logActivity(action, userEmail, by) {
  const logEntry = `${new Date().toISOString()} - ${action} by ${userEmail} (${by})\n`;
  fs.appendFileSync(logFilePath, logEntry);
}

module.exports = logActivity;
