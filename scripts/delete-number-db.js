const Database = require("better-sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "..", "data", "conversations.db");
const db = new Database(dbPath);
const targets = [
  "5524981058194",
  "5524981058194@c.us",
  "24981058194",
  "24981058194@c.us",
];
console.log("DB:", dbPath);
const tables = ["conversations", "contacts", "appointments", "follow_ups"];
const summary = {};

try {
  db.exec("BEGIN");
  for (const t of tables) {
    // Check if table exists
    const tbl = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?")
      .get(t);
    if (!tbl) {
      summary[t] = "table_missing";
      continue;
    }
    const delStmt = db.prepare(
      `DELETE FROM ${t} WHERE phone_number IN (${targets
        .map(() => "?")
        .join(",")}) OR phone_number LIKE ?`
    );
    const res = delStmt.run(...targets, "%" + targets[0].slice(-8));
    summary[t] = res.changes;
  }
  db.exec("COMMIT");
} catch (e) {
  db.exec("ROLLBACK");
  console.error("ERROR", e.message);
}
console.log("Remoção resumida:", summary);
db.close();
