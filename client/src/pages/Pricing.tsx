import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Shield, Rocket, Crown, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function Pricing() {
  const { user, isAuthenticated } = useAuth();
  const [isYearly, setIsYearly] = useState(true);
  const { data: plans, isLoading } = trpc.pricing.getPlans.useQuery();
  const createCheckout = trpc.subscription.createCheckout.useMutation();

  useEffect(() => {
    document.title = "Pricing - OmniCortex AI Labs | AI API Plans for Developers & Enterprises";
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (planId === "free") {
      toast.success("You're already on the free plan!");
      return;
    }

    try {
      toast.loading("Preparing checkout...");
      const result = await createCheckout.mutateAsync({ planId, isYearly });
      toast.dismiss();
      toast.success("Redirecting to checkout...");
      window.open(result.url, "_blank");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to create checkout session");
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "free": return <Zap className="w-6 h-6" />;
      case "pro": return <Rocket className="w-6 h-6" />;
      case "business": return <Shield className="w-6 h-6" />;
      case "enterprise": return <Crown className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  const getPrice = (plan: any) => {
    if (plan.price === 0) return "Free";
    const price = isYearly ? Math.round(plan.priceYearly / 12) : plan.price;
    return `$${price}`;
  };

  const getSavings = (plan: any) => {
    if (plan.price === 0) return null;
    const monthlyTotal = plan.price * 12;
    const savings = monthlyTotal - plan.priceYearly;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    return percentage > 0 ? `Save ${percentage}%` : null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading plans...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      {/* Header */}
      <div className="container text-center mb-16">
        <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
          <Sparkles className="w-3 h-3 mr-1" />
          Pricing
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Choose the perfect plan for your AI needs. Scale as you grow with our flexible pricing.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm ${!isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            Monthly
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-primary"
          />
          <span className={`text-sm ${isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            Yearly
          </span>
          {isYearly && (
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
              Save up to 20%
            </Badge>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans?.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                plan.highlighted
                  ? "border-primary shadow-[0_0_40px_-15px_var(--primary)] scale-105 z-10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className={`${plan.highlighted ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-2">
                <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${
                  plan.highlighted ? "bg-primary/20 text-primary" : "bg-white/5 text-foreground"
                }`}>
                  {getPlanIcon(plan.id)}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold">{getPrice(plan)}</span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/mo</span>
                    )}
                  </div>
                  {isYearly && getSavings(plan) && (
                    <p className="text-sm text-green-500 mt-1">{getSavings(plan)}</p>
                  )}
                  {isYearly && plan.price > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Billed ${plan.priceYearly}/year
                    </p>
                  )}
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Token Limit Highlight */}
                <div className="mt-6 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-muted-foreground mb-1">Monthly Tokens</div>
                  <div className="font-semibold text-lg">
                    {plan.limits.tokensPerMonth === -1 
                      ? "Unlimited" 
                      : plan.limits.tokensPerMonth.toLocaleString()}
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                  size="lg"
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={createCheckout.isPending}
                >
                  {plan.price === 0 ? "Get Started Free" : "Subscribe Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="container mt-20">
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground">Trusted by developers at</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
          <div className="text-2xl font-bold tracking-tight">Google</div>
          <div className="text-2xl font-bold tracking-tight">Microsoft</div>
          <div className="text-2xl font-bold tracking-tight">Amazon</div>
          <div className="text-2xl font-bold tracking-tight">Meta</div>
          <div className="text-2xl font-bold tracking-tight">OpenAI</div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mt-20 max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <FaqItem
            question="Can I switch plans anytime?"
            answer="Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, your new rate takes effect at the next billing cycle."
          />
          <FaqItem
            question="What happens if I exceed my token limit?"
            answer="You can purchase additional token packs at any time. Alternatively, upgrade to a higher plan for more monthly tokens at a better rate."
          />
          <FaqItem
            question="Do you offer refunds?"
            answer="We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund."
          />
          <FaqItem
            question="Is there a free trial for paid plans?"
            answer="Our Starter plan is free forever with 10,000 tokens/month. This allows you to test our API before committing to a paid plan."
          />
          <FaqItem
            question="How do I test payments?"
            answer="Use the test card number 4242 4242 4242 4242 with any future expiration date and any CVC to test the checkout flow."
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mt-20 text-center">
        <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-white/10">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Plan?</h2>
          <p className="text-muted-foreground mb-6">
            For high-volume usage, custom integrations, or enterprise requirements, contact our sales team.
          </p>
          <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10">
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="p-6 rounded-xl bg-card/50 border border-white/10">
      <h3 className="font-semibold mb-2">{question}</h3>
      <p className="text-sm text-muted-foreground">{answer}</p>
    </div>
  );
}
