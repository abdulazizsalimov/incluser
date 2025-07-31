import { useState, useRef, useEffect } from "react";
import { Search, X, FileText, Monitor, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface SearchResult {
  type: 'article' | 'program' | 'page';
  id: string;
  title: string;
  description: string;
  url: string;
  category?: string;
}

interface SearchResponse {
  articles: SearchResult[];
  programs: SearchResult[];
  pages: SearchResult[];
  totalResults: number;
}

export default function GlobalSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search API call
  const { data: searchResults, isLoading } = useQuery<SearchResponse>({
    queryKey: ["/api/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return { articles: [], programs: [], pages: [], totalResults: 0 };
      
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      return response.json();
    },
    enabled: !!searchQuery.trim(),
  });

  // Handle expand/collapse
  const handleExpand = () => {
    setIsExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setSearchQuery("");
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleCollapse();
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Escape key to close
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isExpanded) {
        handleCollapse();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isExpanded]);

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="w-4 h-4" />;
      case 'program': return <Monitor className="w-4 h-4" />;
      case 'page': return <Globe className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getSectionTitle = (type: string) => {
    switch (type) {
      case 'article': return 'Статьи';
      case 'program': return 'Программы';
      case 'page': return 'Страницы';
      default: return 'Результаты';
    }
  };

  const hasResults = searchResults && (
    searchResults.articles.length > 0 || 
    searchResults.programs.length > 0 || 
    searchResults.pages.length > 0
  );

  return (
    <div ref={containerRef} className="relative">
      {!isExpanded ? (
        // Collapsed state - search icon button
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExpand}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Открыть поиск"
        >
          <Search className="w-5 h-5" />
        </Button>
      ) : (
        // Expanded state - search input with animation
        <div className="absolute right-0 top-0 z-50">
          <div className="bg-background border border-border rounded-lg shadow-lg min-w-80 animate-in slide-in-from-right-2 duration-200">
            <div className="flex items-center p-3 border-b">
              <Search className="w-4 h-4 text-muted-foreground mr-2 flex-shrink-0" />
              <Input
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по сайту..."
                className="border-0 bg-transparent p-0 focus-visible:ring-0 flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCollapse}
                className="ml-2 text-muted-foreground hover:text-foreground"
                aria-label="Закрыть поиск"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Search Results */}
            {searchQuery.trim() && (
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Поиск...
                  </div>
                ) : !hasResults ? (
                  <div className="p-4 text-center text-muted-foreground">
                    {searchQuery.trim() ? 'Ничего не найдено' : 'Введите запрос для поиска'}
                  </div>
                ) : (
                  <div className="p-2">
                    {/* Articles Section */}
                    {searchResults.articles.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-muted-foreground">
                          {getSectionIcon('article')}
                          {getSectionTitle('article')} ({searchResults.articles.length})
                        </div>
                        <div className="space-y-1">
                          {searchResults.articles.map((result) => (
                            <Link
                              key={`article-${result.id}`}
                              href={result.url}
                              onClick={handleCollapse}
                            >
                              <div className="p-2 hover:bg-muted rounded-md cursor-pointer">
                                <div className="font-medium text-sm line-clamp-1">{result.title}</div>
                                <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                  {result.description}
                                </div>
                                {result.category && (
                                  <div className="text-xs text-primary mt-1">{result.category}</div>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Programs Section */}
                    {searchResults.programs.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-muted-foreground">
                          {getSectionIcon('program')}
                          {getSectionTitle('program')} ({searchResults.programs.length})
                        </div>
                        <div className="space-y-1">
                          {searchResults.programs.map((result) => (
                            <Link
                              key={`program-${result.id}`}
                              href={result.url}
                              onClick={handleCollapse}
                            >
                              <div className="p-2 hover:bg-muted rounded-md cursor-pointer">
                                <div className="font-medium text-sm line-clamp-1">{result.title}</div>
                                <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                  {result.description}
                                </div>
                                {result.category && (
                                  <div className="text-xs text-primary mt-1">{result.category}</div>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pages Section */}
                    {searchResults.pages.length > 0 && (
                      <div className="mb-2">
                        <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-muted-foreground">
                          {getSectionIcon('page')}
                          {getSectionTitle('page')} ({searchResults.pages.length})
                        </div>
                        <div className="space-y-1">
                          {searchResults.pages.map((result) => (
                            <Link
                              key={`page-${result.id}`}
                              href={result.url}
                              onClick={handleCollapse}
                            >
                              <div className="p-2 hover:bg-muted rounded-md cursor-pointer">
                                <div className="font-medium text-sm line-clamp-1">{result.title}</div>
                                <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                  {result.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}