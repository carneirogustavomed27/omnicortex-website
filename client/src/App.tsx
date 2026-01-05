import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Research from "./pages/Research";
import Models from "./pages/Models";
import Pricing from "./pages/Pricing";
import Playground from "./pages/Playground";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import ApiKeys from "./pages/ApiKeys";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./components/PageTransition";

function AnimatedRoutes() {
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Switch location={location} key={location}>
        {/* Public routes with page transitions */}
        <Route path="/">
          <PageTransition>
            <Home />
          </PageTransition>
        </Route>
        <Route path="/about">
          <PageTransition>
            <About />
          </PageTransition>
        </Route>
        <Route path="/research">
          <PageTransition>
            <Research />
          </PageTransition>
        </Route>
        <Route path="/models">
          <PageTransition>
            <Models />
          </PageTransition>
        </Route>
        <Route path="/pricing">
          <PageTransition>
            <Pricing />
          </PageTransition>
        </Route>
        <Route path="/playground">
          <PageTransition>
            <Playground />
          </PageTransition>
        </Route>
        <Route path="/checkout/success">
          <PageTransition>
            <CheckoutSuccess />
          </PageTransition>
        </Route>
        
        {/* Protected routes (Dashboard has its own layout) */}
        <Route path="/dashboard">
          <PageTransition>
            <Dashboard />
          </PageTransition>
        </Route>
        <Route path="/dashboard/billing">
          <PageTransition>
            <Billing />
          </PageTransition>
        </Route>
        <Route path="/dashboard/api-keys">
          <PageTransition>
            <ApiKeys />
          </PageTransition>
        </Route>
        
        {/* Fallback */}
        <Route>
          <PageTransition>
            <NotFound />
          </PageTransition>
        </Route>
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <AnimatedRoutes />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
