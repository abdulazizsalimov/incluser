import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Download, Globe, Smartphone, Tablet, Monitor, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MetaTags from "@/components/MetaTags";
import type { ProgramWithRelations, ProgramCategory } from "@shared/schema";

function ProgramCard({ program }: { program: ProgramWithRelations }) {
  const platformIcons = {
    windows: <Monitor className="w-4 h-4" />,
    macos: <Monitor className="w-4 h-4" />,
    linux: <Monitor className="w-4 h-4" />,
    ios: <Smartphone className="w-4 h-4" />,
    android: <Smartphone className="w-4 h-4" />,
    web: <Globe className="w-4 h-4" />
  };

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/programs/${program.category?.slug}/${program.slug}`} className="block">
        {/* Logo Section - Similar to article image */}
        <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
          {program.logo ? (
            <img
              src={program.logo}
              alt={`${program.title} логотип`}
              className="max-w-32 max-h-32 object-contain"
            />
          ) : (
            <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center">
              <Monitor className="w-12 h-12 text-primary/50" />
            </div>
          )}
        </div>
        
        {/* Content Section */}
        <CardContent className="p-6">
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-semibold hover:text-primary transition-colors line-clamp-2">
                {program.title}
                {program.version && <span className="text-sm text-muted-foreground ml-2">v{program.version}</span>}
              </h3>
              
              {program.developer && (
                <p className="text-sm text-muted-foreground mt-1">
                  Разработчик: {program.developer}
                </p>
              )}
              
              {program.releaseYear && (
                <p className="text-sm text-muted-foreground">
                  Год выпуска: {program.releaseYear}
                </p>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-3">
              {program.description}
            </p>
            
            {program.platforms && Array.isArray(program.platforms) && program.platforms.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {program.platforms.map((platform: string) => (
                  <Badge key={platform} variant="secondary" className="flex items-center gap-1 text-xs">
                    {platformIcons[platform as keyof typeof platformIcons]}
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Link>
      
      {/* Action Buttons */}
      <CardContent className="px-6 pb-6 pt-0">
        <div className="flex flex-wrap gap-2">
          {program.downloadUrl && (
            <Button asChild size="sm">
              <a href={program.downloadUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <Download className="w-4 h-4 mr-2" />
                Скачать
              </a>
            </Button>
          )}
          
          {program.googlePlayUrl && (
            <Button asChild variant="outline" size="sm">
              <a href={program.googlePlayUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                Google Play
              </a>
            </Button>
          )}
          
          {program.appStoreUrl && (
            <Button asChild variant="outline" size="sm">
              <a href={program.appStoreUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                App Store
              </a>
            </Button>
          )}
          
          {program.officialWebsite && (
            <Button asChild variant="outline" size="sm">
              <a href={program.officialWebsite} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <Globe className="w-4 h-4 mr-2" />
                Сайт
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Programs() {
  const params = useParams();
  const categorySlug = params.categorySlug;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const programsPerPage = 12;

  const { data: category, isLoading: categoryLoading } = useQuery<ProgramCategory>({
    queryKey: ["/api/program-categories", categorySlug],
    queryFn: async () => {
      const response = await fetch(`/api/program-categories/${categorySlug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }
      return response.json();
    },
    enabled: !!categorySlug,
  });

  // Load all programs for the category without search/pagination - do client-side filtering
  const { data: allProgramsData, isLoading: programsLoading } = useQuery<{
    programs: ProgramWithRelations[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>({
    queryKey: ["/api/programs", { categoryId: category?.id }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: "1",
        limit: "1000", // Load all programs at once
      });
      if (category?.id) {
        params.append('categoryId', category.id.toString());
      }
      const response = await fetch(`/api/programs?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }
      return response.json();
    },
    enabled: !!category?.id,
  });

  // Client-side filtering and pagination
  const filteredPrograms = useMemo(() => {
    if (!allProgramsData?.programs) return [];
    
    if (!search.trim()) {
      return allProgramsData.programs;
    }
    
    const searchLower = search.toLowerCase().trim();
    return allProgramsData.programs.filter(program => 
      program.title.toLowerCase().includes(searchLower) ||
      program.description.toLowerCase().includes(searchLower) ||
      (program.developer && program.developer.toLowerCase().includes(searchLower))
    );
  }, [allProgramsData?.programs, search]);

  // Calculate pagination for filtered results
  const totalPages = Math.ceil(filteredPrograms.length / programsPerPage);
  const startIndex = (currentPage - 1) * programsPerPage;
  const endIndex = startIndex + programsPerPage;
  const paginatedPrograms = filteredPrograms.slice(startIndex, endIndex);

  // Create programsData object to maintain compatibility
  const programsData = useMemo(() => ({
    programs: paginatedPrograms,
    pagination: {
      page: currentPage,
      limit: programsPerPage,
      total: filteredPrograms.length,
      totalPages: totalPages
    }
  }), [paginatedPrograms, currentPage, programsPerPage, filteredPrograms.length, totalPages]);

  usePageTitle(category ? `${category.name} - Программы` : "Программы");

  // Scroll to top only on category change or initial load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [categorySlug]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  if (!categorySlug) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Программы и приложения</h1>
            <p className="text-center text-muted-foreground">
              Выберите категорию программ для просмотра
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (categoryLoading || programsLoading) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!category) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Категория не найдена</h1>
            <div className="text-center">
              <Button asChild>
                <Link href="/">
                  На главную
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const programs = paginatedPrograms;

  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title={`${category.name} | Incluser`}
        description={category.description || `Программы в категории "${category.name}"`}
        url={window.location.href}
      />
      <Header />
      
      <main id="main-content" role="main">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-purple-700 dark:via-blue-700 dark:to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
            <p className="text-xl opacity-90 max-w-2xl">
              {category.description || `Программы в категории "${category.name}"`}
            </p>
          </div>
        </section>

        {/* Search */}
        <section className="py-8 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
              <Input
                type="text"
                placeholder="Поиск программ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
                <span className="sr-only">Поиск</span>
              </Button>
            </form>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {programs.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-4">Программы не найдены</h2>
                <p className="text-muted-foreground text-lg">
                  {search ? `По запросу "${search}" ничего не найдено` : "В этой категории пока нет программ"}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <p className="text-sm text-muted-foreground">
                    Найдено программ: {programsData?.pagination.total || 0}
                    {search && ` по запросу "${search}"`}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {programs.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-12">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Назад
                    </Button>
                    
                    <span className="text-sm text-muted-foreground">
                      Страница {currentPage} из {totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Вперед
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8 bg-amber-50 dark:bg-amber-950/20 border-t border-amber-200 dark:border-amber-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
                  Важная информация о загрузках
                </h3>
                <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
                  Все ссылки на загрузку программ являются прямыми ссылками на официальные сайты разработчиков. 
                  Мы не храним программное обеспечение на наших серверах и не несем ответственности за 
                  содержимое загружаемых файлов. Перед установкой любого программного обеспечения 
                  рекомендуем проверить его антивирусным сканером и убедиться в подлинности источника.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}