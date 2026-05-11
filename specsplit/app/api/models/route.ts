import { NextResponse } from "next/server";
import { PROVIDERS } from "@/lib/providers";
import type { ProviderModel } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get("provider");
    const apiKey = request.headers.get("x-api-key") || "";

    if (!providerId) {
      return NextResponse.json({ models: [], error: "Missing provider" });
    }

    const provider = PROVIDERS[providerId];
    if (!provider) {
      return NextResponse.json({ models: [], error: "Unknown provider" });
    }

    if (provider.modelFetchStrategy === "hardcoded" && provider.hardcodedModels) {
      return NextResponse.json({ models: provider.hardcodedModels });
    }

    if (!provider.modelsEndpoint) {
      return NextResponse.json({ models: [] });
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (apiKey && providerId !== "ollama") {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const response = await fetch(provider.modelsEndpoint, { headers });
    let data: Record<string, unknown> = {};
    try {
      data = await response.json() as Record<string, unknown>;
    } catch {
      return NextResponse.json({ models: [], error: "Invalid JSON response from provider API" });
    }

    let models: ProviderModel[] = [];

    if (provider.modelFetchStrategy === "google") {
      const googleModels = (data.models as Array<{ name: string }>) || [];
      models = googleModels
        .filter((m) => m.name.includes("gemini"))
        .map((m) => ({
          id: m.name.replace("models/", ""),
          label: m.name.replace("models/", "").replace(/-/g, " ").replace(/\//g, " - "),
        }));
    } else if (provider.modelFetchStrategy === "openai-compat") {
      const openaiData = (data.data as Array<{ id: string }>) || [];
      models = openaiData.map((m) => ({
        id: m.id,
        label: m.id,
      }));
    }

    return NextResponse.json({ models });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ models: [], error: message });
  }
}