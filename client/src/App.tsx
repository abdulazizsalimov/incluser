import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import ErrorBoundary from "@/components/ErrorBoundary";

// Import pages
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Articles from "@/pages/Articles";
import ArticleDetail from "@/pages/ArticleDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageArticles from "@/pages/admin/ManageArticles";
import ManagePages from "@/pages/admin/ManagePages";
import NotFound from "@/pages/not-found";

// Admin layout
import AdminLayout from "@/components/admin/AdminLayout";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public routes - available to everyone */}
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/articles" component={Articles} />
          <Route path="/articles/:slug" component={ArticleDetail} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
        </>
      ) : (
        <>
          {/* Authenticated user routes */}
          <Route path="/" component={Home} />
          <Route path="/articles" component={Articles} />
          <Route path="/articles/:slug" component={ArticleDetail} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
        </>
      )}

      {/* Admin routes - wrapped in AdminLayout */}
      <Route path="/admin">
        {(params) => (
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        )}
      </Route>
      
      <Route path="/admin/articles">
        {(params) => (
          <AdminLayout>
            <ManageArticles />
          </AdminLayout>
        )}
      </Route>
      
      <Route path="/admin/categories">
        {(params) => (
          <AdminLayout>
            <ManageArticles />
          </AdminLayout>
        )}
      </Route>
      
      <Route path="/admin/pages">
        {(params) => (
          <AdminLayout>
            <ManagePages />
          </AdminLayout>
        )}
      </Route>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
