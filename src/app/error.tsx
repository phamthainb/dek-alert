"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RotateCw } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="max-w-md w-full mx-auto space-y-6">
        <Card className="border-muted">
          <CardHeader className="space-y-4 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle className="text-3xl font-bold text-center">Oops!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-muted-foreground">
              An unexpected error occurred. Our team has been notified and is working
              to fix it.
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
  );
}
