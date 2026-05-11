"use client";

import { useState, useEffect, useCallback } from "react";
import type { ProviderModel } from "@/types";

export function useModels(providerId: string, apiKey: string) {
  const [models, setModels] = useState<ProviderModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = useCallback(async () => {
    if (!providerId) return;

    setIsLoading(true);
    setError(null);

    try {
      const url = new URL("/api/models", window.location.origin);
      url.searchParams.set("provider", providerId);

      const response = await fetch(url.toString(), {
        headers: {
          "x-api-key": apiKey,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        let errorData: { error?: string } = {};
        try {
          errorData = JSON.parse(text) as { error?: string };
        } catch {
          // ignore
        }
        throw new Error(errorData.error || `Failed to fetch models: ${response.status}`);
      }

      let data: unknown;
      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid JSON response from models API");
      }
      setModels((data as { models?: ProviderModel[] })?.models || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch models");
      setModels([]);
    } finally {
      setIsLoading(false);
    }
  }, [providerId, apiKey]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return {
    models,
    isLoading,
    error,
    refetch: fetchModels,
  };
}