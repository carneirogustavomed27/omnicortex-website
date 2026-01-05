import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  Sparkles, 
  Key, 
  BookOpen, 
  Zap, 
  ArrowRight,
  Copy,
  ExternalLink,
  Rocket,
  Shield,
  HeadphonesIcon,
  Gift
} from "lucide-react";
import { Link, useSearch } from "wouter";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import confetti from "canvas-confetti";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  link: string;
  completed: boolean;
}

export default function CheckoutSuccess() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const sessionId = params.get("session_id");
  const plan = params.get("plan") || "Pro";
  
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [apiKey, setApiKey] = useState("sk-omni-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
  
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 1,
      title: "Get Your API Key",
      description: "Your unique API key is ready. Copy it to start integrating.",
      icon: <Key className="w-6 h-6" />,
      action: "Copy API Key",
      link: "/dashboard/api-keys",
      completed: false
    },
    {
      id: 2,
      title: "Read the Documentation",
      description: "Learn how to integrate OmniCortex AI into your applications.",
      icon: <BookOpen className="w-6 h-6" />,
      action: "View Docs",
      link: "/docs",
      completed: false
    },
    {
      id: 3,
      title: "Try the Playground",
      description: "Test different models and parameters in our interactive playground.",
      icon: <Zap className="w-6 h-6" />,
      action: "Open Playground",
      link: "/playground",
      completed: false
    },
    {
      id: 4,
      title: "Join Our Community",
      description: "Connect with other developers and get support from our team.",
      icon: <HeadphonesIcon className="w-6 h-6" />,
      action: "Join Discord",
      link: "https://discord.gg/omnicortex",
      completed: false
    }
  ]);

  useEffect(() => {
    document.title = "Welcome to OmniCortex! | Subscription Confirmed";
    
    // Trigger confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#00d4ff', '#a855f7', '#22c55e']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#00d4ff', '#a855f7', '#22c55e']
      });
    }, 250);

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success("API Key copied to clipboard!");
    markStepComplete(1);
  };

  const markStepComplete = (stepId: number) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));
    setCurrentStep(prev => Math.max(prev, stepId));
  };

  const getPlanDetails = () => {
    const plans: Record<string, { credits: string; models: string; support: string; color: string }> = {
      Starter: { credits: "100,000", models: "OmniCortex-7B", support: "Email", color: "from-blue-500 to-blue-600" },
      Pro: { credits: "500,000", models: "All models up to 32B", support: "Priority", color: "from-purple-500 to-purple-600" },
      Business: { credits: "2,000,000", models: "All models including Vision", support: "Dedicated", color: "from-orange-500 to-orange-600" },
      Enterprise: { credits: "Unlimited", models: "All models + Custom", support: "24/7 Dedicated", color: "from-red-500 to-red-600" }
    };
    return plans[plan] || plans.Pro;
  };

  const planDetails = getPlanDetails();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d1025] to-[#0a0a1a]">
        {/* Success Hero */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.15),transparent_70%)]" />
          
          <div className="container relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/30 rounded-full blur-2xl animate-pulse" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Payment Successful
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">OmniCortex</span>!
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                Your {plan} Plan is now active. You have access to powerful AI models 
                and {planDetails.credits} API credits per month.
              </p>

              {/* Plan Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-md mx-auto"
              >
                <Card className={`bg-gradient-to-br ${planDetails.color} border-0 text-white`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-white/80 text-sm">Your Plan</p>
                        <p className="text-2xl font-bold">{plan} Plan</p>
                      </div>
                      <Gift className="w-10 h-10 text-white/80" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-white/80 text-xs">Credits/mo</p>
                        <p className="font-semibold">{planDetails.credits}</p>
                      </div>
                      <div>
                        <p className="text-white/80 text-xs">Models</p>
                        <p className="font-semibold text-sm">{planDetails.models}</p>
                      </div>
                      <div>
                        <p className="text-white/80 text-xs">Support</p>
                        <p className="font-semibold">{planDetails.support}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Onboarding Steps */}
        <section className="py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-white mb-2">Get Started in Minutes</h2>
                <p className="text-gray-400">Follow these steps to start using OmniCortex AI</p>
                <div className="mt-4 max-w-md mx-auto">
                  <Progress value={progress} className="h-2" />
                  <p className="text-gray-500 text-sm mt-2">Setup Progress: {progress}%</p>
                </div>
              </div>

              {/* API Key Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mb-8"
              >
                <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/20">
                        <Key className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white">Your API Key</CardTitle>
                        <CardDescription className="text-gray-400">
                          Use this key to authenticate your API requests
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <code className="flex-1 p-4 bg-black/50 rounded-lg text-cyan-400 font-mono text-sm overflow-x-auto">
                        {apiKey}
                      </code>
                      <Button
                        onClick={copyApiKey}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <p className="text-gray-500 text-sm mt-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Keep this key secure. You can regenerate it anytime from your dashboard.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Steps Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                  >
                    <Card className={`bg-white/5 border-white/10 hover:bg-white/10 transition-all h-full ${
                      step.completed ? "border-green-500/50" : ""
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${
                            step.completed 
                              ? "bg-green-500/20 text-green-400" 
                              : "bg-white/10 text-gray-400"
                          }`}>
                            {step.completed ? <CheckCircle2 className="w-6 h-6" /> : step.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-white font-semibold">{step.title}</h3>
                              {step.completed && (
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                  Done
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm mb-4">{step.description}</p>
                            <Link href={step.link}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-white/20 text-white hover:bg-white/10"
                                onClick={() => markStepComplete(step.id)}
                              >
                                {step.action}
                                {step.link.startsWith("http") ? (
                                  <ExternalLink className="w-3 h-3 ml-2" />
                                ) : (
                                  <ArrowRight className="w-3 h-3 ml-2" />
                                )}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-16 border-t border-white/10">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-white mb-8">Quick Actions</h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-6 text-lg">
                    <Rocket className="w-5 h-5 mr-2" />
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/playground">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg">
                    <Zap className="w-5 h-5 mr-2" />
                    Try Playground
                  </Button>
                </Link>
                <Link href="/models">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Explore Models
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Support Banner */}
        <section className="py-12 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-t border-b border-white/10">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/10">
                  <HeadphonesIcon className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Need Help Getting Started?</h3>
                  <p className="text-gray-400">Our support team is here to help you succeed.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  View Documentation
                </Button>
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
