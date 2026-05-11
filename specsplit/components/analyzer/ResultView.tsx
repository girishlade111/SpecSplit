"use client";

import { useState } from "react";
import { Clock, Calendar, AlertCircle, Code2, CheckCircle2, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/types";
import { WeekGroup } from "./WeekGroup";
import { ExportPanel } from "./ExportPanel";
import { PROVIDERS } from "@/lib/providers";

interface ResultViewProps {
  result: AnalysisResult;
  specText: string;
  providerId: string;
  modelId: string;
  onReset: () => void;
}

export function ResultView({ result, specText, providerId, modelId, onReset }: ResultViewProps) {
  const ambiguities = result.ambiguities ?? [];
  const stackHints = result.stackHints ?? [];
  const totalTasks = result.weeks.reduce((sum, w) => sum + w.tasks.length, 0);
  const risksCount = result.weeks.reduce(
    (sum, w) => sum + w.tasks.filter((t) => t.risk !== null).length,
    0
  );
  const providerName = PROVIDERS[providerId]?.name || providerId;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-100">
                <Clock className="size-5 text-violet-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{result.totalHours}h</div>
                <div className="text-xs text-muted-foreground">Total Hours</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Layers className="size-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalTasks}</div>
                <div className="text-xs text-muted-foreground">Total Tasks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Calendar className="size-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{result.weeks.length}</div>
                <div className="text-xs text-muted-foreground">Weeks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <AlertCircle className="size-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{risksCount}</div>
                <div className="text-xs text-muted-foreground">Risks Found</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="weekly">
            <TabsList className="w-full">
              <TabsTrigger value="weekly" className="flex-1">Weekly Plan</TabsTrigger>
              <TabsTrigger value="ambiguities" className="flex-1">Ambiguities</TabsTrigger>
              <TabsTrigger value="stack" className="flex-1">Stack Detected</TabsTrigger>
            </TabsList>

            <TabsContent value="weekly" className="mt-4 space-y-4">
              {result.weeks.map((weekPlan) => (
                <WeekGroup
                  key={weekPlan.week}
                  weekPlan={weekPlan}
                  totalWeeks={result.weeks.length}
                />
              ))}
            </TabsContent>

            <TabsContent value="ambiguities" className="mt-4">
              {ambiguities.length === 0 ? (
                <Card className="border-green-200 bg-green-50/50">
                  <CardContent className="pt-6 flex items-center gap-3">
                    <CheckCircle2 className="size-6 text-green-500" />
                    <div>
                      <div className="font-medium text-green-800">No ambiguities found</div>
                      <div className="text-sm text-green-600">Spec looks clear!</div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {ambiguities.map((ambiguity, i) => (
                    <Card key={i} className="border-amber-200 bg-amber-50/50">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-medium text-amber-700 mb-1">Ask your client:</div>
                            <div className="text-sm">{ambiguity}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="stack" className="mt-4">
              {stackHints.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    No specific tech stack detected in requirements
                  </CardContent>
                </Card>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {stackHints.map((hint, i) => (
                    <Badge key={i} variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
                      <Code2 className="size-3 mr-1" />
                      {hint}
                    </Badge>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <ExportPanel result={result} specText={specText} />
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Analyzed with <strong>{modelId}</strong> via <strong>{providerName}</strong>
        </p>
        <Button variant="outline" onClick={onReset}>
          Start New Analysis
        </Button>
      </div>
    </div>
  );
}