import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Key, BarChart3, CreditCard, ArrowUpRight, Copy, Eye, EyeOff, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = trpc.dashboard.getStats.useQuery();
  const { data: subscription } = trpc.subscription.getStatus.useQuery();

  useEffect(() => {
    document.title = "Dashboard - OmniCortex AI Labs";
  }, []);

  const tokenUsagePercent = stats && stats.tokenLimit
    ? Math.min((stats.tokensUsedThisMonth / stats.tokenLimit) * 100, 100)
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name || "Developer"}</h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your API usage and account status.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Token Balance"
            value={stats?.tokenBalance?.toLocaleString() || "10,000"}
            description="Available tokens"
            icon={<Zap className="w-5 h-5 text-primary" />}
          />
          <StatsCard
            title="Tokens Used"
            value={stats?.tokensUsedThisMonth?.toLocaleString() || "0"}
            description="This month"
            icon={<BarChart3 className="w-5 h-5 text-blue-500" />}
          />
          <StatsCard
            title="Current Plan"
            value={stats?.planName || "Starter"}
            description={subscription?.status === "active" ? "Active" : "Free tier"}
            icon={<CreditCard className="w-5 h-5 text-green-500" />}
            badge={subscription?.status === "active" ? "PRO" : undefined}
          />
          <StatsCard
            title="API Calls"
            value={stats?.apiCallsThisMonth?.toLocaleString() || "0"}
            description="This month"
            icon={<Key className="w-5 h-5 text-purple-500" />}
          />
        </div>

        {/* Usage Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Token Usage</CardTitle>
                <CardDescription>
                  {stats?.tokensUsedThisMonth?.toLocaleString() || 0} / {stats?.tokenLimit?.toLocaleString() || "10,000"} tokens used this month
                </CardDescription>
              </div>
              <Link href="/pricing">
                <Button variant="outline" size="sm">
                  Upgrade Plan <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={tokenUsagePercent} className="h-3" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{tokenUsagePercent.toFixed(1)}% used</span>
              <span>{(100 - tokenUsagePercent).toFixed(1)}% remaining</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* API Keys Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Keys
              </CardTitle>
              <CardDescription>
                Manage your API keys for accessing OmniCortex models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApiKeyDisplay />
              <Button className="w-full mt-4" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create New API Key
              </Button>
            </CardContent>
          </Card>

          {/* Quick Start */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
              <CardDescription>
                Get started with OmniCortex API in minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-black/50 font-mono text-sm overflow-x-auto">
                <pre className="text-green-400">
{`curl -X POST https://api.omnicortex.ai/v1/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "omnicortex-7b", "messages": [...]}'`}
                </pre>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  View Documentation
                </Button>
                <Button variant="outline" className="flex-1">
                  API Playground
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest API calls and usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">Start making API calls to see your usage history</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatsCard({ 
  title, 
  value, 
  description, 
  icon, 
  badge 
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode;
  badge?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-white/5">
            {icon}
          </div>
          {badge && (
            <Badge className="bg-primary/20 text-primary border-primary/30">
              {badge}
            </Badge>
          )}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ApiKeyDisplay() {
  const [showKey, setShowKey] = useState(false);
  const demoKey = "sk-omni-xxxxxxxxxxxxxxxxxxxx";

  const copyKey = () => {
    navigator.clipboard.writeText(demoKey);
    toast.success("API key copied to clipboard");
  };

  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-black/50 font-mono text-sm">
      <span className="flex-1 truncate">
        {showKey ? demoKey : "sk-omni-••••••••••••••••••••"}
      </span>
      <Button variant="ghost" size="icon" onClick={() => setShowKey(!showKey)}>
        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </Button>
      <Button variant="ghost" size="icon" onClick={copyKey}>
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  );
}
