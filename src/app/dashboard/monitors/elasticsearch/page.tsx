import 'reflect-metadata';
import { Button } from '@/components/ui/button';
import { MonitorsTable } from '@/components/monitors/monitors-table';
import { PageHeader } from '@/components/page-header';
import type { Monitor } from '@/lib/types';
import { getDataSource } from '@/lib/db';
import { Monitor as MonitorEntity } from '@/lib/entities';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

async function getElasticsearchMonitors(): Promise<Monitor[]> {
  try {
    const dataSource = await getDataSource();
    const monitorRepo = dataSource.getRepository(MonitorEntity);

    const monitors = await monitorRepo.find({
      where: { type: 'Elasticsearch' },
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
      type: 'Elasticsearch' as const,
      status: m.status,
      lastCheck: m.lastCheck || '',
      keywords: m.keywords ? JSON.parse(m.keywords) : [],
      alertHistory: (m.alertHistory || []).map(ah => ({
        timestamp: ah.timestamp,
        message: ah.message,
        status: ah.status,
      })),
    }));
  } catch (error) {
    if (error instanceof Error && error.message.includes('no such table')) {
      console.warn("Monitors table not found. It probably needs to be initialized.");
      return [];
    }
    console.error("Failed to fetch Elasticsearch monitors:", error);
    return [];
  }
}

export default async function ElasticsearchMonitorsPage() {
  const monitors = await getElasticsearchMonitors();

  const sortedMonitors = [...monitors].sort((a, b) => {
    const statusOrder = { alert: 0, pending: 1, normal: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <>
      <PageHeader
        title="Elasticsearch Monitors"
        description="Manage and review all your Elasticsearch log monitors."
      >
        <Button asChild>
          <Link href="/monitors/elasticsearch/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Monitor
          </Link>
        </Button>
      </PageHeader>
      <MonitorsTable monitors={sortedMonitors} />
    </>
  );
}
