import { dataSources, monitors, webhooks } from "@/lib/mock-data";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";

const db = new Database("sentinel.db");

export function initializeDb() {
  db.exec(`
    DROP TABLE IF EXISTS sessions;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS alert_history;
    DROP TABLE IF EXISTS monitors;
    DROP TABLE IF EXISTS data_sources;
    DROP TABLE IF EXISTS webhooks;

    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      last_login TEXT
    );

    CREATE TABLE sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE TABLE monitors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('Elasticsearch', 'SQL')),
      status TEXT NOT NULL CHECK(status IN ('normal', 'alert', 'pending')),
      lastCheck TEXT,
      keywords TEXT, -- JSON array of strings
      dbType TEXT CHECK(dbType IN ('Oracle', 'MySQL', 'PostgreSQL')),
      query TEXT,
      schedule TEXT
    );

    CREATE TABLE alert_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      monitor_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('alert', 'normal')),
      FOREIGN KEY (monitor_id) REFERENCES monitors (id) ON DELETE CASCADE
    );

    CREATE TABLE data_sources (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('Elasticsearch', 'PostgreSQL', 'Oracle', 'MySQL')),
      url TEXT,
      apiKey TEXT,
      host TEXT,
      port INTEGER,
      user TEXT,
      password TEXT,
      database TEXT
    );

    CREATE TABLE webhooks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      url TEXT,
      platform TEXT NOT NULL CHECK(platform IN ('Slack', 'Discord', 'Generic', 'Custom'))
    );
  `);

  const insertMonitor = db.prepare(
    "INSERT INTO monitors (id, name, type, status, lastCheck, keywords, dbType, query, schedule) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  const insertAlertHistory = db.prepare(
    "INSERT INTO alert_history (monitor_id, timestamp, message, status) VALUES (?, ?, ?, ?)"
  );
  const insertDataSource = db.prepare(
    "INSERT INTO data_sources (id, name, type, url, apiKey, host, port, user, password, database) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  const insertWebhook = db.prepare(
    "INSERT INTO webhooks (id, name, url, platform) VALUES (?, ?, ?, ?)"
  );
  const insertUser = db.prepare(
    "INSERT INTO users (id, username, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)"
  );

  db.transaction(() => {
    // Insert default admin user (password: admin123)
    const adminId = "admin-1";
    const passwordHash = bcrypt.hashSync("admin123", 10);
    insertUser.run(
      adminId,
      "admin",
      "admin@alerthub.com",
      passwordHash,
      new Date().toISOString()
    );

    monitors.forEach((monitor) => {
      insertMonitor.run(
        monitor.id,
        monitor.name,
        monitor.type,
        monitor.status,
        monitor.lastCheck,
        monitor.type === "Elasticsearch"
          ? JSON.stringify(monitor.keywords)
          : null,
        monitor.type === "SQL" ? monitor.dbType : null,
        monitor.type === "SQL" ? monitor.query : null,
        monitor.type === "SQL" ? monitor.schedule : null
      );
      monitor.alertHistory.forEach((entry) => {
        insertAlertHistory.run(
          monitor.id,
          entry.timestamp,
          entry.message,
          entry.status
        );
      });
    });

    dataSources.forEach((ds) => {
      insertDataSource.run(
        ds.id,
        ds.name,
        ds.type,
        ds.type === "Elasticsearch" ? ds.url : null,
        ds.type === "Elasticsearch" ? ds.apiKey : null,
        ds.type !== "Elasticsearch" ? ds.host : null,
        ds.type !== "Elasticsearch" ? ds.port : null,
        ds.type !== "Elasticsearch" ? ds.user : null,
        ds.type !== "Elasticsearch" ? ds.password : null,
        ds.type !== "Elasticsearch" ? ds.database : null
      );
    });

    webhooks.forEach((wh) => {
      insertWebhook.run(wh.id, wh.name, wh.url, wh.platform);
    });
  })();

  return {
    monitors: monitors.length,
    dataSources: dataSources.length,
    webhooks: webhooks.length,
  };
}

export default db;
