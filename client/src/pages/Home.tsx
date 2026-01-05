import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Cpu, Globe, ShieldCheck, Zap, Network, Layers } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "OmniCortex AI Labs | Advanced Multimodal Artificial Intelligence Research";
  }, []);

  return (
    <div className="flex flex-col gap-20 md:gap-32 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-30 animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] opacity-20" />
        
        <div className="container relative z-10 flex flex-col items-center text-center gap-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Introducing OmniCortex 1.0 - Next Gen AI
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 max-w-4xl">
            Universal Intelligence <br />
            <span className="text-glow text-primary/90">Awakened</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Pioneering the future of <strong>Artificial Intelligence</strong> with advanced <strong>Multimodal AI</strong> systems, <strong>Deep Learning</strong>, and <strong>Neural Networks</strong> that think, learn, and adapt.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link href="/models">
              <Button size="lg" className="text-lg px-8 h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_-10px_var(--primary)] transition-all hover:scale-105 w-full sm:w-auto">
                Explore Models <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/research">
              <Button variant="outline" size="lg" className="text-lg px-8 h-14 rounded-full border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105 w-full sm:w-auto">
                Read Research
              </Button>
            </Link>
          </div>

          {/* Abstract UI Element */}
          <div className="mt-16 w-full max-w-5xl aspect-[16/9] rounded-xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl overflow-hidden relative group animate-in fade-in zoom-in duration-1000 delay-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 opacity-50" />
            <img 
              src="/images/hero-bg.jpg" 
              alt="OmniCortex Neural Interface Visualization" 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 scale-105 group-hover:scale-100"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-2 border-primary/30 flex items-center justify-center backdrop-blur-sm group-hover:border-primary/80 transition-colors duration-500">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                  <Cpu className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>
            
            {/* Floating Data Cards */}
            <div className="absolute top-10 left-10 p-4 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md hidden md:block animate-bounce duration-[3000ms]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-mono text-primary">System Optimal</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground font-mono">Latency: 12ms</div>
            </div>
            
            <div className="absolute bottom-10 right-10 p-4 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md hidden md:block animate-bounce duration-[4000ms]">
              <div className="flex items-center gap-3">
                <ActivityIcon />
                <span className="text-xs font-mono text-secondary">Processing</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground font-mono">Tokens: 1.2M/s</div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas Section */}
      <section className="container">
        <div className="flex flex-col gap-4 mb-12 md:text-center md:items-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Core Research Areas</h2>
          <p className="text-muted-foreground max-w-2xl text-lg">
            We are pushing the boundaries of what's possible in <strong>Generative AI</strong> and <strong>Machine Learning</strong> across multiple disciplines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Globe className="w-8 h-8 text-primary" />}
            title="Large Language Models"
            description="Developing state-of-the-art LLMs and Foundation Models with enhanced reasoning capabilities and trillion-parameter scale context understanding."
          />
          <FeatureCard 
            icon={<Layers className="w-8 h-8 text-secondary" />}
            title="Multimodal Systems"
            description="Unified architectures that seamlessly process and generate text, image, audio, and video in real-time using advanced Neural Networks."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-green-400" />}
            title="AI Safety & Alignment"
            description="Rigorous research into interpretability, robustness, and ethical alignment of autonomous systems to ensure safe Artificial Intelligence."
          />
          <FeatureCard 
            icon={<Network className="w-8 h-8 text-purple-400" />}
            title="Reinforcement Learning"
            description="Creating agents that learn complex behaviors and decision-making strategies in dynamic environments through Deep Reinforcement Learning."
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-yellow-400" />}
            title="Edge Intelligence"
            description="Optimizing high-performance models for deployment on resource-constrained devices and local hardware."
          />
          <FeatureCard 
            icon={<Cpu className="w-8 h-8 text-blue-400" />}
            title="AutoML & Infrastructure"
            description="Automating the machine learning pipeline to accelerate research and deployment cycles for scalable AI solutions."
          />
        </div>
      </section>

      {/* Mission Section */}
      <section className="container">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-card/30 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-16 flex flex-col justify-center gap-6">
              <h2 className="text-3xl md:text-4xl font-bold">Democratizing Universal Intelligence</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At OmniCortex AI Labs, we believe that advanced <strong>Artificial Intelligence</strong> should be accessible, transparent, and beneficial to all of humanity. Our <strong>Open Source AI</strong> commitment ensures that our breakthroughs empower developers and researchers worldwide.
              </p>
              <ul className="space-y-4 mt-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <span className="text-foreground/90">Open weights and datasets</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <span className="text-foreground/90">Transparent research methodologies</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <span className="text-foreground/90">Community-driven development</span>
                </li>
              </ul>
              <div className="pt-4">
                <Link href="/about">
                  <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                    Read Our Manifesto
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative min-h-[400px] lg:min-h-full bg-black/50">
              <img 
                src="/images/about-ai-research.jpg" 
                alt="AI Research Laboratory" 
                className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent lg:bg-gradient-to-l" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container text-center py-20">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to build with OmniCortex?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of developers and researchers pushing the boundaries of what's possible with <strong>Generative AI</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/models">
              <Button size="lg" className="rounded-full px-8 bg-white text-black hover:bg-white/90 font-semibold">
                Get Started
              </Button>
            </Link>
            <a href="https://huggingface.co/OmniCortex" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="rounded-full px-8 border-white/20 hover:bg-white/10">
                View Documentation
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="glass-panel border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 group">
      <CardHeader>
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
          {icon}
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

function ActivityIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 text-secondary"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
