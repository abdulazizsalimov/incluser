import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkipLinks from "@/components/SkipLinks";
import type { ArticleWithRelations, Category } from "@shared/schema";

export default function Articles() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const articlesPerPage = 12;

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
      if (categoryId) params.append("categoryId", categoryId);
      
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
  };

  const totalPages = articlesData?.totalPages || 1;

  return (
    <div className="min-h-screen bg-background">
      <SkipLinks />
      <Header />
      
      <main id="main-content" role="main">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Статьи</h1>
            <p className="text-xl opacity-90 max-w-2xl">
              Полная коллекция статей о цифровой доступности, инклюзивном дизайне и веб-разработке
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
                    <SelectItem value="">Все категории</SelectItem>
                    {categoriesData?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results info */}
            <div className="mb-8">
              {isLoading ? (
                <Skeleton className="h-6 w-48" />
              ) : (
                <p className="text-muted-foreground">
                  {search || categoryId ? (
                    <>
                      Найдено {articlesData?.totalCount || 0} статей
                      {search && ` по запросу "${search}"`}
                      {categoryId && categoriesData && (
                        ` в категории "${categoriesData.find(c => c.id.toString() === categoryId)?.name}"`
                      )}
                    </>
                  ) : (
                    `Всего статей: ${articlesData?.totalCount || 0}`
                  )}
                </p>
              )}
            </div>

            {/* Articles grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: articlesPerPage }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ))}
              </div>
            ) : articlesData?.articles.length ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
                  {articlesData.articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav aria-label="Навигация по страницам" className="mt-12">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        aria-label="Предыдущая страница"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Назад
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              aria-label={`Страница ${pageNum}`}
                              aria-current={currentPage === pageNum ? "page" : undefined}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        aria-label="Следующая страница"
                      >
                        Вперёд
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-center text-sm text-muted-foreground mt-4">
                      Страница {currentPage} из {totalPages}
                    </p>
                  </nav>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">
                  {search || categoryId ? "По вашему запросу ничего не найдено" : "Статей пока нет"}
                </p>
                {(search || categoryId) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearch("");
                      setCategoryId("");
                      setCurrentPage(1);
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
