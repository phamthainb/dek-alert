"use client";

import React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomScriptEditor } from '@/components/custom-script-editor';
import { executeTestScript } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
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
 * @returns {Promise<boolean>} - Return true to trigger an alert, false otherwise.
 */
async function runCheck() {
  console.log("Starting custom script check...");

  // Example: Query a database
  // const result = db.prepare('SELECT COUNT(*) as count FROM users WHERE last_login < ?').get(someDate);
  // console.log('DB result:', result);
  // if (result.count > 100) {
  //   return true; // Trigger alert
  // }
  
  // Example: Query Elasticsearch
  // const esResult = await elasticsearch.search({ index: 'logs-*' });
  // console.log('Elasticsearch hits:', esResult.hits.total.value);
  // if (esResult.hits.total.value > 0) {
  //   return true; // Trigger alert
  // }

  console.log("Script finished. No alert triggered.");
  return false;
}`;

export default function CustomScriptsPage() {
  const [code, setCode] = React.useState(placeholderScript);
  const [isTesting, setIsTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{ triggered: boolean; error?: string; logs: string[] } | null>(null);
  const { toast } = useToast();

  const handleRunTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await executeTestScript(code);
      setTestResult(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Test Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
      setTestResult({
        triggered: false,
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
        title="Custom Scripts"
        description="Write custom JavaScript to query data sources and trigger alerts."
      />
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="script-name">Script Name</Label>
          <Input id="script-name" placeholder="e.g., Nightly Data Integrity Check" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="script-schedule">Schedule (Cron)</Label>
          <Input id="script-schedule" placeholder="0 2 * * *" defaultValue="0 2 * * *" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="custom-script-editor">Script Code</Label>
          <CustomScriptEditor
            value={code}
            onValueChange={setCode}
            placeholder="Enter your custom script here..."
          />
           <p className="text-sm text-muted-foreground">
            Define an `async function runCheck()` that returns a promise resolving to a boolean.
          </p>
        </div>
        <div className="flex justify-end gap-2">
           <Button variant="outline" onClick={handleRunTest} disabled={isTesting}>
            {isTesting ? 'Running...' : 'Run Test'}
          </Button>
          <Button>Save and Activate Script</Button>
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
                    <p>The script completed successfully. Alert triggered: <span className="font-bold">{`${testResult?.triggered}`}</span></p>
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
  );
}
