"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md glass-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-destructive/10 p-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <CardTitle>Une erreur est survenue</CardTitle>
              <CardDescription className="mt-1">
                Une erreur inattendue s&apos;est produite
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === "development" && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs font-mono text-destructive">
                {error.message}
              </p>
              {error.digest && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={reset} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Tableau de bord
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
