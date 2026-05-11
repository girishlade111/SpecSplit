"use client";

import { AlertCircle, Sparkles, BarChart3, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { AnalysisResult } from "@/types";
import { WeekGroup } from "./WeekGroup";
import { ExportPanel } from "./ExportPanel";

interface ResultViewProps {
  result: AnalysisResult;
  specText: string;
  projectTitle?: string;
}

export function ResultView({ result, specText, projectTitle }: ResultViewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-violet-500" />
            Analysis Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-violet-600">{result.totalHours}h</div>
              <div className="text-sm text-muted-foreground">Total Hours</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-violet-600">{result.weeks.length}</div>
              <div className="text-sm text-muted-foreground">Weeks</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-violet-600">
                {result.weeks.reduce((sum, w) => sum + w.tasks.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Tasks</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-violet-600">{result.ambiguities.length}</div>
              <div className="text-sm text-muted-foreground">Ambiguities</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {result.stackHints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="size-4" />
              Detected Technologies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.stackHints.map((hint, i) => (
                <Badge key={i} variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
                  {hint}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {result.ambiguities.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-amber-800">
              <AlertCircle className="size-4" />
              Ambiguities to Clarify
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.ambiguities.map((ambiguity, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{ambiguity}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="size-5" />
          Weekly Breakdown
        </h2>
        <div className="space-y-4">
          {result.weeks.map((weekPlan) => (
            <WeekGroup
              key={weekPlan.week}
              weekPlan={weekPlan}
              totalWeeks={result.weeks.length}
            />
          ))}
        </div>
      </div>

      <Separator />

      <ExportPanel result={result} specText={specText} projectTitle={projectTitle} />
    </div>
  );
}