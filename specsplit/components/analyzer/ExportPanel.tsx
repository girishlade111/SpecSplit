"use client";

import { useState, useCallback } from "react";
import { Download, FileText, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalysisResult } from "@/types";

interface ExportPanelProps {
  result: AnalysisResult;
  specText: string;
  projectTitle?: string;
}

export function ExportPanel({ result, specText, projectTitle }: ExportPanelProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const ambiguities = result.ambiguities ?? [];
  const stackHints = result.stackHints ?? [];

  const exportMarkdown = useCallback(() => {
    const lines = [
      `# ${projectTitle || "Project Analysis"}`,
      "",
      "## Summary",
      `- **Total Hours:** ${result.totalHours}`,
      `- **Weeks:** ${result.weeks.length}`,
      `- **Tasks:** ${result.weeks.reduce((sum, w) => sum + w.tasks.length, 0)}`,
      "",
    ];

    if (result.stackHints.length > 0) {
      lines.push("## Stack Hints");
      lines.push(...result.stackHints.map((h) => `- ${h}`));
      lines.push("");
    }

    if (result.ambiguities.length > 0) {
      lines.push("## Ambiguities (Need Client Clarification)");
      lines.push(...result.ambiguities.map((a) => `- ${a}`));
      lines.push("");
    }

    for (const week of result.weeks) {
      const weekHours = week.tasks.reduce((sum, t) => sum + t.hours, 0);
      lines.push(`## Week ${week.week} (${weekHours}h)`);
      lines.push("");
      for (const task of week.tasks) {
        lines.push(`### 📋 ${task.title}`);
        lines.push(`- **Hours:** ${task.hours}`);
        lines.push(`- **Category:** ${task.category}`);
        if (task.risk) lines.push(`- **Risk:** ⚠️ ${task.risk}`);
        if (task.dependsOn.length > 0) lines.push(`- **Depends on:** 🔗 ${task.dependsOn.join(", ")}`);
        lines.push("");
      }
    }

    return lines.join("\n");
  }, [result, projectTitle]);

  const copyNotion = useCallback(() => {
    const lines = [
      `📊 ${projectTitle || "Project Analysis"}`,
      "",
      "📈 Summary",
      `- Total Hours: ${result.totalHours}`,
      `- Weeks: ${result.weeks.length}`,
      "- " + result.stackHints.map((h) => `🏷️ ${h}`).join(" "),
      "",
    ];

    if (result.ambiguities.length > 0) {
      lines.push("⚠️ Ambiguities (Ask client)");
      lines.push(...result.ambiguities.map((a) => `- ${a}`));
      lines.push("");
    }

    for (const week of result.weeks) {
      const weekHours = week.tasks.reduce((sum, t) => sum + t.hours, 0);
      lines.push(`📅 Week ${week.week} (${weekHours}h)`);
      for (const task of week.tasks) {
        lines.push(`  📋 ${task.title} — ${task.hours}h [${task.category}]`);
        if (task.risk) lines.push(`    ⚠️ Risk: ${task.risk}`);
        if (task.dependsOn.length > 0) lines.push(`    🔗 Depends on: ${task.dependsOn.join(", ")}`);
      }
      lines.push("");
    }

    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopiedFormat("notion");
      setTimeout(() => setCopiedFormat(null), 2000);
    });
  }, [result, projectTitle]);

  const copyLinearCSV = useCallback(() => {
    const header = "Title,Estimate (hours),Category,Depends On,Risk";
    const rows = [header];

    for (const week of result.weeks) {
      for (const task of week.tasks) {
        const title = `"${task.title.replace(/"/g, '""')}"`;
        const estimate = task.hours;
        const category = task.category;
        const dependsOn = task.dependsOn.length > 0 ? `"${task.dependsOn.join("; ")}"` : "";
        const risk = task.risk ? `"${task.risk.replace(/"/g, '""')}"` : "";
        rows.push(`${title},${estimate},${category},${dependsOn},${risk}`);
      }
    }

    navigator.clipboard.writeText(rows.join("\n")).then(() => {
      setCopiedFormat("linear");
      setTimeout(() => setCopiedFormat(null), 2000);
    });
  }, [result]);

  const downloadMarkdown = useCallback(() => {
    const content = exportMarkdown();
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "specsplit-analysis.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportMarkdown]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="size-5" />
          Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={downloadMarkdown}>
            <FileText className="size-4 mr-2" />
            Download Markdown
          </Button>

          <Button variant="outline" className="w-full justify-start" onClick={copyNotion}>
            {copiedFormat === "notion" ? (
              <Check className="size-4 mr-2 text-green-500" />
            ) : (
              <Copy className="size-4 mr-2" />
            )}
            Copy for Notion
          </Button>

          <Button variant="outline" className="w-full justify-start" onClick={copyLinearCSV}>
            {copiedFormat === "linear" ? (
              <Check className="size-4 mr-2 text-green-500" />
            ) : (
              <Copy className="size-4 mr-2" />
            )}
            Copy for Linear (CSV)
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Paste CSV directly into Linear&apos;s import feature
        </p>
      </CardContent>
    </Card>
  );
}