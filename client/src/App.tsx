import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
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

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/research" component={Research} />
      <Route path="/models" component={Models} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/playground" component={Playground} />
      <Route path="/checkout/success" component={CheckoutSuccess} />
      
      {/* Protected routes (Dashboard has its own layout) */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/billing" component={Billing} />
      <Route path="/dashboard/api-keys" component={ApiKeys} />
      
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
