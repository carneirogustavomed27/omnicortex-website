import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  Send, 
  Sparkles, 
  Zap, 
  Brain, 
  Code, 
  MessageSquare, 
  Image as ImageIcon,
  Loader2,
  Copy,
  RotateCcw,
  Settings2,
  ChevronDown,
  Lock,
  Unlock
} from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { PageSEO } from "@/components/SEO";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Model {
  id: string;
  name: string;
  description: string;
  contextWindow: string;
  speed: string;
  capabilities: string[];
  tier: "free" | "starter" | "pro" | "business" | "enterprise";
  icon: React.ReactNode;
}

const models: Model[] = [
  {
    id: "omnicortex-7b",
    name: "OmniCortex-7B",
    description: "Fast and efficient for everyday tasks",
    contextWindow: "32K",
    speed: "Ultra Fast",
    capabilities: ["Text Generation", "Q&A", "Summarization"],
    tier: "free",
    icon: <Zap className="w-5 h-5" />
  },
  {
    id: "omnicortex-32b",
    name: "OmniCortex-32B",
    description: "Balanced performance for complex reasoning",
    contextWindow: "64K",
    speed: "Fast",
    capabilities: ["Text Generation", "Code", "Analysis", "Math"],
    tier: "starter",
    icon: <Brain className="w-5 h-5" />
  },
  {
    id: "omnicortex-70b",
    name: "OmniCortex-70B",
    description: "Advanced model for professional use",
    contextWindow: "128K",
    speed: "Moderate",
    capabilities: ["Text Generation", "Code", "Analysis", "Math", "Research"],
    tier: "pro",
    icon: <Sparkles className="w-5 h-5" />
  },
  {
    id: "omnicortex-vision",
    name: "OmniCortex Vision",
    description: "Multimodal AI for image understanding",
    contextWindow: "128K",
    speed: "Moderate",
    capabilities: ["Image Analysis", "OCR", "Visual Q&A", "Image Generation"],
    tier: "business",
    icon: <ImageIcon className="w-5 h-5" />
  },
  {
    id: "omnicortex-100b",
    name: "OmniCortex-100B",
    description: "Our most powerful model for enterprise",
    contextWindow: "256K",
    speed: "Standard",
    capabilities: ["All Capabilities", "Custom Fine-tuning", "Priority Processing"],
    tier: "enterprise",
    icon: <Code className="w-5 h-5" />
  }
];

const samplePrompts = [
  {
    category: "Creative",
    prompts: [
      "Write a short story about an AI that discovers emotions",
      "Create a poem about the future of technology",
      "Generate creative names for a new AI startup"
    ]
  },
  {
    category: "Code",
    prompts: [
      "Write a Python function to sort a list using quicksort",
      "Create a React component for a responsive navbar",
      "Explain the difference between REST and GraphQL"
    ]
  },
  {
    category: "Analysis",
    prompts: [
      "Analyze the pros and cons of renewable energy",
      "Compare different machine learning frameworks",
      "Summarize the key points of transformer architecture"
    ]
  }
];

