/**
 * OmniCortex AI Labs - Pricing Plans
 * 
 * Estratégia de Precificação B2B para Máxima Conversão:
 * - Modelo Híbrido: Assinatura base + Usage-based para tokens extras
 * - Ancoragem de Preço: Plano Enterprise como âncora para valorizar o Pro
 * - Freemium Gateway: Plano gratuito para captura de leads
 * - Psychological Pricing: Preços terminando em 9 para percepção de valor
 */

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number; // USD per month
  priceYearly: number; // USD per year (with discount)
  features: string[];
  limits: {
    tokensPerMonth: number;
    modelsAccess: string[];
    apiCalls: number;
    supportLevel: string;
  };
  highlighted?: boolean;
  badge?: string;
  stripePriceId?: string; // Will be set after creating in Stripe
  stripeYearlyPriceId?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Starter",
    description: "Perfect for exploring OmniCortex capabilities",
    price: 0,
    priceYearly: 0,
    features: [
      "Access to OmniCortex-7B base model",
      "10,000 tokens/month",
      "Community support",
      "API access (rate limited)",
      "Basic documentation",
    ],
    limits: {
      tokensPerMonth: 10000,
      modelsAccess: ["omnicortex-7b"],
      apiCalls: 100,
      supportLevel: "community",
    },
  },
  {
    id: "pro",
    name: "Pro",
    description: "For developers and small teams building AI products",
    price: 49,
    priceYearly: 470, // ~20% discount
    features: [
      "All Starter features",
      "500,000 tokens/month",
      "Access to OmniVision-Pro",
      "Priority API access",
      "Email support (24h response)",
      "Fine-tuning capabilities",
      "Webhook integrations",
      "Usage analytics dashboard",
    ],
    limits: {
      tokensPerMonth: 500000,
      modelsAccess: ["omnicortex-7b", "omnivision-pro", "cortex-audio-2"],
      apiCalls: 10000,
      supportLevel: "email",
    },
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "business",
    name: "Business",
    description: "For growing companies with production workloads",
    price: 199,
    priceYearly: 1910, // ~20% discount
    features: [
      "All Pro features",
      "2,000,000 tokens/month",
      "Access to CodeCortex-34B",
      "Dedicated API endpoints",
      "Priority support (4h response)",
      "Custom model fine-tuning",
      "Team management (up to 10 seats)",
      "SLA guarantee (99.9% uptime)",
      "Advanced security features",
    ],
    limits: {
      tokensPerMonth: 2000000,
      modelsAccess: ["omnicortex-7b", "omnivision-pro", "cortex-audio-2", "codecortex-34b"],
      apiCalls: 100000,
      supportLevel: "priority",
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For organizations requiring maximum scale and customization",
    price: 999,
    priceYearly: 9590, // ~20% discount
    features: [
      "All Business features",
      "Unlimited tokens",
      "Access to ALL models including beta",
      "Dedicated infrastructure",
      "24/7 phone & Slack support",
      "Custom model training",
      "Unlimited team seats",
      "SLA guarantee (99.99% uptime)",
      "On-premise deployment option",
      "Dedicated account manager",
      "Custom contracts & invoicing",
    ],
    limits: {
      tokensPerMonth: -1, // Unlimited
      modelsAccess: ["all"],
      apiCalls: -1, // Unlimited
      supportLevel: "dedicated",
    },
    badge: "Best Value",
  },
];

// Usage-based pricing for additional tokens (overage)
export const TOKEN_OVERAGE_PRICING = {
  pricePerMillionTokens: 2.50, // $2.50 per 1M tokens
  minimumPurchase: 100000, // 100k tokens minimum
};

// One-time purchases (credits packs)
export const CREDIT_PACKS = [
  {
    id: "credits-small",
    name: "Token Pack - Small",
    tokens: 500000,
    price: 9.99,
    savings: "0%",
  },
  {
    id: "credits-medium",
    name: "Token Pack - Medium",
    tokens: 2000000,
    price: 34.99,
    savings: "12%",
  },
  {
    id: "credits-large",
    name: "Token Pack - Large",
    tokens: 10000000,
    price: 149.99,
    savings: "25%",
  },
];

// Helper function to get plan by ID
export function getPlanById(planId: string): PricingPlan | undefined {
  return PRICING_PLANS.find(plan => plan.id === planId);
}

// Helper function to get credit pack by ID
export function getCreditPackById(packId: string) {
  return CREDIT_PACKS.find(pack => pack.id === packId);
}

// Helper function to format price for display
export function formatPrice(price: number, currency: string = "USD"): string {
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}
