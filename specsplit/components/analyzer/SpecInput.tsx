"use client";

import { useState, useMemo } from "react";
import { FileText, Upload, Sparkles, X, Info, ClipboardPaste, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface SpecInputProps {
  onAnalyze: (specText: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const SAMPLE_DOC = `Build a freelance project management web application where clients can create projects, assign tasks to freelancers, and track progress through a visual Kanban board.

Users should be able to register with email/password or Google OAuth. There's also an admin panel for managing users and subscription plans. The system needs to send email notifications when tasks are updated or deadlines approach.

Technical requirements: React 18 frontend with TypeScript, Node.js Express backend, PostgreSQL database. Include a RESTful API for all CRUD operations and WebSocket connections for real-time updates. Host on AWS with CI/CD via GitHub Actions. Include comprehensive test coverage with Jest and Cypress for E2E testing.

Budget: $5,000-8,000. Timeline: 8-10 weeks. Need responsive mobile support and should be accessible (WCAG 2.1 AA).`;

export function SpecInput({ onAnalyze, isLoading, disabled }: SpecInputProps) {
  const [specText, setSpecText] = useState("");

  const charCount = specText.length;
  const wordCount = useMemo(() => {
    return specText.trim() ? specText.trim().split(/\s+/).length : 0;
  }, [specText]);

  const handleClear = () => {
    setSpecText("");
  };

  const handleLoadSample = () => {
    setSpecText(SAMPLE_DOC);
  };

  const handleAnalyze = () => {
    if (specText.trim().length >= 50) {
      onAnalyze(specText.trim());
    }
  };

  const showMinLengthWarning = specText.length > 0 && specText.length < 50;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="size-5" />
            <CardTitle>Requirement Document</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {charCount} chars
            </Badge>
            <Badge variant="outline" className="text-xs">
              {wordCount} words
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Paste your client spec, user story, or project brief
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={specText}
          onChange={(e) => setSpecText(e.target.value)}
          placeholder={`Paste your client requirement document here...

Example: 'Build a web app with user authentication, a dashboard 
showing analytics, and an admin panel for managing users. 
Use React frontend with Node.js backend and PostgreSQL database.'`}
          className="min-h-[320px] resize-y"
          disabled={disabled || isLoading}
        />

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="size-4" />
          <span>Tips for better results:</span>
          <Badge variant="outline" className="text-xs">Include tech stack</Badge>
          <Badge variant="outline" className="text-xs">Mention integrations</Badge>
          <Badge variant="outline" className="text-xs">Add user roles</Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleLoadSample} disabled={disabled || isLoading}>
              <Upload className="size-4" />
              Load Sample Doc
            </Button>
            {specText && (
              <Button variant="ghost" size="sm" onClick={handleClear} disabled={disabled || isLoading}>
                <X className="size-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        <Button
          className="w-full gap-2"
          size="lg"
          onClick={handleAnalyze}
          disabled={disabled || isLoading || specText.trim().length < 50}
        >
          {isLoading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="size-5" />
              Analyze Requirements
            </>
          )}
        </Button>

        {showMinLengthWarning && (
          <p className="text-xs text-muted-foreground text-center">
            Minimum 50 characters required
          </p>
        )}
      </CardContent>
    </Card>
  );
}