"use client";

import { useState, useEffect } from "react";
import { Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types";
import { PROVIDERS } from "@/lib/providers";

interface SidebarProps {
  onSelectProject: (project: Project) => void;
  onNewAnalysis: () => void;
  currentProjectId?: string;
}

export function Sidebar({ onSelectProject, onNewAnalysis, currentProjectId }: SidebarProps) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("specsplit_projects");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setProjects(parsed.slice(0, 20));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getProviderName = (providerId: string) => {
    return PROVIDERS[providerId]?.name || providerId;
  };

  return (
    <aside className="w-[260px] h-[calc(100vh-60px)] border-r bg-card overflow-y-auto shrink-0">
      <div className="p-3">
        <Button onClick={onNewAnalysis} className="w-full gap-2">
          <Plus className="size-4" />
          New Analysis
        </Button>
      </div>

      <div className="px-3 pb-3">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No past analyses yet</p>
        ) : (
          <ul className="space-y-1">
            {projects.map((project) => (
              <li key={project.id}>
                <button
                  onClick={() => onSelectProject(project)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    currentProjectId === project.id
                      ? "bg-accent"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="truncate font-medium">{project.title}</div>
                  <div className="text-xs text-muted-foreground flex gap-2">
                    <span>{formatDate(project.createdAt)}</span>
                    <span>•</span>
                    <span>{getProviderName(project.providerId)}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="absolute bottom-3 left-0 right-0 px-3 flex items-center gap-1 text-xs text-muted-foreground">
        <Info className="size-3" />
        <span>History stored locally</span>
      </div>
    </aside>
  );
}