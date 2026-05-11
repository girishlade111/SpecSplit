"use client";

import { useState } from "react";
import { Key, ExternalLink, Check, Trash2, Eye, EyeOff, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PROVIDER_LIST } from "@/lib/providers";
import { useApiKeys } from "@/hooks/useApiKeys";

export function ApiKeysPanel() {
  const { keys, saveKey, removeKey, hasKey, clearAll } = useApiKeys();
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [savedStates, setSavedStates] = useState<Record<string, boolean>>({});

  const handleSave = (providerId: string) => {
    const value = inputValues[providerId]?.trim();
    if (value) {
      saveKey(providerId, value);
      setInputValues((prev) => ({ ...prev, [providerId]: "" }));
      setSavedStates((prev) => ({ ...prev, [providerId]: true }));
      setTimeout(() => {
        setSavedStates((prev) => ({ ...prev, [providerId]: false }));
      }, 2000);
    }
  };

  const handleRemove = (providerId: string) => {
    removeKey(providerId);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to remove all API keys? This cannot be undone.")) {
      clearAll();
    }
  };

  const toggleShowKey = (providerId: string) => {
    setShowKeys((prev) => ({ ...prev, [providerId]: !prev[providerId] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Key className="size-5" />
          <h2 className="text-xl font-semibold">API Keys</h2>
          <Shield className="size-4 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          Keys are stored locally in your browser. Never sent to our servers.
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-900 dark:text-blue-100">
        SpecSplit uses YOUR API keys. We never store or log them. Keys live only in your browser&apos;s localStorage.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROVIDER_LIST.map((provider) => {
          const isConnected = hasKey(provider.id);
          const showKey = showKeys[provider.id] || false;
          const justSaved = savedStates[provider.id] || false;
          const inputValue = inputValues[provider.id] || "";

          return (
            <Card key={provider.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{provider.logo}</span>
                    <CardTitle className="text-base">{provider.name}</CardTitle>
                    {provider.freeModelsAvailable && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Free tier
                      </Badge>
                    )}
                  </div>
                  {isConnected && (
                    <Badge className="bg-green-500 text-white">Connected</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Input
                    type={showKey ? "text" : "password"}
                    placeholder={provider.apiKeyPlaceholder}
                    value={inputValue}
                    onChange={(e) =>
                      setInputValues((prev) => ({ ...prev, [provider.id]: e.target.value }))
                    }
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey(provider.id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                <a
                  href={provider.docsURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Get API key <ExternalLink className="size-3" />
                </a>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSave(provider.id)}
                    disabled={!inputValue.trim() || justSaved}
                  >
                    {justSaved ? <Check className="size-4" /> : "Save Key"}
                  </Button>
                  {isConnected && (
                    <Button size="sm" variant="destructive" onClick={() => handleRemove(provider.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Label className="text-muted-foreground">Danger Zone</Label>
        <Button variant="outline" size="sm" onClick={handleClearAll} className="text-destructive">
          <Trash2 className="size-4" />
          Clear All Keys
        </Button>
      </div>
    </div>
  );
}