import { NextResponse } from "next/server";
import { PROVIDERS } from "@/lib/providers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { specText, providerId, modelId, apiKey } = body;

    if (!specText || !providerId || !modelId || !apiKey) {
      return NextResponse.json(
        { error: "Missing required fields: specText, providerId, modelId, apiKey" },
        { status: 400 }
      );
    }

    const provider = PROVIDERS[providerId];
    if (!provider) {
      return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
    }

    const systemPrompt = `You are a senior software project analyst specializing in freelance developer projects.
Analyze the provided requirement document carefully and return ONLY valid JSON with no markdown, no explanation, no preamble.

Return this exact JSON structure:
{
  "weeks": [
    {
      "week": 1,
      "tasks": [
        {
          "id": "unique-id-string",
          "title": "Clear task name",
          "hours": 8,
          "dependsOn": ["Other task title if dependency exists"],
          "risk": "Specific technical risk description or null if none",
          "category": "auth|backend|frontend|database|devops|other"
        }
      ]
    }
  ],
  "ambiguities": ["Vague or unclear requirement that needs client clarification"],
  "totalHours": 40,
  "stackHints": ["Technology or framework detected in the document"]
}

Rules:
- Order tasks by logical dependency (auth before dashboard, database before API)
- hours must be realistic integers (minimum 2, maximum 40 per task)
- dependsOn lists task TITLES that must be done first
- risk must be a specific technical concern, not generic
- category must be exactly one of: auth, backend, frontend, database, devops, other
- ambiguities are requirements too vague to estimate — ask client
- totalHours is sum of all task hours
- Generate unique string IDs for each task`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (providerId === "anthropic") {
      headers["x-api-key"] = apiKey;
      headers["anthropic-version"] = "2023-06-01";
    } else if (providerId !== "ollama") {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    if (provider.extraHeaders) {
      const extra = provider.extraHeaders(apiKey);
      Object.assign(headers, extra);
    }

    let endpoint: string;
    let requestBody: Record<string, unknown>;

    if (providerId === "anthropic") {
      endpoint = provider.baseURL + "/messages";
      requestBody = {
        model: modelId,
        max_tokens: 3000,
        temperature: 0.2,
        system: systemPrompt,
        messages: [{ role: "user", content: "Requirement Document:\n\n" + specText }],
      };
    } else {
      endpoint = provider.baseURL + "/chat/completions";
      requestBody = {
        model: modelId,
        max_tokens: 3000,
        temperature: 0.2,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Requirement Document:\n\n" + specText },
        ],
      };
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API request failed: ${response.status} - ${errorText}` },
        { status: 500 }
      );
    }

    let data: Record<string, unknown> = {};
    try {
      data = await response.json() as Record<string, unknown>;
    } catch {
      const text = await response.text();
      return NextResponse.json(
        { error: `Invalid JSON response from AI: ${text.slice(0, 200)}` },
        { status: 500 }
      );
    }

    let rawText = "";
    if (providerId === "anthropic") {
      const content = data.content as Array<{ text?: string }> | undefined;
      rawText = content?.[0]?.text || "";
    } else {
      const choices = data.choices as Array<{ message?: { content?: string } }> | undefined;
      rawText = choices?.[0]?.message?.content || "";
    }

    const cleaned = rawText.replace(/```json\s*/g, "").replace(/```/g, "").trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response", raw: rawText },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: parsed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}