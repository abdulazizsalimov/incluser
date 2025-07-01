import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkipLinks from "@/components/SkipLinks";
import ShareButton from "@/components/ShareButton";
import MetaTags from "@/components/MetaTags";
import type { ArticleWithRelations } from "@shared/schema";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading, error } = useQuery<ArticleWithRelations>({
    queryKey: ["/api/articles", slug],
    queryFn: async () => {
      const response = await fetch(`/api/articles/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Article not found");
        }
        throw new Error("Failed to fetch article");
      }
      return response.json();
    },
    enabled: !!slug,
  });

  const formatDate = (date: string | null) => {
    if (!date) return "";
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return "";
      return dateObj.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.warn('Date formatting error:', error);
      return "";
    }
  };

  const formatContent = (content: string) => {
    // Simple markdown-to-HTML conversion for basic formatting
    return content
      .replace(/^# (.*$)/gm, '<h2>$1</h2>')
      .replace(/^## (.*$)/gm, '<h3>$1</h3>')
      .replace(/^### (.*$)/gm, '<h4>$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.+)$/gm, '<p>$1</p>')
      .replace(/<p><h([1-6])>/g, '<h$1>')
      .replace(/<\/h([1-6])><\/p>/g, '</h$1>');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <SkipLinks />
        <Header />
        
        <main id="main-content" role="main" className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Статья не найдена
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Запрошенная статья не существует или была удалена.
            </p>
            <Link href="/articles">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться к статьям
              </Button>
            </Link>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {article && (
        <MetaTags
          title={`${article.title} | Incluser`}
          description={article.excerpt || article.title}
          image={article.featuredImage || "/favicon.png"}
          url={`${window.location.origin}/articles/${article.slug}`}
          type="article"
        />
      )}
      <SkipLinks />
      <Header />
      
      <main id="main-content" role="main">
        {/* Back button */}
        <div className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/articles">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к статьям
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-8" />
              <Skeleton className="h-64 w-full mb-8" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        ) : article ? (
          <>
            {/* Article Hero Banner */}
            <section className="relative h-[500px] lg:h-[600px] overflow-hidden">
              {/* Background Image */}
              {article.featuredImage ? (
                <div className="absolute inset-0">
                  <img 
                    src={article.featuredImage}
                    alt={article.featuredImageAlt || ""}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-black/50"></div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500"></div>
              )}
              
              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-4xl">
                    <header className="text-white">
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        {article.title}
                      </h1>
                      
                      {article.excerpt && (
                        <p className="text-xl sm:text-2xl mb-8 opacity-90 leading-relaxed">
                          {article.excerpt}
                        </p>
                      )}

                      {/* Article meta */}
                      <div className="flex flex-wrap items-center gap-6 text-base mb-6">
                        {article.publishedAt && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" aria-hidden="true" />
                            <time dateTime={new Date(article.publishedAt).toISOString()}>
                              {formatDate(new Date(article.publishedAt).toISOString())}
                            </time>
                          </div>
                        )}
                        
                        {article.author && (
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5" aria-hidden="true" />
                            <span>{article.author?.username || 'Автор'}</span>
                          </div>
                        )}
                        
                        {article.readingTime && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" aria-hidden="true" />
                            <span>{article.readingTime} мин чтения</span>
                          </div>
                        )}
                      </div>

                      {/* Category and Share */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        {article.category && (
                          <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm font-medium border border-white/30">
                            {article.category.name}
                          </span>
                        )}
                        
                        <ShareButton
                          title={article.title}
                          url={`${window.location.origin}/articles/${article.slug}`}
                          description={article.excerpt || ""}
                          size="default"
                          variant="outline"
                        />
                      </div>
                    </header>
                  </div>
                </div>
              </div>
            </section>

            {/* Article Content */}
            <article className="py-12">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
                  dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
                />
              </div>
            </article>
          </>
        ) : null}
      </main>
      
      <Footer />
    </div>
  );
}
