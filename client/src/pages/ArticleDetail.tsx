import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, User, Calendar, Volume2, Pause } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButton from "@/components/ShareButton";
import MetaTags from "@/components/MetaTags";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { usePageTitle } from "@/hooks/usePageTitle";
import type { ArticleWithRelations } from "@shared/schema";
import { ArticleReactions } from "@/components/ArticleReactions";
import { ArticleComments } from "@/components/ArticleComments";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isPlaying, isPaused, speakText, toggleSpeech, stopSpeech } = useSpeechSynthesis();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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

  // Update page title when article data is loaded
  usePageTitle(article ? `${article.title} - Incluser` : "Загрузка статьи - Incluser");

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

  // Speech synthesis functions
  const getTextToSpeak = () => {
    if (!article) return "";
    
    // Extract plain text from article content
    const plainText = article.content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    return `${article.title}. ${article.excerpt || ''}. ${plainText}`;
  };

  const handleSpeakArticle = async () => {
    const textToSpeak = getTextToSpeak();
    if (!textToSpeak) return;
    
    await toggleSpeech(textToSpeak, { rate: 1.0 });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main id="main-content" role="main" className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Статья не найдена
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Запрошенная статья не существует или была удалена.
            </p>
            <Button onClick={() => window.location.href = "/articles"}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться к статьям
            </Button>
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
          canonical={`${window.location.origin}/articles/${article.slug}`}
          type="article"
          keywords={[article.title, article.category?.name || '', 'доступность', 'инклюзивность', 'веб-разработка'].filter(Boolean).join(', ')}
          publishedTime={article.publishedAt}
          modifiedTime={article.updatedAt}
          section={article.category?.name}
          author={`${article.author?.firstName || ''} ${article.author?.lastName || ''}`.trim()}
        />
      )}
      <Header />
      
      <main id="main-content" role="main">
        {/* Back button */}
        <div className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = "/articles"}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к статьям
            </Button>
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
              
              {/* Content - responsive layout */}
              <div className="relative z-10 h-full flex items-end pb-8 sm:pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  {/* Mobile: Stack vertically */}
                  <div className="lg:hidden">
                    <header className="text-white text-center mb-6">
                      <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                        {article.title}
                      </h1>
                      
                      {article.excerpt && (
                        <p className="text-lg sm:text-xl mb-6 opacity-90 leading-relaxed">
                          {article.excerpt}
                        </p>
                      )}

                      {/* Article meta */}
                      <div className="flex flex-col sm:flex-row sm:justify-center gap-4 text-sm mb-6">
                        {article.publishedAt && (
                          <div className="flex items-center justify-center gap-2">
                            <Calendar className="h-4 w-4" aria-hidden="true" />
                            <time dateTime={new Date(article.publishedAt).toISOString()}>
                              {formatDate(new Date(article.publishedAt).toISOString())}
                            </time>
                          </div>
                        )}
                        
                        {article.author && (
                          <div className="flex items-center justify-center gap-2">
                            <User className="h-4 w-4" aria-hidden="true" />
                            <span>
                              {article.author.firstName && article.author.lastName ? 
                                `${article.author.firstName} ${article.author.lastName}` : 
                                article.author.username || article.author.email || 'Автор'
                              }
                            </span>
                          </div>
                        )}
                        
                        {article.readingTime && (
                          <div className="flex items-center justify-center gap-2">
                            <Clock className="h-4 w-4" aria-hidden="true" />
                            <span>{article.readingTime} мин чтения</span>
                          </div>
                        )}
                      </div>

                      {/* Category, Listen and Share */}
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {article.category && (
                          <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm font-medium border border-white/30">
                            {article.category.name}
                          </span>
                        )}
                        
                        <div className="flex items-center gap-2">
                          {/* Listen Button */}
                          <Button
                            onClick={handleSpeakArticle}
                            className="border-2 border-white/80 text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-blue-600 hover:border-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 flex items-center gap-2"
                            title={isPlaying ? "Пауза" : isPaused ? "Продолжить" : "Прослушать статью"}
                          >
                            {isPlaying ? (
                              <>
                                <Pause className="h-4 w-4" />
                                Пауза
                              </>
                            ) : (
                              <>
                                <Volume2 className="h-4 w-4" />
                                {isPaused ? "Продолжить" : "Прослушать"}
                              </>
                            )}
                          </Button>

                          {/* Share Button */}
                          <div className="[&_button]:border-2 [&_button]:border-white/80 [&_button]:text-white [&_button]:bg-white/10 [&_button]:backdrop-blur-sm [&_button:hover]:bg-white [&_button:hover]:text-blue-600 [&_button:hover]:border-white [&_button]:font-semibold [&_button]:py-2 [&_button]:px-4 [&_button]:rounded-lg [&_button]:shadow-lg [&_button]:transition-all [&_button]:transform [&_button:hover]:scale-105 [&_button]:focus:outline-none [&_button]:focus:ring-4 [&_button]:focus:ring-white/50">
                            <ShareButton
                              title={article.title}
                              url={`${window.location.origin}/articles/${article.slug}`}
                              description={article.excerpt || ""}
                              size="default"
                              variant="ghost"
                            />
                          </div>
                        </div>
                      </div>
                    </header>
                  </div>

                  {/* Desktop: Side by side layout */}
                  <div className="hidden lg:flex justify-between items-end">
                    {/* Main content */}
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
                              <span>
                                {article.author.firstName && article.author.lastName ? 
                                  `${article.author.firstName} ${article.author.lastName}` : 
                                  article.author.username || article.author.email || 'Автор'
                                }
                              </span>
                            </div>
                          )}
                          
                          {article.readingTime && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-5 w-5" aria-hidden="true" />
                              <span>{article.readingTime} мин чтения</span>
                            </div>
                          )}
                        </div>

                        {/* Category */}
                        {article.category && (
                          <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm font-medium border border-white/30">
                            {article.category.name}
                          </span>
                        )}
                      </header>
                    </div>
                    
                    {/* Listen and Share buttons in bottom right */}
                    <div className="ml-4 flex items-center gap-3">
                      {/* Listen Button */}
                      <Button
                        onClick={handleSpeakArticle}
                        className="border-2 border-white/80 text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-blue-600 hover:border-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 flex items-center gap-2"
                        title={isPlaying ? "Пауза" : isPaused ? "Продолжить" : "Прослушать статью"}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="h-5 w-5" />
                            Пауза
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-5 w-5" />
                            {isPaused ? "Продолжить" : "Прослушать"}
                          </>
                        )}
                      </Button>

                      {/* Share Button */}
                      <div className="[&_button]:border-2 [&_button]:border-white/80 [&_button]:text-white [&_button]:bg-white/10 [&_button]:backdrop-blur-sm [&_button:hover]:bg-white [&_button:hover]:text-blue-600 [&_button:hover]:border-white [&_button]:font-semibold [&_button]:py-2 [&_button]:px-4 [&_button]:rounded-lg [&_button]:shadow-lg [&_button]:transition-all [&_button]:transform [&_button:hover]:scale-105 [&_button]:focus:outline-none [&_button]:focus:ring-4 [&_button]:focus:ring-white/50">
                        <ShareButton
                          title={article.title}
                          url={`${window.location.origin}/articles/${article.slug}`}
                          description={article.excerpt || ""}
                          size="default"
                          variant="ghost"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Article Content */}
            <article className="py-12">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div 
                  className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-li:text-foreground [&_em]:!text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
                />
                
                {/* Article Reactions */}
                <ArticleReactions articleId={article.id} />
                
                {/* Article Comments */}
                <ArticleComments articleId={article.id} />
              </div>
            </article>
          </>
        ) : null}
      </main>
      
      <Footer />
    </div>
  );
}
