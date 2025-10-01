"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="font-body antialiased">
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
          <div className="max-w-md w-full mx-auto space-y-6">
            <Card className="border-muted">
              <CardHeader className="space-y-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle className="text-3xl font-bold text-center">500: Critical Error</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <p className="text-muted-foreground">
                  A critical error occurred while rendering the application.
                </p>
                <Button 
                  onClick={reset}
                  variant="default"
                  className="w-full gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Try Again</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </body>
    </html>
  );
}
