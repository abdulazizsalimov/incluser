import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkipLinks from "@/components/SkipLinks";
import NotFound from "@/pages/not-found";
import { Page } from "@shared/schema";

export default function Resources() {
  const { data: page, isLoading, error } = useQuery<Page>({
    queryKey: ['/api/pages/resources'],
  });



  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SkipLinks />
        <Header />
        <main id="main-content" className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Загрузка страницы...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !page) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SkipLinks />
      <Header />
      
      <main id="main-content" className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <header className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
                {page.title}
              </h1>
            </header>
            
            <div 
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </article>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}