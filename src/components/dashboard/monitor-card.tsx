import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from '@/components/status-indicator';
import type { Monitor } from '@/lib/types';
import { FileText, Database, History } from 'lucide-react';

const typeIcons = {
  Elasticsearch: <FileText className="h-4 w-4 text-muted-foreground" />,
  SQL: <Database className="h-4 w-4 text-muted-foreground" />,
};

export function MonitorCard({ monitor }: { monitor: Monitor }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          {typeIcons[monitor.type]}
          <StatusIndicator status={monitor.status} />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle className="text-lg leading-tight">{monitor.name}</CardTitle>
        <CardDescription className="mt-1">
          Last check: {monitor.lastCheck}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <History className="mr-2 h-4 w-4" />
          View History
        </Button>
      </CardFooter>
    </Card>
  );
}
