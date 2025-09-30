import 'reflect-metadata';
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
import { getDataSource } from '@/lib/db';
import { Monitor as MonitorEntity } from '@/lib/entities';

async function getMonitor(id: string): Promise<Monitor | null> {
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
    if (error instanceof Error && error.message.includes('no such table')) {
      console.warn("Monitors table not found. It probably needs to be initialized.");
      return null;
    }
    console.error(`Failed to fetch monitor ${id}:`, error);
    return null;
  }
}

export default async function MonitorDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const monitor = await getMonitor(params.id);

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
