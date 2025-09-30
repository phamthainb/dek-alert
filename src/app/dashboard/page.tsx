import 'reflect-metadata';
import { Button } from '@/components/ui/button';
import { MonitorsTable } from '@/components/monitors/monitors-table';
import { PageHeader } from '@/components/page-header';
import type { Monitor } from '@/lib/types';
import { getDataSource } from '@/lib/db';
import { Monitor as MonitorEntity, AlertHistory } from '@/lib/entities';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

async function getMonitors(): Promise<Monitor[]> {
  try {
    const dataSource = await getDataSource();
    const monitorRepo = dataSource.getRepository(MonitorEntity);

    const monitors = await monitorRepo.find({
      relations: ['alertHistory'],
      order: {
        alertHistory: {
          timestamp: 'DESC',
        },
      },
    });

    return monitors.map(m => ({
      id: m.id,
      name: m.name,
      type: m.type,
      status: m.status,
      lastCheck: m.lastCheck || '',
      alertHistory: (m.alertHistory || []).map(ah => ({
        timestamp: ah.timestamp,
        message: ah.message,
        status: ah.status,
      })),
      ...(m.type === 'Elasticsearch' ? {
        keywords: m.keywords ? JSON.parse(m.keywords) : [],
      } : {
        dbType: m.dbType!,
        query: m.query || '',
        schedule: m.schedule || '',
      }),
    })) as Monitor[];
  } catch (error) {
    if (error instanceof Error && error.message.includes('no such table')) {
      console.warn("Monitors table not found. It probably needs to be initialized.");
      return [];
    }
    console.error("Failed to fetch monitors:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const monitors = await getMonitors();
  
  const sortedMonitors = [...monitors].sort((a, b) => {
    const statusOrder = { alert: 0, pending: 1, normal: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A real-time overview of all active monitors and their current status."
      >
        {/* This is a placeholder. The user might want a dropdown here later. */}
      </PageHeader>
      <MonitorsTable monitors={sortedMonitors} />
    </>
  );
}
