"use client";

import { FileText, Zap, Shield, Star } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 text-muted-foreground">
      <FileText className="size-12 mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">Ready to analyze your spec</h3>
      <p className="text-sm max-w-md mb-8">
        Paste your client requirement document on the left and select an AI model to get started
      </p>

      <div className="flex items-center gap-8 mb-8">
        <div className="flex flex-col items-center gap-2">
          <Zap className="size-6" />
          <div>
            <div className="text-sm font-medium">Task Breakdown</div>
            <div className="text-xs">Ordered by dependency</div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Shield className="size-6" />
          <div>
            <div className="text-sm font-medium">Risk Detection</div>
            <div className="text-xs">Per-task risk flags</div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Star className="size-6" />
          <div>
            <div className="text-sm font-medium">Time Estimates</div>
            <div className="text-xs">Realistic hour ranges</div>
          </div>
        </div>
      </div>

      <p className="text-xs">Works with OpenAI, Anthropic, Groq, NVIDIA, and more</p>
    </div>
  );
}