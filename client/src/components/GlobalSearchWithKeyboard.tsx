import { useState, useRef, useEffect } from "react";
import { Search, X, FileText, Monitor, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function GlobalSearchWithKeyboard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
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

  // Get all results in a flat array for navigation
  const allResults = [
    ...(searchResults?.articles || []),
    ...(searchResults?.programs || []),
    ...(searchResults?.pages || [])
  ];

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
    setSelectedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isExpanded) return;

    switch (event.key) {
      case 'ArrowDown':
        if (allResults.length === 0) return;
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < allResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        if (allResults.length === 0) return;
        event.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < allResults.length) {
          const selectedResult = allResults[selectedIndex];
          window.location.href = selectedResult.url;
          handleCollapse();
        }
        break;
      case 'Escape':
        event.preventDefault();
        handleCollapse();
        break;
    }
  };

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'article': return 'Статья';
      case 'program': return 'Программа';
      case 'page': return 'Страница';
      default: return 'Результат';
    }
  };

  const renderResultItem = (result: SearchResult, globalIndex: number) => {
    const isSelected = selectedIndex === globalIndex;
    const typeLabel = getTypeLabel(result.type);
    
    return (
      <div 
        id={`search-result-${globalIndex}`}
        key={`${result.type}-${result.id}`}
        role="option"
        aria-selected={isSelected}
        aria-label={`${typeLabel}: ${result.title}. ${result.description}${result.category ? `. Категория: ${result.category}` : ''}`}
        className={`p-2 rounded cursor-pointer transition-colors ${
          isSelected ? 'bg-accent' : 'hover:bg-accent'
        }`}
        onClick={() => {
          window.location.href = result.url;
          handleCollapse();
        }}
      >
        <div className="font-medium text-sm">{result.title}</div>
        <div className="text-xs text-muted-foreground line-clamp-2">
          {result.description}
        </div>
        {result.category && (
          <div className="text-xs text-blue-600 mt-1">{result.category}</div>
        )}
      </div>
    );
  };

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
                onKeyDown={handleKeyDown}
                placeholder="Поиск по сайту... (↑↓ для навигации, Enter для перехода)"
                className="border-0 bg-transparent p-0 focus-visible:ring-0 flex-1"
                role="combobox"
                aria-expanded={isExpanded && hasResults}
                aria-haspopup="listbox"
                aria-controls="search-results"
                aria-activedescendant={selectedIndex >= 0 ? `search-result-${selectedIndex}` : undefined}
                aria-label="Поиск по сайту"
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
              <div 
                id="search-results"
                className="max-h-96 overflow-y-auto"
                role="listbox"
                aria-label="Результаты поиска"
                aria-live="polite"
                aria-relevant="additions removals"
              >
                {isLoading ? (
                  <div className="p-4 text-center text-muted-foreground" aria-live="polite">
                    Поиск...
                  </div>
                ) : !hasResults ? (
                  <div className="p-4 text-center text-muted-foreground" aria-live="polite">
                    {searchQuery.trim() ? 'Ничего не найдено' : 'Введите запрос для поиска'}
                  </div>
                ) : (
                  <div className="p-2">
                    {/* Articles */}
                    {searchResults.articles.length > 0 && (
                      <div className="mb-4" role="group" aria-labelledby="articles-heading">
                        <div 
                          id="articles-heading"
                          className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-muted-foreground"
                        >
                          {getSectionIcon('article')}
                          {getSectionTitle('article')} ({searchResults.articles.length})
                        </div>
                        <div className="space-y-1">
                          {searchResults.articles.map((result, index) => 
                            renderResultItem(result, index)
                          )}
                        </div>
                      </div>
                    )}

                    {/* Programs */}
                    {searchResults.programs.length > 0 && (
                      <div className="mb-4" role="group" aria-labelledby="programs-heading">
                        <div 
                          id="programs-heading"
                          className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-muted-foreground"
                        >
                          {getSectionIcon('program')}
                          {getSectionTitle('program')} ({searchResults.programs.length})
                        </div>
                        <div className="space-y-1">
                          {searchResults.programs.map((result, index) => 
                            renderResultItem(result, searchResults.articles.length + index)
                          )}
                        </div>
                      </div>
                    )}

                    {/* Pages */}
                    {searchResults.pages.length > 0 && (
                      <div role="group" aria-labelledby="pages-heading">
                        <div 
                          id="pages-heading"
                          className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-muted-foreground"
                        >
                          {getSectionIcon('page')}
                          {getSectionTitle('page')} ({searchResults.pages.length})
                        </div>
                        <div className="space-y-1">
                          {searchResults.pages.map((result, index) => 
                            renderResultItem(result, searchResults.articles.length + searchResults.programs.length + index)
                          )}
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