import Database from 'better-sqlite3';
import { monitors, dataSources, webhooks } from '@/lib/mock-data';

const db = new Database('sentinel.db');

export function initializeDb() {
  db.exec(`
    DROP TABLE IF EXISTS alert_history;
    DROP TABLE IF EXISTS monitors;
    DROP TABLE IF EXISTS data_sources;
    DROP TABLE IF EXISTS webhooks;

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
    'INSERT INTO monitors (id, name, type, status, lastCheck, keywords, dbType, query, schedule) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const insertAlertHistory = db.prepare(
    'INSERT INTO alert_history (monitor_id, timestamp, message, status) VALUES (?, ?, ?, ?)'
  );
  const insertDataSource = db.prepare(
    'INSERT INTO data_sources (id, name, type, url, apiKey, host, port, user, password, database) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const insertWebhook = db.prepare(
    'INSERT INTO webhooks (id, name, url, platform) VALUES (?, ?, ?, ?)'
  );

  db.transaction(() => {
    monitors.forEach((monitor) => {
      insertMonitor.run(
        monitor.id,
        monitor.name,
        monitor.type,
        monitor.status,
        monitor.lastCheck,
        monitor.type === 'Elasticsearch' ? JSON.stringify(monitor.keywords) : null,
        monitor.type === 'SQL' ? monitor.dbType : null,
        monitor.type === 'SQL' ? monitor.query : null,
        monitor.type === 'SQL' ? monitor.schedule : null
      );
      monitor.alertHistory.forEach((entry) => {
        insertAlertHistory.run(monitor.id, entry.timestamp, entry.message, entry.status);
      });
    });

    dataSources.forEach((ds) => {
      insertDataSource.run(
        ds.id,
        ds.name,
        ds.type,
        ds.type === 'Elasticsearch' ? ds.url : null,
        ds.type === 'Elasticsearch' ? ds.apiKey : null,
        ds.type !== 'Elasticsearch' ? ds.host : null,
        ds.type !== 'Elasticsearch' ? ds.port : null,
        ds.type !== 'Elasticsearch' ? ds.user : null,
        ds.type !== 'Elasticsearch' ? ds.password : null,
        ds.type !== 'Elasticsearch' ? ds.database : null
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
