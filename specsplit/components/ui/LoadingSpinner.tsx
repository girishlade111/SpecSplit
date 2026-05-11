"use client";

import { Loader2, Sparkles } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  submessage?: string;
}

export function LoadingSpinner({
  message = "Analyzing your requirements...",
  submessage = "This may take 10-30 seconds",
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative">
        <Sparkles className="size-8 text-violet-500 animate-pulse" />
      </div>
      <Loader2 className="size-6 text-muted-foreground animate-spin" />
      <p className="font-medium">{message}</p>
      <p className="text-sm text-muted-foreground">{submessage}</p>
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-muted-foreground rounded-full dot-1" />
        <span className="w-2 h-2 bg-muted-foreground rounded-full dot-2" />
        <span className="w-2 h-2 bg-muted-foreground rounded-full dot-3" />
      </div>
    </div>
  );
}