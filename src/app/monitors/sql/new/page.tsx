"use client"

import * as React from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CustomScriptEditor } from "@/components/custom-script-editor";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";

const placeholderScript = `/**
 * @param {any} queryResult - The result of the SQL query.
 * @returns {boolean}- Return true to send notification, false to suppress.
 */
function shouldNotify(queryResult) {
  // Example: Only notify during business hours
  const hour = new Date().getHours();
  if (hour < 9 || hour > 17) {
    return false;
  }
  return true;
}`;

export default function CreateSqlMonitorPage() {
  const [code, setCode] = React.useState(placeholderScript);

  return (
    <>
        <PageHeader
            title="New SQL Monitor"
            description="Create an alert that triggers based on the result of a SQL query."
        />
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="sql-name">Rule Name</Label>
                <Input id="sql-name" placeholder="e.g., Unprocessed Orders Check" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="sql-source">SQL Source</Label>
                <Select>
                    <SelectTrigger id="sql-source">
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
                <Label htmlFor="sql-schedule">Schedule (Cron)</Label>
                <Input id="sql-schedule" placeholder="*/15 * * * *" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="sql-query">SQL Query</Label>
                <Textarea id="sql-query" placeholder="SELECT COUNT(*) FROM orders WHERE status = 'pending';" className="font-code" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="sql-condition">Alert Condition</Label>
                <Input id="sql-condition" placeholder="e.g., result > 100" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="sql-custom-script">Custom Notification Script (Optional)</Label>
                <CustomScriptEditor
                    value={code}
                    onValueChange={setCode}
                />
                <p className="text-sm text-muted-foreground">
                A JS script that returns true to send a notification or false to suppress it.
                </p>
            </div>
            <div className="flex justify-end gap-2">
                 <Button variant="outline" asChild>
                    <Link href="/monitors/sql">Cancel</Link>
                </Button>
                <Button>Create Monitor</Button>
            </div>
        </div>
    </>
  )
}
