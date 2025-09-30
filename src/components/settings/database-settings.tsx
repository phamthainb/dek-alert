'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { initializeDb } from '@/lib/db-actions';

export function DatabaseSettings() {
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = React.useState(false);

  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      const result = await initializeDb();
      toast({
        title: 'Database Initialized',
        description: `Successfully seeded database with ${result.monitors} monitors, ${result.dataSources} data sources, and ${result.webhooks} webhooks.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Initialization Failed',
        description: 'Could not initialize the database. Check the console for more details.',
      });
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Management</CardTitle>
        <CardDescription>
          Initialize or reset the application database. This will seed the database with mock data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <h3 className="font-medium">Initialize Database</h3>
            <p className="text-sm text-muted-foreground">
              This will drop all existing tables and re-create them with sample data.
            </p>
          </div>
          <Button onClick={handleInitialize} disabled={isInitializing} variant="destructive">
            {isInitializing ? 'Initializing...' : 'Initialize'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
