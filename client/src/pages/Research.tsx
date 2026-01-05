import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowUpRight, BookOpen, Users } from "lucide-react";
import { motion } from "framer-motion";
import { PageSEO } from "@/components/SEO";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const
    }
  }
};

export default function Research() {
  return (
    <>
      <PageSEO.Research />
      <div className="container py-20 space-y-20">
      <motion.div 
        className="max-w-4xl space-y-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium">
          <BookOpen className="w-4 h-4" />
          Publications
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          <span className="text-glow text-secondary">Research</span>
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Exploring the fundamental principles of intelligence through rigorous experimentation and theoretical analysis.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar Filters */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Topics</h3>
            <div className="flex flex-wrap gap-2">
              {["LLMs", "Computer Vision", "Reinforcement Learning", "Safety", "Multimodal", "Optimization", "Datasets"].map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105 hover:shadow-[0_0_15px_-5px_var(--primary)]">
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div 
            className="p-6 rounded-xl bg-primary/5 border border-primary/10 space-y-4 glow-card"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-primary">Join our Research Team</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              We are always looking for exceptional researchers to join our mission.
            </p>
            <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all">
              View Openings
            </Button>
          </motion.div>
        </motion.div>

        {/* Papers List */}
        <motion.div 
          className="lg:col-span-2 space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <ResearchPaper 
            title="Omni-1: A Unified Architecture for Multimodal Understanding"
            authors="E. Vostok, M. Chen, et al."
            date="Dec 2025"
            abstract="We present Omni-1, a transformer-based model capable of processing text, image, and audio inputs within a single shared embedding space, achieving state-of-the-art results on 14 benchmarks."
            tags={["Multimodal", "LLMs"]}
            featured
          />
          <ResearchPaper 
            title="Efficient Fine-Tuning of Large Models on Consumer Hardware"
            authors="S. O'Connor, D. Okafor"
            date="Nov 2025"
            abstract="A novel quantization technique that reduces memory requirements by 60% while maintaining 99% of model performance, enabling local deployment of 70B parameter models."
            tags={["Optimization", "Edge AI"]}
          />
          <ResearchPaper 
            title="Constitutional AI Alignment via Recursive Debate"
            authors="A. Silva, J. Doe"
            date="Oct 2025"
            abstract="Proposing a framework where AI models critique and refine their own outputs based on a set of constitutional principles, significantly reducing harmful outputs without human intervention."
            tags={["Safety", "Alignment"]}
          />
          <ResearchPaper 
            title="Neural Architecture Search for Vision Transformers"
            authors="M. Chen, K. Lee"
            date="Sep 2025"
            abstract="Automating the design of vision transformer architectures using evolutionary algorithms, resulting in models that are 2x faster and 15% more accurate than ViT-L."
            tags={["Computer Vision", "AutoML"]}
          />
        </motion.div>
      </div>
    </div>
    </>
  );
}

function ResearchPaper({ title, authors, date, abstract, tags, featured }: { title: string, authors: string, date: string, abstract: string, tags: string[], featured?: boolean }) {
  return (
    <motion.div variants={itemVariants}>
      <Card className={`glow-card glass-panel border-white/5 hover:border-primary/30 transition-all duration-300 group ${featured ? 'ring-1 ring-secondary/30' : ''}`}>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <CardTitle className="text-xl md:text-2xl group-hover:text-primary transition-colors leading-tight">
              {title}
            </CardTitle>
            <Button size="icon" variant="ghost" className="text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all">
              <ArrowUpRight className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
            <span>{authors}</span>
            <span>•</span>
            <span>{date}</span>
            {featured && (
              <Badge className="bg-secondary/20 text-secondary text-xs">Featured</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {abstract}
          </p>
        </CardContent>
        <CardFooter className="gap-2">
          {tags.map(tag => (
            <Badge key={tag} variant="outline" className="border-white/10 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
              {tag}
            </Badge>
          ))}
          <div className="ml-auto flex items-center gap-2 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <FileText className="w-4 h-4" />
            Read PDF
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
