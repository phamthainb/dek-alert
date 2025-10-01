"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="max-w-md w-full mx-auto space-y-6">
        <Card className="border-muted">
          <CardHeader className="space-y-4 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <FileQuestion className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-center">404: Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild variant="default" className="w-full gap-2">
              <Link href="/">
                Return Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
