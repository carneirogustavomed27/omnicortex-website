import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createCheckoutSession, createCreditsCheckout, getSubscriptionStatus, cancelSubscription, createCustomerPortalSession } from "./stripe/stripe";
import { PRICING_PLANS, CREDIT_PACKS, getPlanById } from "./stripe/products";
import { getDb } from "./db";
import { users, apiKeys } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { huggingFaceClient } from "./huggingface/client";
import { nanoid } from "nanoid";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Pricing and Plans
  pricing: router({
    getPlans: publicProcedure.query(() => {
      return PRICING_PLANS;
    }),
    getCreditPacks: publicProcedure.query(() => {
      return CREDIT_PACKS;
    }),
    getPlanById: publicProcedure
      .input(z.object({ planId: z.string() }))
      .query(({ input }) => {
        return getPlanById(input.planId);
      }),
  }),

  // Subscription management
  subscription: router({
    // Get current user's subscription status
    getStatus: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      if (result.length === 0) {
        return {
          plan: "free",
          status: "inactive",
          tokenBalance: 10000,
          tokensUsedThisMonth: 0,
        };
      }

      const user = result[0];
      
      // If user has Stripe customer ID, get live subscription status
      let liveStatus = null;
      if (user.stripeCustomerId) {
        liveStatus = await getSubscriptionStatus(user.stripeCustomerId);
      }

      return {
        plan: user.subscriptionPlan || "free",
        status: user.subscriptionStatus || "inactive",
        tokenBalance: user.tokenBalance || 10000,
        tokensUsedThisMonth: user.tokensUsedThisMonth || 0,
        stripeSubscriptionId: user.stripeSubscriptionId,
        currentPeriodEnd: liveStatus?.currentPeriodEnd,
        cancelAtPeriodEnd: liveStatus?.cancelAtPeriodEnd,
      };
    }),

    // Create checkout session for subscription
    createCheckout: protectedProcedure
      .input(z.object({
        planId: z.string(),
        isYearly: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const origin = ctx.req.headers.origin || "http://localhost:3000";
        
        const result = await createCheckoutSession({
          planId: input.planId,
          userId: ctx.user.id,
          userEmail: ctx.user.email || "",
          userName: ctx.user.name || undefined,
          isYearly: input.isYearly,
          successUrl: `${origin}/dashboard/billing?success=true`,
          cancelUrl: `${origin}/pricing?canceled=true`,
        });

        return result;
      }),

    // Create checkout for credit packs
    buyCredits: protectedProcedure
      .input(z.object({ creditPackId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const origin = ctx.req.headers.origin || "http://localhost:3000";
        
        const result = await createCreditsCheckout(
          input.creditPackId,
          ctx.user.id,
          ctx.user.email || "",
          `${origin}/dashboard/billing?credits=true`,
          `${origin}/pricing?canceled=true`
        );

        return result;
      }),

    // Cancel subscription
    cancel: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      if (result.length === 0 || !result[0].stripeSubscriptionId) {
        throw new Error("No active subscription found");
      }

      await cancelSubscription(result[0].stripeSubscriptionId);

      return { success: true };
    }),

    // Get customer portal URL
    getPortalUrl: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      if (result.length === 0 || !result[0].stripeCustomerId) {
        throw new Error("No Stripe customer found");
      }

      const origin = ctx.req.headers.origin || "http://localhost:3000";
      const url = await createCustomerPortalSession(
        result[0].stripeCustomerId,
        `${origin}/dashboard/billing`
      );

      return { url };
    }),
  }),

  // User dashboard data
  dashboard: router({
    getStats: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      if (result.length === 0) {
        return {
          tokenBalance: 10000,
          tokensUsedThisMonth: 0,
          plan: "free",
          apiCallsThisMonth: 0,
        };
      }

      const user = result[0];
      const plan = getPlanById(user.subscriptionPlan || "free");

      return {
        tokenBalance: user.tokenBalance || 10000,
        tokensUsedThisMonth: user.tokensUsedThisMonth || 0,
        plan: user.subscriptionPlan || "free",
        planName: plan?.name || "Starter",
        tokenLimit: plan?.limits.tokensPerMonth || 10000,
        apiCallsThisMonth: 0, // TODO: Calculate from usage logs
      };
    }),
  }),

  // API Keys management
  apiKeys: router({
    // List user's API keys
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const keys = await db
        .select({
          id: apiKeys.id,
          name: apiKeys.name,
          keyPrefix: apiKeys.keyPrefix,
          permissions: apiKeys.permissions,
          lastUsedAt: apiKeys.lastUsedAt,
          createdAt: apiKeys.createdAt,
          expiresAt: apiKeys.expiresAt,
          isActive: apiKeys.isActive,
        })
        .from(apiKeys)
        .where(eq(apiKeys.userId, ctx.user.id));

      return keys;
    }),

    // Create new API key
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(100),
        permissions: z.array(z.enum(["read", "write", "inference"])).default(["read"]),
        expiresInDays: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Generate a secure API key
        const keyValue = `oc_${nanoid(32)}`;
        const keyPrefix = keyValue.substring(0, 10);

        const expiresAt = input.expiresInDays
          ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
          : null;

        const keyId = nanoid();
        const now = new Date();
        
        await db
          .insert(apiKeys)
          .values({
            id: keyId,
            userId: ctx.user.id,
            name: input.name,
            keyHash: keyValue, // In production, hash this!
            keyPrefix,
            permissions: JSON.stringify(input.permissions),
            expiresAt,
            isActive: 1,
          });

        // Return the full key only once (on creation)
        return {
          id: keyId,
          name: input.name,
          key: keyValue, // Only shown once!
          keyPrefix,
          permissions: input.permissions,
          expiresAt,
          createdAt: now,
        };
      }),

    // Revoke API key
    revoke: protectedProcedure
      .input(z.object({ keyId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db
          .update(apiKeys)
          .set({ isActive: 0 })
          .where(
            and(
              eq(apiKeys.id, input.keyId),
              eq(apiKeys.userId, ctx.user.id)
            )
          );

        return { success: true };
      }),

    // Delete API key
    delete: protectedProcedure
      .input(z.object({ keyId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db
          .delete(apiKeys)
          .where(
            and(
              eq(apiKeys.id, input.keyId),
              eq(apiKeys.userId, ctx.user.id)
            )
          );

        return { success: true };
      }),
  }),

  // Hugging Face integration
  huggingface: router({
    // Get organization info
    getOrgInfo: publicProcedure.query(async () => {
      try {
        const userInfo = await huggingFaceClient.whoami();
        return {
          success: true,
          user: userInfo,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to fetch org info",
        };
      }
    }),

    // List available models
    listModels: publicProcedure
      .input(z.object({
        author: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().default(20),
      }))
      .query(async ({ input }) => {
        try {
          const models = await huggingFaceClient.listModels({
            author: input.author,
            search: input.search,
            limit: input.limit,
            sort: "downloads",
            direction: "desc",
          });
          return {
            success: true,
            models,
          };
        } catch (error) {
          return {
            success: false,
            models: [],
            error: error instanceof Error ? error.message : "Failed to fetch models",
          };
        }
      }),

    // List available datasets
    listDatasets: publicProcedure
      .input(z.object({
        author: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().default(20),
      }))
      .query(async ({ input }) => {
        try {
          const datasets = await huggingFaceClient.listDatasets({
            author: input.author,
            search: input.search,
            limit: input.limit,
            sort: "downloads",
            direction: "desc",
          });
          return {
            success: true,
            datasets,
          };
        } catch (error) {
          return {
            success: false,
            datasets: [],
            error: error instanceof Error ? error.message : "Failed to fetch datasets",
          };
        }
      }),

    // Run inference (protected - requires subscription)
    inference: protectedProcedure
      .input(z.object({
        modelId: z.string(),
        inputs: z.any(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Check user's token balance
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, ctx.user.id))
          .limit(1);

        if (!user || (user.tokenBalance || 0) < 100) {
          throw new Error("Insufficient token balance. Please upgrade your plan or purchase more tokens.");
        }

        // Run inference
        const result = await huggingFaceClient.inference(input.modelId, input.inputs, {
          waitForModel: true,
        });

        if (result.success) {
          // Deduct tokens (estimate based on input/output size)
          const tokensUsed = 100; // Simplified - in production, calculate based on actual usage
          await db
            .update(users)
            .set({
              tokenBalance: (user.tokenBalance || 0) - tokensUsed,
              tokensUsedThisMonth: (user.tokensUsedThisMonth || 0) + tokensUsed,
            })
            .where(eq(users.id, ctx.user.id));
        }

        return result;
      }),

    // Text generation (protected)
    generateText: protectedProcedure
      .input(z.object({
        modelId: z.string(),
        prompt: z.string(),
        maxNewTokens: z.number().optional(),
        temperature: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Check user's token balance
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, ctx.user.id))
          .limit(1);

        if (!user || (user.tokenBalance || 0) < 100) {
          throw new Error("Insufficient token balance. Please upgrade your plan or purchase more tokens.");
        }

        // Run text generation
        const result = await huggingFaceClient.generateText(input.modelId, input.prompt, {
          maxNewTokens: input.maxNewTokens,
          temperature: input.temperature,
        });

        if (result.success) {
          // Deduct tokens
          const tokensUsed = Math.ceil(input.prompt.length / 4) + (input.maxNewTokens || 256);
          await db
            .update(users)
            .set({
              tokenBalance: (user.tokenBalance || 0) - tokensUsed,
              tokensUsedThisMonth: (user.tokensUsedThisMonth || 0) + tokensUsed,
            })
            .where(eq(users.id, ctx.user.id));
        }

        return result;
      }),
  }),
});

export type AppRouter = typeof appRouter;
