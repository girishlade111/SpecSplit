"use client";

import { useState, useCallback } from "react";
import { Download, FileText, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { AnalysisResult } from "@/types";

interface ExportPanelProps {
  result: AnalysisResult;
  specText: string;
  projectTitle?: string;
}

export function ExportPanel({ result, specText, projectTitle }: ExportPanelProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const exportMarkdown = useCallback(() => {
    const lines = [
      `# ${projectTitle || "Project Analysis"}`,
      "",
      "## Summary",
      `- **Total Hours:** ${result.totalHours}`,
      `- **Weeks:** ${result.weeks.length}`,
      `- **Tasks:** ${result.weeks.reduce((sum, w) => sum + w.tasks.length, 0)}`,
      "",
      "## Stack Hints",
      ...result.stackHints.map((h) => `- ${h}`),
      "",
      "## Ambiguities (Need Client Clarification)",
      ...result.ambiguities.map((a) => `- ${a}`),
      "",
    ];

    for (const week of result.weeks) {
      const weekHours = week.tasks.reduce((sum, t) => sum + t.hours, 0);
      lines.push(`## Week ${week.week} (${weekHours}h)`);
      lines.push("");
      for (const task of week.tasks) {
        lines.push(`### ${task.title}`);
        lines.push(`- **Hours:** ${task.hours}`);
        lines.push(`- **Category:** ${task.category}`);
        if (task.risk) lines.push(`- **Risk:** ${task.risk}`);
        if (task.dependsOn.length > 0) lines.push(`- **Depends on:** ${task.dependsOn.join(", ")}`);
        lines.push("");
      }
    }

    return lines.join("\n");
  }, [result, projectTitle]);

  const exportJSON = useCallback(() => {
    return JSON.stringify({ specText, result }, null, 2);
  }, [result, specText]);

  const exportCSV = useCallback(() => {
    const rows = ["Week,Task,Hours,Category,Risk,Depends On"];
    for (const week of result.weeks) {
      for (const task of week.tasks) {
        const risk = task.risk ? `"${task.risk.replace(/"/g, '""')}"` : "";
        const deps = task.dependsOn.length > 0 ? `"${task.dependsOn.join("; ")}"` : "";
        rows.push(`${week.week},"${task.title.replace(/"/g, '""')}",${task.hours},${task.category},${risk},${deps}`);
      }
    }
    return rows.join("\n");
  }, [result]);

  const downloadFile = useCallback((content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const copyToClipboard = useCallback((content: string, format: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="size-5" />
          Export Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline">{result.totalHours}h total</Badge>
          <Badge variant="outline">{result.weeks.length} weeks</Badge>
          <Badge variant="outline">
            {result.weeks.reduce((sum, w) => sum + w.tasks.length, 0)} tasks
          </Badge>
        </div>

        <Separator />

        <div className="space-y-3">
          <p className="text-sm font-medium">Download as:</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadFile(exportMarkdown(), `${projectTitle || "analysis"}.md`, "text/markdown")}
            >
              <FileText className="size-4 mr-2" />
              Markdown
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadFile(exportJSON(), `${projectTitle || "analysis"}.json`, "application/json")}
            >
              <FileText className="size-4 mr-2" />
              JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadFile(exportCSV(), `${projectTitle || "analysis"}.csv`, "text/csv")}
            >
              <FileText className="size-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <p className="text-sm font-medium">Copy to clipboard:</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(exportMarkdown(), "markdown")}
            >
              {copiedFormat === "markdown" ? (
                <Check className="size-4 mr-2 text-green-500" />
              ) : (
                <Copy className="size-4 mr-2" />
              )}
              Markdown
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(exportJSON(), "json")}
            >
              {copiedFormat === "json" ? (
                <Check className="size-4 mr-2 text-green-500" />
              ) : (
                <Copy className="size-4 mr-2" />
              )}
              JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(exportCSV(), "csv")}
            >
              {copiedFormat === "csv" ? (
                <Check className="size-4 mr-2 text-green-500" />
              ) : (
                <Copy className="size-4 mr-2" />
              )}
              CSV
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}