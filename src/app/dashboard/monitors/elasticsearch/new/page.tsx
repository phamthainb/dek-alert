"use client"

import * as React from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CustomScriptEditor } from "@/components/custom-script-editor";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";

const placeholderScript = `/**
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

export default function CreateElasticsearchMonitorPage() {
  const [code, setCode] = React.useState(placeholderScript);

  return (
    <>
      <PageHeader
        title="New Elasticsearch Monitor"
        description="Create an alert that triggers on specific keywords in your logs."
      />
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="elasticsearch-name">Rule Name</Label>
          <Input id="elasticsearch-name" placeholder="e.g., Production API 5xx Errors" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="elasticsearch-source">Elasticsearch Source</Label>
          <Select>
              <SelectTrigger id="elasticsearch-source">
                  <SelectValue placeholder="Select an Elasticsearch source" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="prod-logs">Production Logs</SelectItem>
                  <SelectItem value="staging-logs">Staging Logs</SelectItem>
              </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="elasticsearch-keywords">Keywords</Label>
          <Input id="elasticsearch-keywords" placeholder="error, exception, 500 (comma-separated)" />
           <p className="text-sm text-muted-foreground">
            Trigger an alert if any of these keywords are found.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="elasticsearch-custom-script">Custom Notification Script (Optional)</Label>
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
              <Link href="/monitors/elasticsearch">Cancel</Link>
          </Button>
          <Button>Create Monitor</Button>
        </div>
      </div>
    </>
  )
}
