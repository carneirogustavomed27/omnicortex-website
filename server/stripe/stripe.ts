import Stripe from "stripe";
import { ENV } from "../_core/env";

// Initialize Stripe client
export const stripe = new Stripe(ENV.stripeSecretKey || "", {
  apiVersion: "2025-12-15.clover",
});

// Types for checkout
export interface CreateCheckoutParams {
  planId: string;
  userId: number;
  userEmail: string;
  userName?: string;
  isYearly?: boolean;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCheckoutResult {
  sessionId: string;
  url: string;
}

/**
 * Create a Stripe Checkout Session for subscription
 */
export async function createCheckoutSession(
  params: CreateCheckoutParams
): Promise<CreateCheckoutResult> {
  const { planId, userId, userEmail, userName, isYearly, successUrl, cancelUrl } = params;

  // Get or create price in Stripe (in production, these would be pre-created)
  const priceId = await getOrCreatePrice(planId, isYearly);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: userEmail,
    client_reference_id: userId.toString(),
    allow_promotion_codes: true,
    metadata: {
      user_id: userId.toString(),
      customer_email: userEmail,
      customer_name: userName || "",
      plan_id: planId,
      billing_cycle: isYearly ? "yearly" : "monthly",
    },
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    subscription_data: {
      metadata: {
        user_id: userId.toString(),
        plan_id: planId,
      },
    },
  });

  return {
    sessionId: session.id,
    url: session.url!,
  };
}

/**
 * Create a one-time payment checkout for credit packs
 */
export async function createCreditsCheckout(
  creditPackId: string,
  userId: number,
  userEmail: string,
  successUrl: string,
  cancelUrl: string
): Promise<CreateCheckoutResult> {
  const priceId = await getOrCreateCreditPrice(creditPackId);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: userEmail,
    client_reference_id: userId.toString(),
    allow_promotion_codes: true,
    metadata: {
      user_id: userId.toString(),
      customer_email: userEmail,
      credit_pack_id: creditPackId,
      type: "credit_purchase",
    },
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
  });

  return {
    sessionId: session.id,
    url: session.url!,
  };
}

/**
 * Get customer's subscription status
 */
export async function getSubscriptionStatus(stripeCustomerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: stripeCustomerId,
    status: "active",
    limit: 1,
  });

  if (subscriptions.data.length === 0) {
    return null;
  }

  const subscription = subscriptions.data[0];
  const currentPeriodEnd = (subscription as any).current_period_end;
  return {
    id: subscription.id,
    status: subscription.status,
    currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : new Date(),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    planId: subscription.metadata.plan_id,
  };
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

/**
 * Get customer portal URL for managing subscription
 */
export async function createCustomerPortalSession(
  stripeCustomerId: string,
  returnUrl: string
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });

  return session.url;
}

// Cache for price IDs (in production, use database)
const priceCache = new Map<string, string>();

async function getOrCreatePrice(planId: string, isYearly?: boolean): Promise<string> {
  const cacheKey = `${planId}-${isYearly ? "yearly" : "monthly"}`;
  
  if (priceCache.has(cacheKey)) {
    return priceCache.get(cacheKey)!;
  }

  // Import pricing plans
  const { PRICING_PLANS } = await import("./products");
  const plan = PRICING_PLANS.find(p => p.id === planId);
  
  if (!plan) {
    throw new Error(`Plan not found: ${planId}`);
  }

  // Create product in Stripe
  const product = await stripe.products.create({
    name: `OmniCortex ${plan.name}`,
    description: plan.description,
    metadata: {
      plan_id: planId,
    },
  });

  // Create price
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: Math.round((isYearly ? plan.priceYearly : plan.price) * 100),
    currency: "usd",
    recurring: {
      interval: isYearly ? "year" : "month",
    },
    metadata: {
      plan_id: planId,
      billing_cycle: isYearly ? "yearly" : "monthly",
    },
  });

  priceCache.set(cacheKey, price.id);
  return price.id;
}

async function getOrCreateCreditPrice(creditPackId: string): Promise<string> {
  const cacheKey = `credit-${creditPackId}`;
  
  if (priceCache.has(cacheKey)) {
    return priceCache.get(cacheKey)!;
  }

  const { CREDIT_PACKS } = await import("./products");
  const pack = CREDIT_PACKS.find(p => p.id === creditPackId);
  
  if (!pack) {
    throw new Error(`Credit pack not found: ${creditPackId}`);
  }

  const product = await stripe.products.create({
    name: pack.name,
    description: `${pack.tokens.toLocaleString()} tokens for OmniCortex API`,
    metadata: {
      credit_pack_id: creditPackId,
      tokens: pack.tokens.toString(),
    },
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: Math.round(pack.price * 100),
    currency: "usd",
    metadata: {
      credit_pack_id: creditPackId,
    },
  });

  priceCache.set(cacheKey, price.id);
  return price.id;
}
