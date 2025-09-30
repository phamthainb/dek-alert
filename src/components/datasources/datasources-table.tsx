import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { DataSource } from '@/lib/types';
import { MoreVertical, Pencil, Trash2, FileText, Database } from 'lucide-react';

const typeIcons: Record<DataSource['type'], React.ReactNode> = {
  Elasticsearch: <FileText className="h-5 w-5 text-muted-foreground" />,
  PostgreSQL: <Database className="h-5 w-5 text-muted-foreground" />,
  Oracle: <Database className="h-5 w-5 text-muted-foreground" />,
  MySQL: <Database className="h-5 w-5 text-muted-foreground" />,
}

function getSourceDisplay(source: DataSource) {
  if (source.type === 'Elasticsearch') {
    return source.url;
  }
  return `${source.host}:${source.port}`;
}

export function DataSourcesTable({ dataSources }: { dataSources: DataSource[] }) {
  return (
    <Card className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Connection</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataSources.map((source) => (
            <TableRow key={source.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                    {typeIcons[source.type]}
                    <span className="text-sm font-medium">{source.type}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{source.name}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-sm">
                {getSourceDisplay(source)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}