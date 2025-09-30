'use server';

import { initializeDb as initDb } from './db';

export async function initializeDb() {
  return initDb();
}
