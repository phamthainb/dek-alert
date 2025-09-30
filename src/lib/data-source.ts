import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User, Session, Monitor, AlertHistory, DataSource as DataSourceEntity, Webhook } from './entities';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_PATH || 'sentinel.db',
  synchronize: false, // We'll use migrations instead
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Session, Monitor, AlertHistory, DataSourceEntity, Webhook],
  migrations: ['src/lib/migrations/*.ts'],
  subscribers: [],
});

let isInitialized = false;

export async function getDataSource(): Promise<DataSource> {
  if (!isInitialized) {
    await AppDataSource.initialize();
    isInitialized = true;
  }
  return AppDataSource;
}

export async function closeDataSource(): Promise<void> {
  if (isInitialized && AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    isInitialized = false;
  }
}
