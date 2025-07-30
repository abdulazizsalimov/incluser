import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MetaTags from "@/components/MetaTags";
import { usePageTitle } from "@/hooks/usePageTitle";
import type { ArticleWithRelations, Category } from "@shared/schema";

export default function Articles() {
  usePageTitle("Статьи - Incluser");
  
  const [location] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("all");
  const articlesPerPage = 12;

  // Parse URL parameters for category filtering
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      setCategoryId(categoryParam);
    }
  }, [location]);

  const { data: categoriesData } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: articlesData, isLoading } = useQuery<{
    articles: ArticleWithRelations[];
    totalCount: number;
    totalPages: number;
  }>({
    queryKey: ["/api/articles", { page: currentPage, limit: articlesPerPage, search, categoryId }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: articlesPerPage.toString(),
        published: "true",
      });
      
      if (search) params.append("search", search);
      if (categoryId && categoryId !== "all") {
        // Convert category slug to ID if needed
        const category = categoriesData?.find(cat => cat.slug === categoryId);
        if (category) {
          params.append("categoryId", category.id.toString());
        }
      }
      
      const response = await fetch(`/api/articles?${params}`);
      if (!response.ok) throw new Error("Failed to fetch articles");
      return response.json();
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    setCurrentPage(1);
    
    // Update URL to reflect category filter
    const url = new URL(window.location.href);
    if (value && value !== "all") {
      url.searchParams.set('category', value);
    } else {
      url.searchParams.delete('category');
    }
    window.history.pushState({}, '', url.toString());
  };

  // Get current category name for display
  const currentCategory = categoriesData?.find(cat => cat.slug === categoryId);
  const categoryDisplayName = categoryId === "all" ? "Все категории" : currentCategory?.name || "Неизвестная категория";

  const totalPages = articlesData?.totalPages || 1;

  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title={`${categoryId !== "all" ? `Статьи: ${categoryDisplayName}` : "Все статьи"} | Incluser`}
        description={categoryId !== "all" 
          ? `Статьи в категории "${categoryDisplayName}" о цифровой доступности и инклюзивном дизайне` 
          : "Полная коллекция статей о цифровой доступности, инклюзивном дизайне и веб-разработке"
        }
        url={window.location.href}
      />
      <Header />
      
      <main id="main-content" role="main">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-purple-700 dark:via-blue-700 dark:to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">
              {categoryId !== "all" ? `Статьи: ${categoryDisplayName}` : "Статьи"}
            </h1>
            <p className="text-xl opacity-90 max-w-2xl">
              {categoryId !== "all" 
                ? `Статьи в категории "${categoryDisplayName}"` 
                : "Полная коллекция статей о цифровой доступности, инклюзивном дизайне и веб-разработке"
              }
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Поиск статей..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                    aria-label="Поиск статей"
                  />
                </div>
                <Button type="submit" size="sm" className="shrink-0">
                  Поиск
                </Button>
              </form>

              <div className="flex gap-2 items-center">
                <label htmlFor="category-filter" className="text-sm font-medium sr-only">
                  Фильтр по категории
                </label>
                <Select value={categoryId} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-48" id="category-filter">
                    <SelectValue placeholder="Все категории" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все категории</SelectItem>
                    {categoriesData?.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : articlesData?.articles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {search || categoryId !== "all" 
                    ? "По вашему запросу статей не найдено" 
                    : "Статей пока нет"
                  }
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articlesData?.articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-12">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Предыдущая страница"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          aria-label={`Страница ${page}`}
                          aria-current={currentPage === page ? "page" : undefined}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Следующая страница"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}