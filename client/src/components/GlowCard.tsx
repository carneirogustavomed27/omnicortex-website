import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef, MouseEvent } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "cyan" | "purple" | "mixed";
  intensity?: "low" | "medium" | "high";
  enableTilt?: boolean;
}

export function GlowCard({ 
  children, 
  className = "", 
  glowColor = "cyan",
  intensity = "medium",
  enableTilt = true
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse position for glow effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animation for mouse tracking
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  
  // Transform for 3D tilt effect
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-7, 7]);
  
  // Glow color configurations
  const glowColors = {
    cyan: {
      primary: "rgba(0, 212, 255, 0.6)",
      secondary: "rgba(0, 212, 255, 0.3)",
      border: "rgba(0, 212, 255, 0.5)",
    },
    purple: {
      primary: "rgba(123, 44, 191, 0.6)",
      secondary: "rgba(123, 44, 191, 0.3)",
      border: "rgba(123, 44, 191, 0.5)",
    },
    mixed: {
      primary: "rgba(0, 212, 255, 0.5)",
      secondary: "rgba(123, 44, 191, 0.4)",
      border: "rgba(0, 212, 255, 0.4)",
    },
  };
  
  // Intensity configurations
  const intensityConfig = {
    low: { blur: 20, spread: 30, scale: 1.01 },
    medium: { blur: 30, spread: 50, scale: 1.02 },
    high: { blur: 40, spread: 70, scale: 1.03 },
  };
  
  const colors = glowColors[glowColor];
  const config = intensityConfig[intensity];
  
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Normalize to -0.5 to 0.5
    const normalizedX = (e.clientX - centerX) / rect.width;
    const normalizedY = (e.clientY - centerY) / rect.height;
    
    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      whileHover={{
        scale: config.scale,
        boxShadow: `
          0 0 ${config.blur}px ${colors.primary},
          0 0 ${config.spread}px ${colors.secondary},
          0 0 ${config.spread * 1.5}px ${colors.secondary},
          inset 0 0 20px rgba(255, 255, 255, 0.05)
        `,
        borderColor: colors.border,
      }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-card/60 backdrop-blur-md transition-colors ${className}`}
    >
      {/* Animated gradient overlay on hover */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(
            600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            ${colors.primary.replace("0.6", "0.15")},
            transparent 40%
          )`,
        }}
        whileHover={{ opacity: 1 }}
      />
      
      {/* Shimmer effect */}
      <div className="shimmer pointer-events-none absolute inset-0" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// Feature card with icon and glow
interface FeatureGlowCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
  glowColor?: "cyan" | "purple" | "mixed";
}

export function FeatureGlowCard({ 
  icon, 
  title, 
  description, 
  className = "",
  glowColor = "cyan"
}: FeatureGlowCardProps) {
  return (
    <GlowCard glowColor={glowColor} className={`p-6 ${className}`}>
      <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </GlowCard>
  );
}

// Pricing card with glow
interface PricingGlowCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

export function PricingGlowCard({
  name,
  price,
  period = "/month",
  description,
  features,
  popular = false,
  ctaText = "Get Started",
  onCtaClick,
  className = "",
}: PricingGlowCardProps) {
  return (
    <GlowCard 
      glowColor={popular ? "mixed" : "cyan"} 
      intensity={popular ? "high" : "medium"}
      className={`p-8 ${popular ? "border-primary/50" : ""} ${className}`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-1 text-xs font-semibold text-white">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="mb-2 text-2xl font-bold text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <div className="mb-6">
        <span className="text-4xl font-bold text-foreground">{price}</span>
        <span className="text-muted-foreground">{period}</span>
      </div>
      
      <ul className="mb-8 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      
      <motion.button
        onClick={onCtaClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full rounded-lg py-3 font-semibold transition-all ${
          popular
            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25"
            : "bg-primary/10 text-primary hover:bg-primary/20"
        }`}
      >
        {ctaText}
      </motion.button>
    </GlowCard>
  );
}

// Stats card with animated counter
interface StatsGlowCardProps {
  value: string;
  label: string;
  icon?: ReactNode;
  className?: string;
}

export function StatsGlowCard({ value, label, icon, className = "" }: StatsGlowCardProps) {
  return (
    <GlowCard glowColor="cyan" intensity="low" className={`p-6 text-center ${className}`}>
      {icon && (
        <div className="mb-3 inline-flex items-center justify-center text-primary">
          {icon}
        </div>
      )}
      <div className="mb-1 text-3xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </GlowCard>
  );
}

export default GlowCard;
