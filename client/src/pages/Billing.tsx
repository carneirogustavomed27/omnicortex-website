import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ExternalLink, CheckCircle, AlertCircle, Zap, Package } from "lucide-react";
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Link, useSearch } from "wouter";
import { toast } from "sonner";

export default function Billing() {
  const { user } = useAuth();
  const { data: subscription, isLoading, refetch } = trpc.subscription.getStatus.useQuery();
  const getPortalUrl = trpc.subscription.getPortalUrl.useMutation();
  const cancelSubscription = trpc.subscription.cancel.useMutation();
  
  // Parse URL params for success/cancel messages
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const success = params.get("success");
  const credits = params.get("credits");
  const canceled = params.get("canceled");

  useEffect(() => {
    document.title = "Billing - OmniCortex AI Labs";
    
    if (success === "true") {
      toast.success("Subscription activated successfully!");
      refetch();
    }
    if (credits === "true") {
      toast.success("Tokens added to your account!");
      refetch();
    }
    if (canceled === "true") {
      toast.info("Checkout was canceled");
    }
  }, [success, credits, canceled, refetch]);

  const handleManageSubscription = async () => {
    try {
      const result = await getPortalUrl.mutateAsync();
      window.open(result.url, "_blank");
    } catch (error) {
      toast.error("Failed to open billing portal");
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You'll retain access until the end of your billing period.")) {
      return;
    }
    
    try {
      await cancelSubscription.mutateAsync();
      toast.success("Subscription will be canceled at the end of the billing period");
      refetch();
    } catch (error) {
      toast.error("Failed to cancel subscription");
    }
  };

  const isActive = subscription?.status === "active";
  const isPro = subscription?.plan !== "free";

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground mt-1">
            Manage your subscription, view invoices, and purchase additional tokens.
          </p>
        </div>

        {/* Current Plan */}
        <Card className={isActive && isPro ? "border-primary/50" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isActive && isPro ? "bg-primary/20" : "bg-white/5"}`}>
                  <CreditCard className={`w-5 h-5 ${isActive && isPro ? "text-primary" : ""}`} />
                </div>
                <div>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Your active subscription</CardDescription>
                </div>
              </div>
              <Badge className={isActive ? "bg-green-500/20 text-green-500 border-green-500/30" : "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"}>
                {isActive ? (
                  <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                ) : (
                  <><AlertCircle className="w-3 h-3 mr-1" /> Free Tier</>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold capitalize">
                  {subscription?.plan || "Starter"} Plan
                </div>
                {subscription?.currentPeriodEnd && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {subscription.cancelAtPeriodEnd 
                      ? `Cancels on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                      : `Renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                    }
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {isPro && isActive ? (
                  <>
                    <Button variant="outline" onClick={handleManageSubscription}>
                      Manage Subscription <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                    {!subscription?.cancelAtPeriodEnd && (
                      <Button variant="destructive" onClick={handleCancelSubscription}>
                        Cancel
                      </Button>
                    )}
                  </>
                ) : (
                  <Link href="/pricing">
                    <Button>
                      Upgrade Plan
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Balance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <CardTitle>Token Balance</CardTitle>
                <CardDescription>Available tokens for API usage</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">
                  {subscription?.tokenBalance?.toLocaleString() || "10,000"}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {subscription?.tokensUsedThisMonth?.toLocaleString() || 0} tokens used this month
                </p>
              </div>
              <Link href="/pricing">
                <Button variant="outline">
                  <Package className="w-4 h-4 mr-2" />
                  Buy More Tokens
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Credit Packs */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Token Packs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CreditPackCard
              name="Small Pack"
              tokens={500000}
              price={9.99}
              savings=""
            />
            <CreditPackCard
              name="Medium Pack"
              tokens={2000000}
              price={34.99}
              savings="Save 12%"
              highlighted
            />
            <CreditPackCard
              name="Large Pack"
              tokens={10000000}
              price={149.99}
              savings="Save 25%"
            />
          </div>
        </div>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your recent transactions and invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No payment history</p>
              <p className="text-sm">Your transactions will appear here</p>
            </div>
          </CardContent>
        </Card>

        {/* Test Mode Notice */}
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-500">Test Mode Active</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Payments are in test mode. Use card number <code className="bg-black/30 px-2 py-0.5 rounded">4242 4242 4242 4242</code> with any future expiration date and CVC to test.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function CreditPackCard({ 
  name, 
  tokens, 
  price, 
  savings, 
  highlighted 
}: { 
  name: string; 
  tokens: number; 
  price: number; 
  savings: string;
  highlighted?: boolean;
}) {
  const buyCredits = trpc.subscription.buyCredits.useMutation();

  const handleBuy = async () => {
    try {
      toast.loading("Preparing checkout...");
      const creditPackId = name.toLowerCase().includes("small") 
        ? "credits-small" 
        : name.toLowerCase().includes("medium") 
          ? "credits-medium" 
          : "credits-large";
      
      const result = await buyCredits.mutateAsync({ creditPackId });
      toast.dismiss();
      toast.success("Redirecting to checkout...");
      window.open(result.url, "_blank");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to create checkout");
    }
  };

  return (
    <Card className={highlighted ? "border-primary/50" : ""}>
      <CardContent className="pt-6">
        <div className="text-center">
          <h3 className="font-semibold">{name}</h3>
          <div className="text-3xl font-bold mt-2">{tokens.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">tokens</p>
          <div className="text-xl font-semibold mt-4">${price}</div>
          {savings && (
            <Badge className="mt-2 bg-green-500/20 text-green-500 border-green-500/30">
              {savings}
            </Badge>
          )}
          <Button 
            className="w-full mt-4" 
            variant={highlighted ? "default" : "outline"}
            onClick={handleBuy}
            disabled={buyCredits.isPending}
          >
            Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
