import { Button } from '@/components/ui/button';
import { MonitorsTable } from '@/components/monitors/monitors-table';
import { PageHeader } from '@/components/page-header';
import type { Monitor } from '@/lib/types';
import db from '@/lib/db';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

function getSqlMonitors(): Monitor[] {
  try {
    const stmt = db.prepare(`
      SELECT m.*,
             (SELECT json_group_array(json_object('timestamp', ah.timestamp, 'message', ah.message, 'status', ah.status))
              FROM alert_history ah
              WHERE ah.monitor_id = m.id
              ORDER BY ah.timestamp DESC) as alertHistory
      FROM monitors m
      WHERE m.type = 'SQL'
    `);
    const monitors = stmt.all() as any[];

    return monitors.map(m => ({
      ...m,
      alertHistory: m.alertHistory ? JSON.parse(m.alertHistory) : [],
      keywords: m.keywords ? JSON.parse(m.keywords) : [],
    }));
  } catch (error) {
    if (error instanceof Error && error.message.includes('no such table')) {
      console.warn("Monitors table not found. It probably needs to be initialized.");
      return [];
    }
    console.error("Failed to fetch SQL monitors:", error);
    return [];
  }
}

export default function SqlMonitorsPage() {
  const monitors = getSqlMonitors();

  const sortedMonitors = [...monitors].sort((a, b) => {
    const statusOrder = { alert: 0, pending: 1, normal: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <>
      <PageHeader
        title="SQL Alerts"
        description="Manage and review all your SQL query-based monitors."
      >
        <Button asChild>
          <Link href="/monitors/sql/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Monitor
          </Link>
        </Button>
      </PageHeader>
      <MonitorsTable monitors={sortedMonitors} />
    </>
  );
}
