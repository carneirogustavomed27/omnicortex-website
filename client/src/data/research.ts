export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  publishedDate: string;
  venue: string;
  category: "llm" | "vision" | "multimodal" | "safety" | "efficiency";
  arxivId?: string;
  pdfUrl?: string;
  codeUrl?: string;
  citations: number;
  featured: boolean;
}

export const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    id: "omnicortex-scaling",
    title: "OmniCortex: Scaling Laws for Universal Intelligence",
    abstract: "We present OmniCortex, a family of large language models that demonstrate novel scaling properties across diverse cognitive tasks. Our research reveals that careful architectural choices combined with high-quality training data can achieve superior performance at smaller scales, challenging conventional wisdom about model size requirements.",
    authors: ["Dr. Elena Rodriguez", "Dr. Marcus Chen", "Dr. Aisha Patel", "Dr. James Wilson"],
    publishedDate: "2024-11-15",
    venue: "NeurIPS 2024",
    category: "llm",
    arxivId: "2411.12345",
    codeUrl: "https://github.com/OmniCortex-AI/omnicortex",
    citations: 234,
    featured: true,
  },
  {
    id: "multimodal-reasoning",
    title: "Beyond Vision: Multimodal Reasoning in OmniCortex Vision",
    abstract: "This paper introduces OmniCortex Vision, a multimodal model that achieves state-of-the-art performance on visual reasoning tasks. We demonstrate that our novel cross-attention mechanism enables deeper integration of visual and textual understanding, leading to significant improvements in document analysis and chart interpretation.",
    authors: ["Dr. Marcus Chen", "Dr. Sarah Kim", "Dr. David Liu"],
    publishedDate: "2024-10-20",
    venue: "CVPR 2024",
    category: "multimodal",
    arxivId: "2410.67890",
    codeUrl: "https://github.com/OmniCortex-AI/omnicortex-vision",
    citations: 156,
    featured: true,
  },
  {
    id: "efficient-inference",
    title: "Efficient Inference at Scale: Optimizing OmniCortex for Production",
    abstract: "We present a comprehensive study of inference optimization techniques for large language models. Our methods achieve 3x speedup with minimal quality degradation through novel quantization schemes, speculative decoding, and dynamic batching strategies.",
    authors: ["Dr. Aisha Patel", "Dr. Robert Zhang", "Dr. Emily Brown"],
    publishedDate: "2024-09-05",
    venue: "ICML 2024",
    category: "efficiency",
    arxivId: "2409.11111",
    citations: 89,
    featured: false,
  },
  {
    id: "safety-alignment",
    title: "Principled Alignment: Safety-First Training for OmniCortex",
    abstract: "This work presents our approach to AI safety and alignment in the OmniCortex model family. We introduce a novel constitutional AI framework that balances helpfulness with safety, achieving industry-leading scores on safety benchmarks while maintaining high utility.",
    authors: ["Dr. James Wilson", "Dr. Lisa Anderson", "Dr. Michael Park"],
    publishedDate: "2024-08-12",
    venue: "AAAI 2024",
    category: "safety",
    arxivId: "2408.22222",
    citations: 178,
    featured: true,
  },
  {
    id: "code-generation",
    title: "OmniCortex Coder: Advancing Code Generation with Structured Reasoning",
    abstract: "We introduce OmniCortex Coder, a specialized model for code generation that incorporates structured reasoning chains. Our approach significantly outperforms existing models on complex programming tasks by explicitly modeling the problem-solving process.",
    authors: ["Dr. Sarah Kim", "Dr. David Liu", "Dr. Elena Rodriguez"],
    publishedDate: "2024-07-28",
    venue: "ACL 2024",
    category: "llm",
    arxivId: "2407.33333",
    codeUrl: "https://github.com/OmniCortex-AI/omnicortex-coder",
    citations: 203,
    featured: false,
  },
  {
    id: "long-context",
    title: "Extending Context: 256K Token Windows in OmniCortex-100B",
    abstract: "This paper details our approach to extending context windows to 256K tokens while maintaining high-quality attention across the entire sequence. We introduce a novel position encoding scheme and efficient attention mechanism that enables practical long-context applications.",
    authors: ["Dr. Robert Zhang", "Dr. Marcus Chen", "Dr. Aisha Patel"],
    publishedDate: "2024-12-01",
    venue: "ICLR 2025 (Submitted)",
    category: "llm",
    arxivId: "2412.44444",
    citations: 45,
    featured: true,
  },
];

export interface ResearchArea {
  id: string;
  name: string;
  description: string;
  icon: string;
  papers: number;
  researchers: number;
}

export const RESEARCH_AREAS: ResearchArea[] = [
  {
    id: "llm",
    name: "Large Language Models",
    description: "Advancing the frontiers of natural language understanding and generation through novel architectures and training methodologies.",
    icon: "brain",
    papers: 24,
    researchers: 12,
  },
  {
    id: "multimodal",
    name: "Multimodal AI",
    description: "Building systems that seamlessly integrate vision, language, and other modalities for comprehensive understanding.",
    icon: "eye",
    papers: 18,
    researchers: 8,
  },
  {
    id: "safety",
    name: "AI Safety & Alignment",
    description: "Ensuring our AI systems are safe, beneficial, and aligned with human values through rigorous research and testing.",
    icon: "shield",
    papers: 15,
    researchers: 10,
  },
  {
    id: "efficiency",
    name: "Efficient AI",
    description: "Developing techniques to make AI more accessible through improved efficiency, reduced costs, and optimized inference.",
    icon: "zap",
    papers: 12,
    researchers: 6,
  },
];

export const getPaperById = (id: string): ResearchPaper | undefined => {
  return RESEARCH_PAPERS.find((paper) => paper.id === id);
};

export const getPapersByCategory = (category: ResearchPaper["category"]): ResearchPaper[] => {
  return RESEARCH_PAPERS.filter((paper) => paper.category === category);
};

export const getFeaturedPapers = (): ResearchPaper[] => {
  return RESEARCH_PAPERS.filter((paper) => paper.featured);
};
