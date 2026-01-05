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
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import ApiKeys from "./pages/ApiKeys";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      {/* Public routes with Layout */}
      <Route path="/">
        <Layout><Home /></Layout>
      </Route>
      <Route path="/about">
        <Layout><About /></Layout>
      </Route>
      <Route path="/research">
        <Layout><Research /></Layout>
      </Route>
      <Route path="/models">
        <Layout><Models /></Layout>
      </Route>
      <Route path="/pricing">
        <Layout><Pricing /></Layout>
      </Route>
      
      {/* Protected routes (Dashboard has its own layout) */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/billing" component={Billing} />
      <Route path="/dashboard/api-keys" component={ApiKeys} />
      
      {/* Fallback */}
      <Route>
        <Layout><NotFound /></Layout>
      </Route>
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
