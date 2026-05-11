export type ModelFetchStrategy = "openai-compat" | "google" | "hardcoded";

export interface ProviderModel {
  id: string;
  label: string;
  contextLength?: number;
  isFree?: boolean;
}

export interface Provider {
  id: string;
  name: string;
  logo: string;
  baseURL: string;
  modelsEndpoint: string | null;
  modelFetchStrategy: ModelFetchStrategy;
  hardcodedModels?: ProviderModel[];
  apiKeyPlaceholder: string;
  apiKeyPrefix?: string;
  docsURL: string;
  freeModelsAvailable: boolean;
  supportsSystemPrompt: boolean;
  extraHeaders?: (apiKey: string) => Record<string, string>;
}

export type TaskCategory = "auth" | "backend" | "frontend" | "database" | "devops" | "other";

export interface AnalysisTask {
  id: string;
  title: string;
  hours: number;
  dependsOn: string[];
  risk: string | null;
  category: TaskCategory;
}

export interface WeekPlan {
  week: number;
  tasks: AnalysisTask[];
}

export interface AnalysisResult {
  weeks: WeekPlan[];
  ambiguities: string[];
  totalHours: number;
  stackHints: string[];
}

export interface Project {
  id: string;
  title: string;
  specText: string;
  result: AnalysisResult;
  providerId: string;
  modelId: string;
  createdAt: string;
}

export type ApiKeyStore = Record<string, string>;

export type AppTheme = "light" | "dark" | "system";

export interface AppSettings {
  theme: AppTheme;
  defaultProviderId: string | null;
  defaultModelId: string | null;
}

export interface ModelSelectorState {
  selectedProviderId: string;
  selectedModelId: string;
  apiKey: string;
}