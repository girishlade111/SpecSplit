   at <unknown> (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:4104:33)
    at runWithFiberInDEV (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:965:74)
    at warnOnInvalidKey (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:4103:21)
    at reconcileChildrenArray (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:4120:29)
    at reconcileChildFibersImpl (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:4236:51)
    at <unknown> (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:4261:39)
    at reconcileChildren (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:5898:119)
    at beginWork (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:6758:1573)
    at runWithFiberInDEV (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:965:74)
    at performUnitOfWork (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:9555:97)
    at workLoopSync (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:9449:40)
    at renderRootSync (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:9433:13)
    at performWorkOnRoot (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:9061:186)
    at performSyncWorkOnRoot (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:10263:9)
    at flushSyncWorkAcrossRoots_impl (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:10179:316)
    at flushSyncWork$1 (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:9230:86)
    at Object.f (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:16411:79)
    at push.exports.flushSync (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:87:108)
    at useAnimationsFinished.useStableCallback.done (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_%40base-ui_react_esm_0ak24zo._.js:2072:198)
    at useAnimationsFinished.useStableCallback.exec (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_%40base-ui_react_esm_0ak24zo._.js:2085:29) (file://C:/Users/Girish Lade/OneDrive/Desktop/SpecSplit/specsplit/.next/dev/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:4104:33)
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