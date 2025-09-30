'use server';

import 'reflect-metadata';
import { getDataSource } from './db';
import { Monitor as MonitorEntity, Webhook as WebhookEntity } from './entities';
import type { Monitor, Webhook } from './types';

export async function getMonitorById(id: string): Promise<Monitor | null> {
  try {
    const dataSource = await getDataSource();
    const monitorRepo = dataSource.getRepository(MonitorEntity);

    const monitor = await monitorRepo.findOne({
      where: { id },
      relations: ['alertHistory'],
      order: {
        alertHistory: {
          timestamp: 'DESC',
        },
      },
    });

    if (!monitor) return null;

    return {
      id: monitor.id,
      name: monitor.name,
      type: monitor.type,
      status: monitor.status,
      lastCheck: monitor.lastCheck || '',
      alertHistory: (monitor.alertHistory || []).map(ah => ({
        timestamp: ah.timestamp,
        message: ah.message,
        status: ah.status,
      })),
      ...(monitor.type === 'Elasticsearch' ? {
        keywords: monitor.keywords ? JSON.parse(monitor.keywords) : [],
      } : {
        dbType: monitor.dbType!,
        query: monitor.query || '',
        schedule: monitor.schedule || '',
      }),
    } as Monitor;
  } catch (error) {
    console.error(`Failed to fetch monitor ${id}:`, error);
    return null;
  }
}

export async function getWebhookById(id: string): Promise<Webhook | null> {
  try {
    const dataSource = await getDataSource();
    const webhookRepo = dataSource.getRepository(WebhookEntity);

    const webhook = await webhookRepo.findOne({
      where: { id },
    });

    if (!webhook) return null;

    return {
      id: webhook.id,
      name: webhook.name,
      url: webhook.url || '',
      platform: webhook.platform,
    };
  } catch (error) {
    console.error(`Failed to fetch webhook ${id}:`, error);
    return null;
  }
}
