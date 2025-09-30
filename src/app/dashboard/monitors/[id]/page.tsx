import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusIndicator } from '@/components/status-indicator';
import { format, formatDistanceToNow } from 'date-fns';
import type { Monitor } from '@/lib/types';
import db from '@/lib/db';

function getMonitor(id: string): Monitor | null {
  try {
    const stmt = db.prepare(`
      SELECT m.*, 
             (SELECT json_group_array(json_object('timestamp', ah.timestamp, 'message', ah.message, 'status', ah.status)) 
              FROM alert_history ah 
              WHERE ah.monitor_id = m.id 
              ORDER BY ah.timestamp DESC) as alertHistory
      FROM monitors m
      WHERE m.id = ?
    `);
    const monitor = stmt.get(id) as any;

    if (!monitor) return null;

    return {
      ...monitor,
      alertHistory: monitor.alertHistory ? JSON.parse(monitor.alertHistory) : [],
      keywords: monitor.keywords ? JSON.parse(monitor.keywords) : [],
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('no such table')) {
      console.warn("Monitors table not found. It probably needs to be initialized.");
      return null;
    }
    console.error(`Failed to fetch monitor ${id}:`, error);
    return null;
  }
}

export default function MonitorDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const monitor = getMonitor(params.id);

  if (!monitor) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={monitor.name}
        description={`Details and run history for this ${monitor.type} monitor.`}
      >
        <Badge variant={monitor.status === 'alert' ? 'destructive' : 'secondary'}>
          <StatusIndicator status={monitor.status} />
          <span className="ml-2 capitalize">{monitor.status}</span>
        </Badge>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Run History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monitor.alertHistory.length > 0 ? (
                monitor.alertHistory.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <StatusIndicator status={entry.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(entry.timestamp), 'MMM d, yyyy, h:mm:ss a')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{entry.message}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No run history available for this monitor yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
