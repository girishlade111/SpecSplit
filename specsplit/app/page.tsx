"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { ApiKeysPanel } from "@/components/settings/ApiKeysPanel";
import { ModelSelector } from "@/components/settings/ModelSelector";
import { SpecInput } from "@/components/analyzer/SpecInput";
import { ResultView } from "@/components/analyzer/ResultView";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Project, AnalysisResult } from "@/types";

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [specText, setSpecText] = useState("");
  const [selectedConfig, setSelectedConfig] = useState<{
    providerId: string;
    modelId: string;
    apiKey: string;
  } | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  useEffect(() => {
    const handleOpenSettings = () => setSettingsOpen(true);
    window.addEventListener("open-settings", handleOpenSettings);
    return () => window.removeEventListener("open-settings", handleOpenSettings);
  }, []);

  const handleAnalyze = async (specTextToAnalyze: string) => {
    if (!selectedConfig) {
      toast.error("Please select a provider and model first");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specText: specTextToAnalyze,
          providerId: selectedConfig.providerId,
          modelId: selectedConfig.modelId,
          apiKey: selectedConfig.apiKey,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || `Analysis failed: ${response.status}`);
        setIsLoading(false);
        return;
      }

      const { result: analysisResult } = await response.json();

      const existingData = typeof window !== "undefined" 
        ? JSON.parse(localStorage.getItem("specsplit_projects") || "[]") 
        : [];
      
      const title = specTextToAnalyze.slice(0, 60) || "Untitled Analysis";
      
      const newProject: Project = {
        id: Date.now().toString(),
        title,
        specText: specTextToAnalyze,
        result: analysisResult,
        providerId: selectedConfig.providerId,
        modelId: selectedConfig.modelId,
        createdAt: new Date().toISOString(),
      };

      const updatedProjects = [newProject, ...existingData].slice(0, 20);
      localStorage.setItem("specsplit_projects", JSON.stringify(updatedProjects));

      setResult(analysisResult);
      setCurrentProject(newProject);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Analysis failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProject = (project: Project) => {
    setSpecText(project.specText);
    setResult(project.result);
    setCurrentProject(project);
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setSpecText("");
    setCurrentProject(null);
    setSelectedConfig(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSettingsClick={() => setSettingsOpen(true)} />
      <div className="flex" style={{ paddingTop: "60px" }}>
        <Sidebar 
          onSelectProject={handleSelectProject}
          onNewAnalysis={handleNewAnalysis}
          currentProjectId={currentProject?.id}
        />
        
        <main className="flex-1 ml-[260px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-60px)]">
            {/* LEFT PANEL */}
            <div className="p-6 border-r flex flex-col gap-6">
              <ModelSelector onSelect={setSelectedConfig} disabled={isLoading} />
              <Separator />
              <SpecInput onAnalyze={handleAnalyze} isLoading={isLoading} disabled={!selectedConfig} />
            </div>
            
            {/* RIGHT PANEL */}
            <div className="p-6">
              {isLoading && <LoadingSpinner />}
              {!isLoading && !result && <EmptyState />}
              {!isLoading && result && (
                <ResultView
                  result={result}
                  specText={specText}
                  providerId={selectedConfig?.providerId ?? ""}
                  modelId={selectedConfig?.modelId ?? ""}
                  onReset={handleNewAnalysis}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <ApiKeysPanel />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}