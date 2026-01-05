import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Star, GitFork, Terminal } from "lucide-react";

export default function Models() {
  return (
    <div className="container py-20 space-y-20">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Models & Datasets</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Open-source foundation models and high-quality datasets for the community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ModelCard 
          name="OmniCortex-7B"
          type="Language Model"
          description="A highly efficient 7B parameter model optimized for reasoning and coding tasks. Outperforms Llama-2-13B on standard benchmarks."
          downloads="1.2M"
          stars="15k"
          tags={["NLP", "Coding", "Reasoning"]}
        />
        <ModelCard 
          name="OmniVision-Pro"
          type="Multimodal"
          description="State-of-the-art vision-language model capable of detailed image captioning, visual QA, and object detection."
          downloads="850k"
          stars="12k"
          tags={["Vision", "Multimodal"]}
        />
        <ModelCard 
          name="Cortex-Audio-2"
          type="Audio Generation"
          description="High-fidelity text-to-audio generation model supporting sound effects, music, and speech in 40+ languages."
          downloads="500k"
          stars="8k"
          tags={["Audio", "TTS", "Music"]}
        />
        <ModelCard 
          name="Omni-Instruct-Dataset"
          type="Dataset"
          description="A curated dataset of 5M high-quality instruction-following pairs, filtered for safety and educational value."
          downloads="2.5M"
          stars="18k"
          tags={["Dataset", "SFT", "RLHF"]}
        />
        <ModelCard 
          name="CodeCortex-34B"
          type="Code Model"
          description="Specialized coding model trained on 1T tokens of code across 50+ programming languages. Supports FIM and long context."
          downloads="300k"
          stars="5k"
          tags={["Code", "Python", "JavaScript"]}
        />
        <ModelCard 
          name="Safety-Bench-v2"
          type="Benchmark"
          description="Comprehensive safety evaluation suite for testing LLM robustness against jailbreaks, bias, and toxicity."
          downloads="100k"
          stars="3k"
          tags={["Safety", "Eval"]}
        />
      </div>

      {/* Hugging Face CTA */}
      <div className="rounded-3xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/10 p-12 text-center space-y-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold">Explore our full library on Hugging Face</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
            Access all our models, datasets, and demos directly on the Hugging Face Hub. Join the community discussion and contribute.
          </p>
          <Button size="lg" className="mt-8 rounded-full px-8 bg-[#FFD21E] text-black hover:bg-[#FFD21E]/90 font-bold">
            Visit Hugging Face Organization
          </Button>
        </div>
      </div>
    </div>
  );
}

function ModelCard({ name, type, description, downloads, stars, tags }: { name: string, type: string, description: string, downloads: string, stars: string, tags: string[] }) {
  return (
    <Card className="glass-panel border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
            {type}
          </Badge>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4" /> {downloads}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" /> {stars}
            </div>
          </div>
        </div>
        <CardTitle className="text-2xl">{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-start">
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge key={tag} variant="outline" className="border-white/10 text-muted-foreground text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="w-full flex gap-2 pt-2">
          <Button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10">
            <Terminal className="w-4 h-4 mr-2" /> Try Demo
          </Button>
          <Button className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20">
            <GitFork className="w-4 h-4 mr-2" /> Fine-tune
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
