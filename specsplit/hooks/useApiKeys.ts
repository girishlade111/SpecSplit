"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "specsplit_api_keys";

export function useApiKeys() {
  const [keys, setKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setKeys(parsed);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const saveKey = useCallback((providerId: string, apiKey: string) => {
    setKeys((prev) => {
      const updated = { ...prev, [providerId]: apiKey };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const removeKey = useCallback((providerId: string) => {
    setKeys((prev) => {
      const updated = { ...prev };
      delete updated[providerId];
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const getKey = useCallback(
    (providerId: string): string => {
      return keys[providerId] || "";
    },
    [keys]
  );

  const hasKey = useCallback(
    (providerId: string): boolean => {
      const key = keys[providerId];
      return !!key && key.length > 0;
    },
    [keys]
  );

  const configuredProviders = Object.keys(keys).filter(
    (id) => keys[id] && keys[id].length > 0
  );

  const clearAll = useCallback(() => {
    setKeys({});
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    keys,
    saveKey,
    removeKey,
    getKey,
    hasKey,
    configuredProviders,
    clearAll,
  };
}