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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleOpenSettings = () => setSettingsOpen(true);
    window.addEventListener("open-settings", handleOpenSettings);
    return () => window.removeEventListener("open-settings", handleOpenSettings);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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

  const handleModelSelect = (config: {
    providerId: string;
    modelId: string;
    apiKey: string;
  }) => {
    setSelectedConfig(config);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSettingsClick={() => setSettingsOpen(true)} />
      
      <div className="flex pt-[--navbar-height]">
        <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
          <Sidebar
            onSelectProject={handleSelectProject}
            onNewAnalysis={handleNewAnalysis}
            currentProjectId={currentProject?.id}
          />
        </div>

        <main className="flex-1 p-6 lg:ml-[--sidebar-width]">
          {isLoading ? (
            <LoadingSpinner
              message="Analyzing your requirements..."
              submessage="This may take 10-30 seconds"
            />
          ) : result ? (
            <ResultView
              result={result}
              specText={specText}
              providerId={selectedConfig?.providerId || ""}
              modelId={selectedConfig?.modelId || ""}
              onReset={handleNewAnalysis}
            />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-6">
                <SpecInput
                  onAnalyze={handleAnalyze}
                  isLoading={isLoading}
                  disabled={!selectedConfig}
                />
                
                <ModelSelector
                  onSelect={handleModelSelect}
                  disabled={isLoading}
                />
              </div>

              <div className="hidden xl:block">
                <EmptyState />
              </div>
            </div>
          )}
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