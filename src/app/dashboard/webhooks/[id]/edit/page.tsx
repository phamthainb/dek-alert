"use client"

import * as React from "react";
import { notFound } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CustomScriptEditor } from "@/components/custom-script-editor";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import type { Webhook } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { executeWebhookTestScript } from "@/lib/actions";
import { getWebhookById } from '@/lib/data-actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const placeholderScript = `/**
 * This function is called when an alert is triggered.
 *
 * @param {object} alertData - The data associated with the alert.
 * @param {string} alertData.monitorName - The name of the monitor that triggered the alert.
 * @param {string} alertData.message - The alert message.
 * @param {string} alertData.timestamp - The ISO timestamp of the alert.
 */
function sendNotification(alertData) {
  // Example: Post to a custom API endpoint
  // fetch('https://api.example.com/notify', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ 
  //     text: \`[ALERT] \${alertData.monitorName}: \${alertData.message}\` 
  //   })
  // });
  console.log('Custom notification sent:', alertData);
}`;

export default function EditWebhookPage({ params }: { params: { id: string } }) {
  const [webhook, setWebhook] = React.useState<Webhook | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [platform, setPlatform] = React.useState('generic');
  const [code, setCode] = React.useState(placeholderScript);
  const [isTesting, setIsTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{ success: boolean; error?: string; logs: string[] } | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    getWebhookById(params.id).then(w => {
      setWebhook(w);
      if (w) {
        setPlatform(w.platform.toLowerCase());
      }
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!webhook) {
    notFound();
  }

  const handleRunTest = async () => {
    if (platform !== 'custom') return;
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await executeWebhookTestScript(code);
      setTestResult(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Test Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred.',
        logs: []
      });
    } finally {
      setIsTesting(false);
    }
  };


  return (
    <>
      <PageHeader
        title={`Edit ${webhook.name}`}
        description="Update the configuration for this webhook."
      />
      <div className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            defaultValue={webhook.name}
            placeholder="e.g., On-call Pager"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Select onValueChange={setPlatform} defaultValue={platform}>
            <SelectTrigger>
              <SelectValue placeholder="Select a platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slack">Slack</SelectItem>
              <SelectItem value="discord">Discord</SelectItem>
              <SelectItem value="generic">Generic</SelectItem>
              <SelectItem value="custom">Custom Script</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {platform === "custom" ? (
           <div className="space-y-2">
            <Label htmlFor="custom-script-editor">Custom Notification Script</Label>
            <CustomScriptEditor
              value={code}
              onValueChange={setCode}
              placeholder="Enter your custom script here..."
            />
            <p className="text-sm text-muted-foreground">
              Define a `function sendNotification(alertData)` to handle the notification logic. The `URL` field will be ignored.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              defaultValue={webhook.url}
              placeholder="https://hooks.example.com/..."
            />
          </div>
        )}
        <div className="flex justify-end gap-2">
          {platform === 'custom' && (
            <Button variant="outline" onClick={handleRunTest} disabled={isTesting}>
              {isTesting ? 'Running...' : 'Run Test'}
            </Button>
          )}
          <Button variant="outline" asChild>
              <Link href="/webhooks">Cancel</Link>
          </Button>
          <Button>Save Changes</Button>
        </div>
      </div>
      <AlertDialog open={testResult !== null} onOpenChange={() => setTestResult(null)}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Test Run Result</AlertDialogTitle>
            <AlertDialogDescription asChild>
                <div className="space-y-4 pt-2 text-sm">
                {testResult?.error ? (
                    <p className="text-destructive">The script failed with an error: {testResult.error}</p>
                ) : (
                    <p>The script completed successfully. See logs for details.</p>
                )}
                
                {testResult && testResult.logs.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-medium text-foreground">Logs:</h4>
                        <pre className="text-xs bg-muted p-3 rounded-md max-h-60 overflow-auto font-mono text-muted-foreground">
                            {testResult.logs.join('\n')}
                        </pre>
                    </div>
                )}
                 {testResult && testResult.logs.length === 0 && !testResult.error && (
                    <p className="text-muted-foreground">No logs were captured during execution.</p>
                )}
                </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setTestResult(null)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
