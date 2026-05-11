"use client";

import { useState } from "react";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { WeekPlan } from "@/types";
import { TaskCard } from "./TaskCard";

interface WeekGroupProps {
  weekPlan: WeekPlan;
  totalWeeks: number;
}

export function WeekGroup({ weekPlan, totalWeeks }: WeekGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const totalHours = weekPlan.tasks.reduce((sum, task) => sum + task.hours, 0);
  const showTwoColumns = weekPlan.tasks.length >= 4;

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-violet-50/50 to-transparent hover:from-violet-50 border-b transition-colors"
      >
        <div className="flex items-center gap-3">
          <Calendar className="size-5 text-violet-500" />
          <span className="text-lg font-semibold">Week {weekPlan.week}</span>
          <Badge variant="outline">{weekPlan.tasks.length} tasks</Badge>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            {totalHours}h
          </Badge>
        </div>
        {isExpanded ? (
          <ChevronUp className="size-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-5 text-muted-foreground" />
        )}
      </button>

      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          maxHeight: isExpanded ? `${weekPlan.tasks.length * 200}px` : "0",
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div
          className={`p-4 grid gap-4 ${
            showTwoColumns ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {weekPlan.tasks.map((task, index) => (
            <TaskCard key={task.id || index} task={task} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}