import "reflect-metadata";
import { DataSource } from "typeorm";

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  if (dataSource && !dataSource.isInitialized) {
    await dataSource.initialize();
    return dataSource;
  }

  // Lazy load entities to avoid circular dependencies
  const { User } = await import("./entities/User");
  const { Session } = await import("./entities/Session");
  const { Monitor } = await import("./entities/Monitor");
  const { AlertHistory } = await import("./entities/AlertHistory");
  const { DataSource: DataSourceEntity } = await import(
    "./entities/DataSource"
  );
  const { Webhook } = await import("./entities/Webhook");

  dataSource = new DataSource({
    type: "sqlite",
    database: process.env.DATABASE_PATH || "alert-hub.db",
    synchronize: false, // We'll use migrations instead
    logging: process.env.NODE_ENV === "development",
    entities: [User, Session, Monitor, AlertHistory, DataSourceEntity, Webhook],
    migrations: [],
    subscribers: [],
  });

  await dataSource.initialize();
  return dataSource;
}

export async function closeDataSource(): Promise<void> {
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
    dataSource = null;
  }
}
