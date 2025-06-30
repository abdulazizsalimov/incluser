import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import ErrorBoundary from "@/components/ErrorBoundary";

// Import pages
import Home from "@/pages/Home";
import Articles from "@/pages/Articles";
import ArticleDetail from "@/pages/ArticleDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import WcagGuides from "@/pages/WcagGuides";
import TestingTools from "@/pages/TestingTools";
import Resources from "@/pages/Resources";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageArticles from "@/pages/admin/ManageArticles";
import ManageCategories from "@/pages/admin/ManageCategories";
import ManagePages from "@/pages/admin/ManagePages";
import NotFound from "@/pages/not-found";

// Admin layout
import AdminLayout from "@/components/admin/AdminLayout";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public routes - available to everyone */}
      <Route path="/" component={Home} />
      <Route path="/articles" component={Articles} />
      <Route path="/articles/:slug" component={ArticleDetail} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/wcag-guides" component={WcagGuides} />
      <Route path="/testing-tools" component={TestingTools} />
      <Route path="/resources" component={Resources} />

      {/* Admin routes - only for authenticated users */}
      {isAuthenticated && (
        <>
          <Route path="/admin" component={() => <AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/articles" component={() => <AdminLayout><ManageArticles /></AdminLayout>} />
          <Route path="/admin/categories" component={() => <AdminLayout><ManageCategories /></AdminLayout>} />
          <Route path="/admin/pages" component={() => <AdminLayout><ManagePages /></AdminLayout>} />
        </>
      )}

      {/* 404 route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="incluser-theme">
        <TooltipProvider>
          <ErrorBoundary>
            <Router />
            <Toaster />
          </ErrorBoundary>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;