import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function About() {
  return (
    <div className="container py-20 space-y-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">About OmniCortex</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          We are a collective of researchers, engineers, and visionaries dedicated to solving intelligence.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Our Story</h2>
          <div className="space-y-4 text-lg text-muted-foreground">
            <p>
              Founded in 2024, OmniCortex AI Labs emerged from a shared belief: that the path to general artificial intelligence lies not in scale alone, but in the elegant integration of diverse cognitive modalities.
            </p>
            <p>
              What started as a small research group has grown into a global laboratory, pushing the boundaries of what machines can learn, understand, and create. We are driven by curiosity and grounded in scientific rigor.
            </p>
            <p>
              Today, our models power applications across healthcare, education, creative industries, and scientific discovery, helping humanity solve its most complex challenges.
            </p>
          </div>
        </div>
        <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <img 
            src="/images/multimodal-tech.jpg" 
            alt="OmniCortex Lab" 
            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ValueCard 
          number="01"
          title="Scientific Rigor"
          description="We believe in reproducible research, transparent methodologies, and peer review as the foundation of progress."
        />
        <ValueCard 
          number="02"
          title="Ethical Alignment"
          description="We prioritize safety and human values in every model we train, ensuring AI remains a beneficial tool."
        />
        <ValueCard 
          number="03"
          title="Open Collaboration"
          description="Innovation thrives in the open. We contribute to the ecosystem through open-source models and datasets."
        />
      </div>

      {/* Team Section */}
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Leadership Team</h2>
          <p className="text-muted-foreground">The minds behind the cortex.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <TeamMember 
            name="Dr. Elena Vostok" 
            role="Chief Scientist" 
            image="/images/team-avatar-placeholder.jpg"
          />
          <TeamMember 
            name="Marcus Chen" 
            role="Head of Engineering" 
            image="/images/team-avatar-placeholder.jpg"
          />
          <TeamMember 
            name="Sarah O'Connor" 
            role="Head of Product" 
            image="/images/team-avatar-placeholder.jpg"
          />
          <TeamMember 
            name="David Okafor" 
            role="Research Lead" 
            image="/images/team-avatar-placeholder.jpg"
          />
        </div>
      </div>
    </div>
  );
}

function ValueCard({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <Card className="bg-card/30 border-white/5 backdrop-blur-sm hover:bg-card/50 transition-colors">
      <CardContent className="p-8 space-y-4">
        <div className="text-4xl font-mono font-bold text-primary/20">{number}</div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function TeamMember({ name, role, image }: { name: string, role: string, image: string }) {
  return (
    <div className="group text-center space-y-4">
      <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors duration-300">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
        />
      </div>
      <div>
        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{name}</h3>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}