export default function Playground() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model>(models[0]);
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([1024]);
  const [showSettings, setShowSettings] = useState(false);
  const [freeCredits, setFreeCredits] = useState(1000);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response based on the selected model
    const responses: Record<string, string[]> = {
      "omnicortex-7b": [
        `I understand you're asking about "${userMessage.slice(0, 50)}..."\n\nAs OmniCortex-7B, I'm optimized for quick, efficient responses. Here's my analysis:\n\n**Key Points:**\n1. This is a demonstration of our AI capabilities\n2. The full version offers much more detailed responses\n3. You can upgrade to access advanced models\n\nWould you like me to elaborate on any specific aspect?`,
        `Great question! Let me break this down for you:\n\n**Understanding the Context:**\nYour query touches on an interesting topic. While I'm the lightweight model, I can still provide valuable insights.\n\n**My Response:**\nThe key to understanding this lies in examining the fundamental principles involved. Consider the following perspectives...\n\n*Note: Upgrade to OmniCortex-32B for more comprehensive analysis.*`
      ],
      "omnicortex-32b": [
        `# Comprehensive Analysis\n\nThank you for your query regarding "${userMessage.slice(0, 30)}..."\n\n## Overview\nAs OmniCortex-32B, I can provide detailed analysis with enhanced reasoning capabilities.\n\n## Key Insights\n1. **Primary Consideration**: The fundamental aspects of your question relate to...\n2. **Secondary Factors**: We should also consider...\n3. **Implications**: This leads us to understand that...\n\n## Conclusion\nBased on my analysis, I recommend...\n\n---\n*This response demonstrates our Pro-tier capabilities. Upgrade for even more advanced features.*`
      ]
    };

    const modelResponses = responses[selectedModel.id] || responses["omnicortex-7b"];
    return modelResponses[Math.floor(Math.random() * modelResponses.length)];
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    if (freeCredits <= 0 && selectedModel.tier === "free") {
      toast.error("Free credits exhausted! Please upgrade to continue.");
      return;
    }

    if (selectedModel.tier !== "free") {
      toast.info("This model requires a subscription. Showing demo response.", {
        action: {
          label: "Upgrade",
          onClick: () => window.location.href = "/pricing"
        }
      });
    }

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Deduct credits for free tier
    if (selectedModel.tier === "free") {
      setFreeCredits(prev => Math.max(0, prev - 10));
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      const response = await simulateResponse(input);
      
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error("Failed to generate response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const clearChat = () => {
    setMessages([]);
    toast.success("Chat cleared!");
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "free": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "starter": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "pro": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "business": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "enterprise": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <>
      <PageSEO.Playground />
      <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d1025] to-[#0a0a1a]">
        {/* Hero Section */}
        <section className="relative pt-24 pb-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.1),transparent_70%)]" />
          
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Playground
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Test Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">AI Models</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Experience the power of OmniCortex AI firsthand. Try different models, 
                adjust parameters, and see the results in real-time.
              </p>
            </motion.div>

            {/* Credits Display */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-400">Free Credits:</span>
                  <span className="text-white font-semibold">{freeCredits.toLocaleString()}</span>
                </div>
                <div className="w-px h-4 bg-white/20" />
                <Link href="/pricing">
                  <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                    Get More Credits
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Playground */}
        <section className="pb-20">
          <div className="container">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Sidebar - Model Selection & Settings */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-1 space-y-4"
              >
                {/* Model Selection */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Brain className="w-5 h-5 text-cyan-400" />
                      Select Model
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModel(model)}
                        className={`w-full p-3 rounded-lg border transition-all text-left ${
                          selectedModel.id === model.id
                            ? "bg-cyan-500/20 border-cyan-500/50"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-cyan-400">{model.icon}</span>
                            <span className="text-white font-medium text-sm">{model.name}</span>
                          </div>
                          {model.tier !== "free" ? (
                            <Lock className="w-3 h-3 text-gray-500" />
                          ) : (
                            <Unlock className="w-3 h-3 text-green-400" />
                          )}
                        </div>
                        <p className="text-gray-500 text-xs mb-2">{model.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs ${getTierColor(model.tier)}`}>
                            {model.tier}
                          </Badge>
                          <span className="text-gray-500 text-xs">{model.contextWindow}</span>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>

                {/* Settings */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                  <CardHeader className="pb-3">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="flex items-center justify-between w-full"
                    >
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-purple-400" />
                        Parameters
                      </CardTitle>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showSettings ? "rotate-180" : ""}`} />
                    </button>
                  </CardHeader>
                  <AnimatePresence>
                    {showSettings && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <label className="text-gray-400 text-sm">Temperature</label>
                              <span className="text-white text-sm">{temperature[0]}</span>
                            </div>
                            <Slider
                              value={temperature}
                              onValueChange={setTemperature}
                              min={0}
                              max={2}
                              step={0.1}
                              className="w-full"
                            />
                            <p className="text-gray-500 text-xs mt-1">Higher = more creative</p>
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <label className="text-gray-400 text-sm">Max Tokens</label>
                              <span className="text-white text-sm">{maxTokens[0]}</span>
                            </div>
                            <Slider
                              value={maxTokens}
                              onValueChange={setMaxTokens}
                              min={256}
                              max={4096}
                              step={256}
                              className="w-full"
                            />
                            <p className="text-gray-500 text-xs mt-1">Maximum response length</p>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>

                {/* Sample Prompts */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-green-400" />
                      Try These
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="Creative" className="w-full">
                      <TabsList className="w-full bg-white/5 mb-3">
                        {samplePrompts.map((cat) => (
                          <TabsTrigger 
                            key={cat.category} 
                            value={cat.category}
                            className="flex-1 text-xs data-[state=active]:bg-cyan-500/20"
                          >
                            {cat.category}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {samplePrompts.map((cat) => (
                        <TabsContent key={cat.category} value={cat.category} className="space-y-2">
                          {cat.prompts.map((prompt, idx) => (
                            <button
                              key={idx}
                              onClick={() => setInput(prompt)}
                              className="w-full p-2 text-left text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              {prompt}
                            </button>
                          ))}
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Main Chat Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-3"
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl h-[700px] flex flex-col">
                  {/* Chat Header */}
                  <CardHeader className="border-b border-white/10 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                          {selectedModel.icon}
                        </div>
                        <div>
                          <CardTitle className="text-white">{selectedModel.name}</CardTitle>
                          <CardDescription className="text-gray-500">
                            {selectedModel.contextWindow} context • {selectedModel.speed}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearChat}
                          className="text-gray-400 hover:text-white"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Clear
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages Area */}
                  <ScrollArea className="flex-1 p-4">
                    {messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8 text-cyan-400" />
                          </div>
                          <h3 className="text-white font-semibold mb-2">Start a Conversation</h3>
                          <p className="text-gray-500 text-sm max-w-md">
                            Type a message below or select a sample prompt to begin exploring 
                            the capabilities of {selectedModel.name}.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <AnimatePresence>
                          {messages.map((message, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[80%] p-4 rounded-2xl ${
                                  message.role === "user"
                                    ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white"
                                    : "bg-white/10 text-gray-200"
                                }`}
                              >
                                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                                  <span className="text-xs opacity-60">
                                    {message.timestamp.toLocaleTimeString()}
                                  </span>
                                  {message.role === "assistant" && (
                                    <button
                                      onClick={() => copyToClipboard(message.content)}
                                      className="text-xs opacity-60 hover:opacity-100 flex items-center gap-1"
                                    >
                                      <Copy className="w-3 h-3" />
                                      Copy
                                    </button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        {isLoading && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                          >
                            <div className="bg-white/10 p-4 rounded-2xl flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                              <span className="text-gray-400 text-sm">Generating response...</span>
                            </div>
                          </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="p-4 border-t border-white/10">
                    <div className="flex gap-3">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Message ${selectedModel.name}...`}
                        className="flex-1 min-h-[60px] max-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-gray-500 resize-none"
                      />
                      <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !input.trim()}
                        className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-6"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-gray-500 text-xs mt-2 text-center">
                      Press Enter to send • Shift+Enter for new line • 
                      <span className="text-cyan-400"> {selectedModel.tier === "free" ? "Free tier" : "Requires subscription"}</span>
                    </p>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 border-t border-white/10">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready for <span className="text-cyan-400">Unlimited Access</span>?
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Unlock all models, get priority processing, and access advanced features 
                with our subscription plans.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/pricing">
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-6 text-lg">
                    View Pricing Plans
                  </Button>
                </Link>
                <Link href="/models">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg">
                    Explore All Models
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
    </>
  );
}
