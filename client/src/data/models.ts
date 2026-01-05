export interface AIModel {
  id: string;
  name: string;
  description: string;
  category: "llm" | "vision" | "audio" | "multimodal";
  parameters: string;
  contextWindow: string;
  benchmarks: {
    name: string;
    score: number;
    maxScore: number;
  }[];
  features: string[];
  pricing: {
    input: number; // per 1M tokens
    output: number; // per 1M tokens
  };
  status: "available" | "beta" | "coming-soon";
  releaseDate: string;
  huggingFaceId?: string;
}

export const AI_MODELS: AIModel[] = [
  {
    id: "omnicortex-7b",
    name: "OmniCortex-7B",
    description: "Our flagship 7 billion parameter model optimized for general-purpose tasks. Excels at reasoning, coding, and creative writing with exceptional efficiency.",
    category: "llm",
    parameters: "7B",
    contextWindow: "32K",
    benchmarks: [
      { name: "MMLU", score: 68.5, maxScore: 100 },
      { name: "HumanEval", score: 72.1, maxScore: 100 },
      { name: "GSM8K", score: 78.3, maxScore: 100 },
    ],
    features: [
      "Multi-turn conversation",
      "Code generation",
      "Reasoning chains",
      "Function calling",
      "JSON mode",
    ],
    pricing: { input: 0.15, output: 0.60 },
    status: "available",
    releaseDate: "2024-12-01",
    huggingFaceId: "OmniCortex/omnicortex-7b",
  },
  {
    id: "omnicortex-32b",
    name: "OmniCortex-32B",
    description: "Advanced 32 billion parameter model with superior reasoning capabilities. Ideal for complex analysis, research assistance, and enterprise applications.",
    category: "llm",
    parameters: "32B",
    contextWindow: "128K",
    benchmarks: [
      { name: "MMLU", score: 82.4, maxScore: 100 },
      { name: "HumanEval", score: 85.7, maxScore: 100 },
      { name: "GSM8K", score: 91.2, maxScore: 100 },
    ],
    features: [
      "Extended context",
      "Advanced reasoning",
      "Multi-step planning",
      "Tool use",
      "RAG optimization",
    ],
    pricing: { input: 0.50, output: 1.50 },
    status: "available",
    releaseDate: "2024-11-15",
    huggingFaceId: "OmniCortex/omnicortex-32b",
  },
  {
    id: "omnicortex-vision",
    name: "OmniCortex Vision",
    description: "State-of-the-art vision-language model capable of understanding images, charts, documents, and complex visual content with high accuracy.",
    category: "multimodal",
    parameters: "12B",
    contextWindow: "64K",
    benchmarks: [
      { name: "VQAv2", score: 84.2, maxScore: 100 },
      { name: "TextVQA", score: 78.9, maxScore: 100 },
      { name: "DocVQA", score: 89.1, maxScore: 100 },
    ],
    features: [
      "Image understanding",
      "Document analysis",
      "Chart interpretation",
      "OCR capabilities",
      "Visual reasoning",
    ],
    pricing: { input: 0.75, output: 2.00 },
    status: "available",
    releaseDate: "2024-10-20",
    huggingFaceId: "OmniCortex/omnicortex-vision",
  },
  {
    id: "omnicortex-coder",
    name: "OmniCortex Coder",
    description: "Specialized coding model trained on 500B+ tokens of high-quality code. Supports 80+ programming languages with exceptional accuracy.",
    category: "llm",
    parameters: "15B",
    contextWindow: "64K",
    benchmarks: [
      { name: "HumanEval", score: 91.3, maxScore: 100 },
      { name: "MBPP", score: 88.7, maxScore: 100 },
      { name: "DS-1000", score: 76.4, maxScore: 100 },
    ],
    features: [
      "Code completion",
      "Bug detection",
      "Code review",
      "Refactoring",
      "Test generation",
    ],
    pricing: { input: 0.30, output: 1.00 },
    status: "available",
    releaseDate: "2024-09-10",
    huggingFaceId: "OmniCortex/omnicortex-coder",
  },
  {
    id: "omnicortex-embed",
    name: "OmniCortex Embed",
    description: "High-performance embedding model for semantic search, RAG applications, and similarity matching. Optimized for both speed and accuracy.",
    category: "llm",
    parameters: "1.5B",
    contextWindow: "8K",
    benchmarks: [
      { name: "MTEB", score: 72.8, maxScore: 100 },
      { name: "BEIR", score: 68.4, maxScore: 100 },
    ],
    features: [
      "Dense embeddings",
      "Multilingual support",
      "Fast inference",
      "Batch processing",
      "Dimension reduction",
    ],
    pricing: { input: 0.02, output: 0 },
    status: "available",
    releaseDate: "2024-08-25",
    huggingFaceId: "OmniCortex/omnicortex-embed",
  },
  {
    id: "omnicortex-100b",
    name: "OmniCortex-100B",
    description: "Our most powerful model with 100 billion parameters. Designed for the most demanding enterprise applications requiring maximum capability.",
    category: "llm",
    parameters: "100B",
    contextWindow: "256K",
    benchmarks: [
      { name: "MMLU", score: 89.7, maxScore: 100 },
      { name: "HumanEval", score: 93.2, maxScore: 100 },
      { name: "GSM8K", score: 96.8, maxScore: 100 },
    ],
    features: [
      "Maximum capability",
      "Complex reasoning",
      "Multi-agent support",
      "Enterprise security",
      "Custom fine-tuning",
    ],
    pricing: { input: 2.00, output: 6.00 },
    status: "beta",
    releaseDate: "2025-01-15",
    huggingFaceId: "OmniCortex/omnicortex-100b",
  },
];

export const getModelById = (id: string): AIModel | undefined => {
  return AI_MODELS.find((model) => model.id === id);
};

export const getModelsByCategory = (category: AIModel["category"]): AIModel[] => {
  return AI_MODELS.filter((model) => model.category === category);
};

export const getAvailableModels = (): AIModel[] => {
  return AI_MODELS.filter((model) => model.status === "available");
};
