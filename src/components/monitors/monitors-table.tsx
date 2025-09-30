"use client";

import React from 'react';
import Link from 'next/link';
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
import { Badge } from '@/components/ui/badge';
import { StatusIndicator } from '@/components/status-indicator';
import type { Monitor } from '@/lib/types';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Card } from '../ui/card';

export function MonitorsTable({ monitors }: { monitors: Monitor[] }) {

  return (
    <>
      <Card className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Last Check</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {monitors.map((monitor) => (
              <TableRow key={monitor.id}>
                <TableCell>
                  <StatusIndicator status={monitor.status} />
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/monitors/${monitor.id}`} className="hover:underline">
                    {monitor.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{monitor.type}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {monitor.type === 'Elasticsearch'
                    ? monitor.keywords.join(', ')
                    : monitor.schedule}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {monitor.lastCheck}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/monitors/${monitor.id}/edit`}>
                           <Pencil className="mr-2 h-4 w-4" /> Edit
                        </Link>
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
    </>
  );
}
