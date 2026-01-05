import { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "./stripe";
import { ENV } from "../_core/env";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { sendEmail, emailTemplates, getPlanCredits } from "../email/emailService";

/**
 * Stripe Webhook Handler
 * 
 * Handles incoming webhook events from Stripe for:
 * - Subscription lifecycle (created, updated, deleted)
 * - Payment events (succeeded, failed)
 * - Customer events
 * - Email notifications for all events
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = ENV.stripeWebhookSecret;

  if (!webhookSecret) {
    console.error("[Webhook] Missing STRIPE_WEBHOOK_SECRET");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("[Webhook] Signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // CRITICAL: Handle test events for webhook verification
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "invoice.upcoming":
        await handleInvoiceUpcoming(event.data.object as Stripe.Invoice);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error(`[Webhook] Error processing ${event.type}:`, error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("[Webhook] Checkout completed:", session.id);

  const userId = session.metadata?.user_id;
  const planId = session.metadata?.plan_id;
  const customerId = session.customer as string;

  if (!userId) {
    console.error("[Webhook] No user_id in checkout session metadata");
    return;
  }

  const db = await getDb();
  if (!db) {
    console.error("[Webhook] Database not available");
    return;
  }

  // Get user info for email
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.id, parseInt(userId)))
    .limit(1);

  const user = userResult[0];

  // Update user with Stripe customer ID
  await db
    .update(users)
    .set({
      stripeCustomerId: customerId,
      subscriptionPlan: planId || "pro",
      subscriptionStatus: "active",
    })
    .where(eq(users.id, parseInt(userId)));

  console.log(`[Webhook] User ${userId} subscribed to plan ${planId}`);

  // Send welcome email
  if (user && user.email) {
    const planName = getPlanName(planId || "pro");
    const credits = getPlanCredits(planName);
    
    await sendEmail({
      to: { email: user.email, name: user.name || undefined },
      template: emailTemplates.welcome({
        name: user.name || "there",
        plan: planName,
        credits: credits
      })
    });
    
    console.log(`[Webhook] Welcome email sent to ${user.email}`);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log("[Webhook] Subscription created:", subscription.id);
  
  const userId = subscription.metadata?.user_id;
  const planId = subscription.metadata?.plan_id;

  if (!userId) return;

  const db = await getDb();
  if (!db) return;

  await db
    .update(users)
    .set({
      stripeSubscriptionId: subscription.id,
      subscriptionPlan: planId || "pro",
      subscriptionStatus: subscription.status,
    })
    .where(eq(users.id, parseInt(userId)));
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("[Webhook] Subscription updated:", subscription.id);

  const db = await getDb();
  if (!db) return;

  // Find user by subscription ID
  const result = await db
    .select()
    .from(users)
    .where(eq(users.stripeSubscriptionId, subscription.id))
    .limit(1);

  if (result.length === 0) return;

  await db
    .update(users)
    .set({
      subscriptionStatus: subscription.status,
    })
    .where(eq(users.stripeSubscriptionId, subscription.id));
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("[Webhook] Subscription deleted:", subscription.id);

  const db = await getDb();
  if (!db) return;

  // Find user by subscription ID
  const result = await db
    .select()
    .from(users)
    .where(eq(users.stripeSubscriptionId, subscription.id))
    .limit(1);

  const user = result[0];

  await db
    .update(users)
    .set({
      subscriptionStatus: "canceled",
      subscriptionPlan: "free",
    })
    .where(eq(users.stripeSubscriptionId, subscription.id));

  // Send cancellation email
  if (user && user.email) {
    const endDate = new Date((subscription as any).current_period_end * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    await sendEmail({
      to: { email: user.email, name: user.name || undefined },
      template: emailTemplates.cancellationConfirmation({
        name: user.name || "there",
        plan: getPlanName(user.subscriptionPlan || "pro"),
        endDate: endDate
      })
    });

    console.log(`[Webhook] Cancellation email sent to ${user.email}`);
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log("[Webhook] Invoice paid:", invoice.id);
  
  const customerId = invoice.customer as string;
  
  const db = await getDb();
  if (!db) return;

  // Find user by customer ID
  const result = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  const user = result[0];

  // Send payment confirmation email
  if (user && user.email && invoice.hosted_invoice_url) {
    const amount = invoice.amount_paid ? `$${(invoice.amount_paid / 100).toFixed(2)}` : "$0.00";
    
    await sendEmail({
      to: { email: user.email, name: user.name || undefined },
      template: emailTemplates.paymentConfirmation({
        name: user.name || "there",
        amount: amount,
        plan: getPlanName(user.subscriptionPlan || "pro"),
        invoiceUrl: invoice.hosted_invoice_url
      })
    });

    console.log(`[Webhook] Payment confirmation email sent to ${user.email}`);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log("[Webhook] Invoice payment failed:", invoice.id);
  
  const customerId = invoice.customer as string;
  
  const db = await getDb();
  if (!db) return;

  // Find user by customer ID
  const result = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  const user = result[0];

  // Send payment failed notification
  if (user && user.email) {
    // In production, create a specific template for payment failure
    console.log(`[Webhook] Payment failed notification would be sent to ${user.email}`);
  }
}

async function handleInvoiceUpcoming(invoice: Stripe.Invoice) {
  console.log("[Webhook] Invoice upcoming:", invoice.id);
  
  const customerId = invoice.customer as string;
  
  const db = await getDb();
  if (!db) return;

  // Find user by customer ID
  const result = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  const user = result[0];

  // Send renewal reminder email (3 days before)
  if (user && user.email && invoice.next_payment_attempt) {
    const renewalDate = new Date(invoice.next_payment_attempt * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const amount = invoice.amount_due ? `$${(invoice.amount_due / 100).toFixed(2)}` : "$0.00";

    await sendEmail({
      to: { email: user.email, name: user.name || undefined },
      template: emailTemplates.renewalReminder({
        name: user.name || "there",
        plan: getPlanName(user.subscriptionPlan || "pro"),
        renewalDate: renewalDate,
        amount: amount
      })
    });

    console.log(`[Webhook] Renewal reminder email sent to ${user.email}`);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("[Webhook] Payment succeeded:", paymentIntent.id);
  
  // Handle one-time payments (credit packs)
  const creditPackId = paymentIntent.metadata?.credit_pack_id;
  const userId = paymentIntent.metadata?.user_id;

  if (creditPackId && userId) {
    const db = await getDb();
    if (!db) return;

    // Get credit pack details
    const { CREDIT_PACKS } = await import("./products");
    const pack = CREDIT_PACKS.find(p => p.id === creditPackId);

    if (pack) {
      // Add tokens to user's balance
      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, parseInt(userId)))
        .limit(1);

      if (result.length > 0) {
        const user = result[0];
        const currentTokens = user.tokenBalance || 0;
        await db
          .update(users)
          .set({
            tokenBalance: currentTokens + pack.tokens,
          })
          .where(eq(users.id, parseInt(userId)));

        console.log(`[Webhook] Added ${pack.tokens} tokens to user ${userId}`);

        // Send confirmation email for credit purchase
        if (user.email) {
          const amount = `$${(paymentIntent.amount / 100).toFixed(2)}`;
          await sendEmail({
            to: { email: user.email, name: user.name || undefined },
            template: emailTemplates.paymentConfirmation({
              name: user.name || "there",
              amount: amount,
              plan: `${pack.name} Credit Pack`,
              invoiceUrl: `https://omnicortex.ai/dashboard/billing`
            })
          });
        }
      }
    }
  }
}

// Helper function to get plan name from ID
function getPlanName(planId: string): string {
  const planNames: Record<string, string> = {
    "starter": "Starter",
    "pro": "Pro",
    "business": "Business",
    "enterprise": "Enterprise",
    "free": "Free"
  };
  return planNames[planId.toLowerCase()] || "Pro";
}
