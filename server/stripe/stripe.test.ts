import { describe, it, expect, vi, beforeEach } from "vitest";
import { PRICING_PLANS, CREDIT_PACKS, getPlanById, getCreditPackById } from "./products";

describe("Pricing Products", () => {
  describe("PRICING_PLANS", () => {
    it("should have 4 pricing plans", () => {
      expect(PRICING_PLANS).toHaveLength(4);
    });

    it("should have required fields for each plan", () => {
      PRICING_PLANS.forEach((plan) => {
        expect(plan).toHaveProperty("id");
        expect(plan).toHaveProperty("name");
        expect(plan).toHaveProperty("description");
        expect(plan).toHaveProperty("price");
        expect(plan).toHaveProperty("priceYearly");
        expect(plan).toHaveProperty("features");
        expect(plan).toHaveProperty("limits");
        expect(Array.isArray(plan.features)).toBe(true);
      });
    });

    it("should have a free plan", () => {
      const freePlan = PRICING_PLANS.find((p) => p.id === "free");
      expect(freePlan).toBeDefined();
      expect(freePlan?.price).toBe(0);
      expect(freePlan?.priceYearly).toBe(0);
    });

    it("should have yearly prices lower than monthly * 12", () => {
      PRICING_PLANS.filter((p) => p.price > 0).forEach((plan) => {
        const monthlyTotal = plan.price * 12;
        expect(plan.priceYearly).toBeLessThan(monthlyTotal);
      });
    });

    it("should have one highlighted plan (most popular)", () => {
      const highlightedPlans = PRICING_PLANS.filter((p) => p.highlighted);
      expect(highlightedPlans.length).toBeGreaterThanOrEqual(1);
    });

    it("should have valid token limits", () => {
      PRICING_PLANS.forEach((plan) => {
        expect(plan.limits.tokensPerMonth).toBeDefined();
        // -1 means unlimited, otherwise should be positive
        if (plan.limits.tokensPerMonth !== -1) {
          expect(plan.limits.tokensPerMonth).toBeGreaterThan(0);
        }
      });
    });
  });

  describe("CREDIT_PACKS", () => {
    it("should have 3 credit packs", () => {
      expect(CREDIT_PACKS).toHaveLength(3);
    });

    it("should have required fields for each pack", () => {
      CREDIT_PACKS.forEach((pack) => {
        expect(pack).toHaveProperty("id");
        expect(pack).toHaveProperty("name");
        expect(pack).toHaveProperty("tokens");
        expect(pack).toHaveProperty("price");
        expect(pack.tokens).toBeGreaterThan(0);
        expect(pack.price).toBeGreaterThan(0);
      });
    });

    it("should have better value for larger packs", () => {
      // Sort by tokens ascending
      const sortedPacks = [...CREDIT_PACKS].sort((a, b) => a.tokens - b.tokens);
      
      // Calculate price per token for each pack
      const pricesPerToken = sortedPacks.map((pack) => pack.price / pack.tokens);
      
      // Larger packs should have lower price per token
      for (let i = 1; i < pricesPerToken.length; i++) {
        expect(pricesPerToken[i]).toBeLessThan(pricesPerToken[i - 1]);
      }
    });
  });

  describe("getPlanById", () => {
    it("should return correct plan by id", () => {
      const plan = getPlanById("pro");
      expect(plan).toBeDefined();
      expect(plan?.id).toBe("pro");
      expect(plan?.name).toBe("Pro");
    });

    it("should return undefined for non-existent plan", () => {
      const plan = getPlanById("nonexistent");
      expect(plan).toBeUndefined();
    });

    it("should return free plan", () => {
      const plan = getPlanById("free");
      expect(plan).toBeDefined();
      expect(plan?.price).toBe(0);
    });
  });

  describe("getCreditPackById", () => {
    it("should return correct credit pack by id", () => {
      const pack = getCreditPackById("credits-medium");
      expect(pack).toBeDefined();
      expect(pack?.id).toBe("credits-medium");
    });

    it("should return undefined for non-existent pack", () => {
      const pack = getCreditPackById("nonexistent");
      expect(pack).toBeUndefined();
    });
  });
});

describe("Pricing Strategy", () => {
  it("should follow SaaS best practices - Pro plan should be highlighted", () => {
    const proPlan = getPlanById("pro");
    expect(proPlan?.highlighted).toBe(true);
  });

  it("should have enterprise plan with custom pricing indicator", () => {
    const enterprisePlan = getPlanById("enterprise");
    expect(enterprisePlan).toBeDefined();
    // Enterprise typically has highest token limit or unlimited
    expect(enterprisePlan?.limits.tokensPerMonth).toBe(-1); // -1 = unlimited
  });

  it("should have progressive pricing tiers", () => {
    const plans = PRICING_PLANS.filter((p) => p.price > 0);
    const sortedByPrice = [...plans].sort((a, b) => a.price - b.price);
    
    // Each higher tier should have more tokens
    for (let i = 1; i < sortedByPrice.length; i++) {
      const currentTokens = sortedByPrice[i].limits.tokensPerMonth;
      const previousTokens = sortedByPrice[i - 1].limits.tokensPerMonth;
      
      // -1 means unlimited, which is always greater
      if (currentTokens === -1) {
        expect(true).toBe(true);
      } else if (previousTokens === -1) {
        expect(false).toBe(true); // This shouldn't happen
      } else {
        expect(currentTokens).toBeGreaterThan(previousTokens);
      }
    }
  });
});
