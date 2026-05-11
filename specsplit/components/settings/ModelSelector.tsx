"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Loader2, Zap, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROVIDERS, PROVIDER_LIST } from "@/lib/providers";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useModels } from "@/hooks/useModels";

interface ModelSelectorProps {
  onSelect: (config: {
    providerId: string;
    modelId: string;
    apiKey: string;
  }) => void;
  disabled?: boolean;
}

export function ModelSelector({ onSelect, disabled }: ModelSelectorProps) {
  const { configuredProviders, getKey } = useApiKeys();
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");

  const apiKey = selectedProviderId ? getKey(selectedProviderId) : "";
  const { models, isLoading, error } = useModels(selectedProviderId, apiKey);

  const availableProviders = PROVIDER_LIST.filter(
    (p) => configuredProviders.includes(p.id) && PROVIDERS[p.id]
  );

  const handleOpenSettings = () => {
    window.dispatchEvent(new CustomEvent("open-settings"));
  };

  if (availableProviders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select AI Model</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="size-8 mx-auto mb-2 text-amber-500" />
            <p>No API keys configured</p>
            <p className="text-sm">Add your API key in settings to get started</p>
          </div>
          <Button onClick={handleOpenSettings}>Go to Settings</Button>
        </CardContent>
      </Card>
    );
  }

  const handleProviderChange = (value: string) => {
    setSelectedProviderId(value);
    setSelectedModelId("");
  };

  const handleRunAnalysis = () => {
    if (selectedProviderId && selectedModelId && apiKey) {
      onSelect({
        providerId: selectedProviderId,
        modelId: selectedModelId,
        apiKey,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select AI Model</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Provider</Label>
          <Select
            value={selectedProviderId}
            onValueChange={handleProviderChange}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a provider" />
            </SelectTrigger>
            <SelectContent>
              {availableProviders.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  <div className="flex items-center gap-2">
                    <span>{provider.logo}</span>
                    <span>{provider.name}</span>
                    {provider.freeModelsAvailable && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        Free
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Model</Label>
          <Select
            value={selectedModelId}
            onValueChange={setSelectedModelId}
            disabled={disabled || !selectedProviderId}
          >
            <SelectTrigger>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span>Loading models...</span>
                </div>
              ) : (
                <SelectValue placeholder="Select a model" />
              )}
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    <span>{model.label}</span>
                    {(model.id.toLowerCase().includes("free") || model.isFree) && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        Free
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4" />
            <span>{error}</span>
          </div>
        )}

        <Button
          className="w-full gap-2"
          onClick={handleRunAnalysis}
          disabled={disabled || !selectedProviderId || !selectedModelId}
        >
          <Zap className="size-4" />
          Run Analysis
        </Button>
      </CardContent>
    </Card>
  );
}