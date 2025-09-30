"use client"

import * as React from "react";
import { notFound } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CustomScriptEditor } from "@/components/custom-script-editor";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import type { Monitor } from '@/lib/types';
import { getMonitorById } from '@/lib/data-actions';

const elkPlaceholderScript = `/**
 * @param {any} logData - The log data that triggered the alert.
 * @returns {boolean} - Return true to send notification, false to suppress.
 */
function shouldNotify(logData) {
  // Example: Only notify for errors on specific hostnames
  if (logData.hostname && logData.hostname.includes('canary')) {
    return false;
  }
  return true;
}`;

const sqlPlaceholderScript = `/**
 * @param {any} queryResult - The result of the SQL query.
 * @returns {boolean} - Return true to send notification, false to suppress.
 */
function shouldNotify(queryResult) {
  // Example: Only notify during business hours
  const hour = new Date().getHours();
  if (hour < 9 || hour > 17) {
    return false;
  }
  return true;
}`;

export default function EditMonitorPage({ params }: { params: { id: string } }) {
  const [monitor, setMonitor] = React.useState<Monitor | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [elkCode, setElkCode] = React.useState(elkPlaceholderScript);
  const [sqlCode, setSqlCode] = React.useState(sqlPlaceholderScript);

  React.useEffect(() => {
    getMonitorById(params.id).then(m => {
      setMonitor(m);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!monitor) {
    notFound();
  }
  
  const getSqlSourceDefaultValue = () => {
    if (monitor.type === 'SQL') {
        if (monitor.dbType === 'Oracle') return monitor.name.includes('Primary') ? 'oracle-primary' : 'oracle-replica'
        if (monitor.dbType === 'MySQL') return monitor.name.includes('Primary') ? 'mysql-primary' : 'mysql-replica'
        if (monitor.dbType === 'PostgreSQL') return monitor.name.includes('Primary') ? 'postgres-primary' : 'postgres-replica'
    }
    return ''
  }
  
  const backLink = monitor.type === 'SQL' ? '/monitors/sql' : '/monitors/elasticsearch';

  return (
    <>
      <PageHeader
        title={`Edit ${monitor.name}`}
        description={`Update the configuration for your ${monitor.type} monitor.`}
      />
      
      {monitor.type === 'Elasticsearch' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="elasticsearch-name-edit">Rule Name</Label>
            <Input id="elasticsearch-name-edit" defaultValue={monitor.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="elasticsearch-source-edit">Elasticsearch Source</Label>
            <Select defaultValue="prod-logs">
                <SelectTrigger id="elasticsearch-source-edit">
                    <SelectValue placeholder="Select an Elasticsearch source" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="prod-logs">Production Logs</SelectItem>
                    <SelectItem value="staging-logs">Staging Logs</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="elasticsearch-keywords-edit">Keywords</Label>
            <Input id="elasticsearch-keywords-edit" defaultValue={monitor.type === 'Elasticsearch' ? monitor.keywords.join(', ') : ''} />
             <p className="text-sm text-muted-foreground">
              Trigger an alert if any of these keywords are found.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="elasticsearch-custom-script-edit">Custom Notification Script (Optional)</Label>
             <CustomScriptEditor
              value={elkCode}
              onValueChange={setElkCode}
            />
             <p className="text-sm text-muted-foreground">
              A JS script that returns true to send a notification or false to suppress it.
            </p>
          </div>
          <div className="flex justify-end gap-2">
               <Button variant="outline" asChild>
                  <Link href={backLink}>Cancel</Link>
              </Button>
              <Button>Save Changes</Button>
          </div>
        </div>
      )}

      {monitor.type === 'SQL' && (
         <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="sql-name-edit">Rule Name</Label>
            <Input id="sql-name-edit" defaultValue={monitor.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sql-source-edit">SQL Source</Label>
            <Select defaultValue={getSqlSourceDefaultValue()}>
                <SelectTrigger id="sql-source-edit">
                    <SelectValue placeholder="Select a SQL source" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="oracle-primary">Oracle - Primary DB</SelectItem>
                    <SelectItem value="oracle-replica">Oracle - Read Replica</SelectItem>
                    <SelectItem value="mysql-primary">MySQL - Primary DB</SelectItem>
                    <SelectItem value="mysql-replica">MySQL - Read Replica</SelectItem>
                    <SelectItem value="postgres-primary">PostgreSQL - Primary DB</SelectItem>
                    <SelectItem value="postgres-replica">PostgreSQL - Read Replica</SelectItem>
                </SelectContent>
            </Select>
          </div>
           <div className="space-y-2">
            <Label htmlFor="sql-schedule-edit">Schedule (Cron)</Label>
            <Input id="sql-schedule-edit" defaultValue={monitor.type === 'SQL' ? monitor.schedule : ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sql-query-edit">SQL Query</Label>
            <Textarea id="sql-query-edit" defaultValue={monitor.type === 'SQL' ? monitor.query : ''} className="font-code" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="sql-condition-edit">Alert Condition</Label>
            <Input id="sql-condition-edit" placeholder="e.g., result > 100" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sql-custom-script-edit">Custom Notification Script (Optional)</Label>
            <CustomScriptEditor
              value={sqlCode}
              onValueChange={setSqlCode}
            />
            <p className="text-sm text-muted-foreground">
              A JS script that returns true to send a notification or false to suppress it.
            </p>
          </div>
          <div className="flex justify-end gap-2">
               <Button variant="outline" asChild>
                  <Link href={backLink}>Cancel</Link>
              </Button>
              <Button>Save Changes</Button>
          </div>
        </div>
      )}
    </>
  )
}
