import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, BrainCircuit, Github, Twitter, Linkedin, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/playground", label: "Playground" },
    { href: "/models", label: "Models" },
    { href: "/pricing", label: "Pricing" },
    { href: "/research", label: "Research" },
    { href: "/about", label: "About" },
  ];

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary-foreground">
      {/* Skip to main content link for keyboard navigation */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      {/* Background Elements */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" aria-hidden="true" />
      <div className="fixed inset-0 z-[-1] opacity-20 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center mix-blend-overlay pointer-events-none" aria-hidden="true" />

      {/* Navigation */}
      <header
        role="banner"
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          isScrolled ? "bg-background/80 backdrop-blur-md border-border/40 py-3" : "bg-transparent py-6"
        )}
      >
        <div className="container flex items-center justify-between">
          <Link href="/" aria-label="OmniCortex AI Labs - Home">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/50 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                <BrainCircuit className="w-8 h-8 text-primary relative z-10" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Omni<span className="text-primary">Cortex</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary cursor-pointer relative group",
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  )}
                  aria-current={location === link.href ? "page" : undefined}
                >
                  {link.label}
                  <span className={cn(
                    "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full",
                    location === link.href ? "w-full" : ""
                  )} aria-hidden="true" />
                </span>
              </Link>
            ))}
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-9 w-9 rounded-full"
                    aria-label={`User menu for ${user?.name || 'user'}`}
                  >
                    <Avatar className="h-9 w-9 border border-primary/30">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/dashboard/billing">
                    <DropdownMenuItem className="cursor-pointer">
                      Billing
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={logout}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={handleLogin}
                >
                  Sign in
                </Button>
                <Link href="/pricing">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground p-2 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <nav 
            id="mobile-menu"
            className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/40 p-4 flex flex-col gap-4 animate-in slide-in-from-top-5"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={cn(
                    "block py-2 text-base font-medium transition-colors hover:text-primary cursor-pointer",
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={location === link.href ? "page" : undefined}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <span 
                    className="block py-2 text-base font-medium text-primary cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </span>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    handleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign in
                </Button>
                <Link href="/pricing">
                  <Button 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-grow pt-24" role="main" tabIndex={-1}>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm mt-20" role="contentinfo">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-primary" aria-hidden="true" />
                <span className="text-lg font-bold">OmniCortex</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Advancing the frontiers of machine learning and cognitive computing. Democratizing AI for a better future.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://github.com/OmniCortex-AI" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                  aria-label="Visit OmniCortex on GitHub"
                >
                  <Github className="w-5 h-5" aria-hidden="true" />
                </a>
                <a 
                  href="https://twitter.com/OmniCortexAI" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                  aria-label="Follow OmniCortex on Twitter"
                >
                  <Twitter className="w-5 h-5" aria-hidden="true" />
                </a>
                <a 
                  href="https://linkedin.com/company/omnicortex-ai-labs" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                  aria-label="Connect with OmniCortex on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Research</h3>
              <ul className="space-y-2 text-sm text-muted-foreground" role="list">
                <li><a href="#" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">LLMs</a></li>
                <li><a href="#" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">Computer Vision</a></li>
                <li><a href="#" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">Reinforcement Learning</a></li>
                <li><a href="#" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">AI Safety</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground" role="list">
                <li><Link href="/about" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">About Us</Link></li>
                <li><Link href="/pricing" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">Pricing</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground" role="list">
                <li><a href="#" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 mt-12 pt-8 text-center text-sm text-muted-foreground">
            © 2026 OmniCortex AI Labs. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
