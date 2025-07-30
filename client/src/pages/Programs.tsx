import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Globe, Smartphone, Tablet, Monitor } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start gap-4">
          {program.logo && (
            <img
              src={program.logo}
              alt={`${program.title} логотип`}
              className="w-16 h-16 object-contain"
            />
          )}
          <div className="flex-1">
            <CardTitle className="text-xl">
              <Link href={`/programs/${program.category?.slug}/${program.slug}`} className="hover:text-primary transition-colors">
                {program.title}
                {program.version && <span className="text-base text-muted-foreground ml-2">v{program.version}</span>}
              </Link>
            </CardTitle>
            <CardDescription className="mt-2">
              {program.developer && (
                <span className="block text-sm text-muted-foreground">
                  Разработчик: {program.developer}
                </span>
              )}
              {program.releaseYear && (
                <span className="block text-sm text-muted-foreground">
                  Год выпуска: {program.releaseYear}
                </span>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {program.description}
        </p>
        
        {program.platforms && Array.isArray(program.platforms) && program.platforms.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {program.platforms.map((platform: string) => (
              <Badge key={platform} variant="secondary" className="flex items-center gap-1">
                {platformIcons[platform as keyof typeof platformIcons]}
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {program.downloadUrl && (
            <Button asChild size="sm">
              <a href={program.downloadUrl} target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" />
                Скачать
              </a>
            </Button>
          )}
          
          {program.googlePlayUrl && (
            <Button asChild variant="outline" size="sm">
              <a href={program.googlePlayUrl} target="_blank" rel="noopener noreferrer">
                Google Play
              </a>
            </Button>
          )}
          
          {program.appStoreUrl && (
            <Button asChild variant="outline" size="sm">
              <a href={program.appStoreUrl} target="_blank" rel="noopener noreferrer">
                App Store
              </a>
            </Button>
          )}
          
          {program.officialWebsite && (
            <Button asChild variant="outline" size="sm">
              <a href={program.officialWebsite} target="_blank" rel="noopener noreferrer">
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

  const { data: programsData, isLoading: programsLoading } = useQuery<{
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
      const params = new URLSearchParams();
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

  usePageTitle(category ? `${category.name} - Программы` : "Программы");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categorySlug]);

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
                  <ArrowLeft className="w-4 h-4 mr-2" />
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

  const programs = programsData?.programs || [];

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                На главную
              </Link>
            </Button>
            
            <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-lg text-muted-foreground">{category.description}</p>
            )}
          </div>

          {programs.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">Программы не найдены</h2>
              <p className="text-muted-foreground">
                В этой категории пока нет программ
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-12 p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
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
        </div>
      </main>
      <Footer />
    </>
  );
}