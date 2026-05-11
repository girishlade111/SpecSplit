"use client";

import { Clock, AlertTriangle, GitBranch, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AnalysisTask } from "@/types";
import { getCategoryColor } from "@/lib/providers";

interface TaskCardProps {
  task: AnalysisTask;
  index: number;
}

export function TaskCard({ task, index }: TaskCardProps) {
  const categoryColor = getCategoryColor(task.category);

  return (
    <Card className="border-border/50 hover:shadow-md transition-shadow animate-in fade-in">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs text-muted-foreground">
              {index + 1}
            </span>
            <span className="font-medium">{task.title}</span>
          </div>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="size-3 mr-1" />
            {task.hours}h
          </Badge>
        </div>

        {task.dependsOn && task.dependsOn.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GitBranch className="size-3" />
            <span>Depends on:</span>
            <div className="flex flex-wrap gap-1">
              {task.dependsOn.map((dep, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {dep}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Badge className={`${categoryColor} text-white`}>
            <Tag className="size-3 mr-1" />
            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
          </Badge>

          {task.risk && (
            <div className="flex items-center gap-1 text-xs text-orange-600 truncate max-w-[200px]" title={task.risk}>
              <AlertTriangle className="size-3 shrink-0" />
              <span className="truncate">{task.risk}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}