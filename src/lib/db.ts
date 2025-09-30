import 'reflect-metadata';
import { dataSources, monitors, webhooks } from "@/lib/mock-data";
import bcrypt from "bcryptjs";
import { getDataSource } from './data-source';
import { User, Monitor, AlertHistory, DataSource, Webhook } from './entities';

export async function initializeDb() {
  const dataSource = await getDataSource();

  // Run migrations
  await dataSource.runMigrations();

  // Clear existing data
  await dataSource.query('DELETE FROM alert_history');
  await dataSource.query('DELETE FROM sessions');
  await dataSource.query('DELETE FROM monitors');
  await dataSource.query('DELETE FROM data_sources');
  await dataSource.query('DELETE FROM webhooks');
  await dataSource.query('DELETE FROM users');

  // Get repositories
  const userRepo = dataSource.getRepository(User);
  const monitorRepo = dataSource.getRepository(Monitor);
  const alertHistoryRepo = dataSource.getRepository(AlertHistory);
  const dataSourceRepo = dataSource.getRepository(DataSource);
  const webhookRepo = dataSource.getRepository(Webhook);

  // Insert default admin user (password: admin123)
  const adminId = "admin-1";
  const passwordHash = bcrypt.hashSync("admin123", 10);
  
  const adminUser = userRepo.create({
    id: adminId,
    username: "admin",
    email: "admin@alerthub.com",
    password_hash: passwordHash,
    created_at: new Date().toISOString(),
  });
  await userRepo.save(adminUser);

  // Insert monitors
  for (const monitor of monitors) {
    const newMonitor = monitorRepo.create({
      id: monitor.id,
      name: monitor.name,
      type: monitor.type,
      status: monitor.status,
      lastCheck: monitor.lastCheck,
      keywords: monitor.type === "Elasticsearch" ? JSON.stringify(monitor.keywords) : undefined,
      dbType: monitor.type === "SQL" ? monitor.dbType : undefined,
      query: monitor.type === "SQL" ? monitor.query : undefined,
      schedule: monitor.type === "SQL" ? monitor.schedule : undefined,
    });
    await monitorRepo.save(newMonitor);

    // Insert alert history for this monitor
    for (const entry of monitor.alertHistory) {
      const alertEntry = alertHistoryRepo.create({
        monitor_id: monitor.id,
        timestamp: entry.timestamp,
        message: entry.message,
        status: entry.status,
      });
      await alertHistoryRepo.save(alertEntry);
    }
  }

  // Insert data sources
  for (const ds of dataSources) {
    const newDs = dataSourceRepo.create({
      id: ds.id,
      name: ds.name,
      type: ds.type,
      url: ds.type === "Elasticsearch" ? ds.url : undefined,
      apiKey: ds.type === "Elasticsearch" ? ds.apiKey : undefined,
      host: ds.type !== "Elasticsearch" ? ds.host : undefined,
      port: ds.type !== "Elasticsearch" ? ds.port : undefined,
      user: ds.type !== "Elasticsearch" ? ds.user : undefined,
      password: ds.type !== "Elasticsearch" ? ds.password : undefined,
      database: ds.type !== "Elasticsearch" ? ds.database : undefined,
    });
    await dataSourceRepo.save(newDs);
  }

  // Insert webhooks
  for (const wh of webhooks) {
    const newWh = webhookRepo.create({
      id: wh.id,
      name: wh.name,
      url: wh.url,
      platform: wh.platform,
    });
    await webhookRepo.save(newWh);
  }

  return {
    monitors: monitors.length,
    dataSources: dataSources.length,
    webhooks: webhooks.length,
  };
}

// Export empty default for backward compatibility with actions.ts
const db = {};
export default db;

export { getDataSource };

