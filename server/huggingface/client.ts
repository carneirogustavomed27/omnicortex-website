/**
 * OmniCortex AI Labs - Hugging Face Integration
 * 
 * Este módulo fornece integração completa com a API do Hugging Face
 * para gerenciamento de modelos, datasets e inferência.
 */

import { ENV } from "../_core/env";

const HF_API_BASE = "https://huggingface.co/api";
const HF_INFERENCE_API = "https://api-inference.huggingface.co/models";

interface HFModel {
  id: string;
  modelId: string;
  author: string;
  sha: string;
  lastModified: string;
  private: boolean;
  disabled: boolean;
  gated: boolean | string;
  pipeline_tag?: string;
  tags: string[];
  downloads: number;
  likes: number;
  library_name?: string;
}

interface HFDataset {
  id: string;
  author: string;
  sha: string;
  lastModified: string;
  private: boolean;
  disabled: boolean;
  gated: boolean | string;
  tags: string[];
  downloads: number;
  likes: number;
}

interface HFUserInfo {
  type: string;
  id: string;
  name: string;
  fullname: string;
  email?: string;
  emailVerified?: boolean;
  plan?: string;
  canPay?: boolean;
  isPro?: boolean;
  avatarUrl?: string;
  orgs?: Array<{
    type: string;
    id: string;
    name: string;
    fullname: string;
    email?: string;
    plan?: string;
    avatarUrl?: string;
  }>;
}

interface InferenceResult {
  success: boolean;
  data?: any;
  error?: string;
}

class HuggingFaceClient {
  private token: string;

  constructor() {
    this.token = ENV.huggingFaceApiToken || "";
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${HF_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Hugging Face API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Get current user information
   */
  async whoami(): Promise<HFUserInfo> {
    return this.request<HFUserInfo>("/whoami-v2");
  }

  /**
   * List models from Hugging Face Hub
   */
  async listModels(options: {
    author?: string;
    search?: string;
    filter?: string;
    sort?: "downloads" | "likes" | "lastModified";
    direction?: "asc" | "desc";
    limit?: number;
  } = {}): Promise<HFModel[]> {
    const params = new URLSearchParams();
    
    if (options.author) params.append("author", options.author);
    if (options.search) params.append("search", options.search);
    if (options.filter) params.append("filter", options.filter);
    if (options.sort) params.append("sort", options.sort);
    if (options.direction) params.append("direction", options.direction === "desc" ? "-1" : "1");
    if (options.limit) params.append("limit", options.limit.toString());

    const query = params.toString();
    return this.request<HFModel[]>(`/models${query ? `?${query}` : ""}`);
  }

  /**
   * Get model details
   */
  async getModel(modelId: string): Promise<HFModel> {
    return this.request<HFModel>(`/models/${modelId}`);
  }

  /**
   * List datasets from Hugging Face Hub
   */
  async listDatasets(options: {
    author?: string;
    search?: string;
    filter?: string;
    sort?: "downloads" | "likes" | "lastModified";
    direction?: "asc" | "desc";
    limit?: number;
  } = {}): Promise<HFDataset[]> {
    const params = new URLSearchParams();
    
    if (options.author) params.append("author", options.author);
    if (options.search) params.append("search", options.search);
    if (options.filter) params.append("filter", options.filter);
    if (options.sort) params.append("sort", options.sort);
    if (options.direction) params.append("direction", options.direction === "desc" ? "-1" : "1");
    if (options.limit) params.append("limit", options.limit.toString());

    const query = params.toString();
    return this.request<HFDataset[]>(`/datasets${query ? `?${query}` : ""}`);
  }

  /**
   * Get dataset details
   */
  async getDataset(datasetId: string): Promise<HFDataset> {
    return this.request<HFDataset>(`/datasets/${datasetId}`);
  }

  /**
   * Run inference on a model
   */
  async inference(modelId: string, inputs: any, options: {
    useCache?: boolean;
    waitForModel?: boolean;
  } = {}): Promise<InferenceResult> {
    try {
      const response = await fetch(`${HF_INFERENCE_API}/${modelId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
          ...(options.useCache === false && { "x-use-cache": "false" }),
          ...(options.waitForModel && { "x-wait-for-model": "true" }),
        },
        body: JSON.stringify({ inputs }),
      });

      if (!response.ok) {
        const error = await response.text();
        return {
          success: false,
          error: `Inference Error: ${response.status} - ${error}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Text generation inference
   */
  async generateText(modelId: string, prompt: string, options: {
    maxNewTokens?: number;
    temperature?: number;
    topP?: number;
    topK?: number;
    repetitionPenalty?: number;
    doSample?: boolean;
  } = {}): Promise<InferenceResult> {
    const parameters = {
      max_new_tokens: options.maxNewTokens || 256,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 0.95,
      top_k: options.topK || 50,
      repetition_penalty: options.repetitionPenalty || 1.1,
      do_sample: options.doSample !== false,
    };

    return this.inference(modelId, prompt, { waitForModel: true });
  }

  /**
   * Get organization info
   */
  async getOrganization(orgName: string): Promise<any> {
    return this.request(`/organizations/${orgName}`);
  }

  /**
   * List organization models
   */
  async listOrganizationModels(orgName: string, limit: number = 100): Promise<HFModel[]> {
    return this.listModels({ author: orgName, limit });
  }

  /**
   * List organization datasets
   */
  async listOrganizationDatasets(orgName: string, limit: number = 100): Promise<HFDataset[]> {
    return this.listDatasets({ author: orgName, limit });
  }
}

// Export singleton instance
export const huggingFaceClient = new HuggingFaceClient();

// Export types
export type { HFModel, HFDataset, HFUserInfo, InferenceResult };
