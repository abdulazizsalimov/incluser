import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Globe, Smartphone, Monitor, ExternalLink } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { ProgramWithRelations } from "@shared/schema";

export default function ProgramDetail() {
  const params = useParams();
  const programSlug = params.slug;
  const categorySlug = params.categorySlug;

  const { data: program, isLoading, error } = useQuery<ProgramWithRelations>({
    queryKey: ["/api/programs", programSlug],
    queryFn: async () => {
      const response = await fetch(`/api/programs/${programSlug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch program');
      }
      return response.json();
    },
    enabled: !!programSlug,
  });

  usePageTitle(program ? `${program.title} - Программы` : "Программа");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [programSlug]);

  const platformIcons = {
    windows: <Monitor className="w-4 h-4" />,
    macos: <Monitor className="w-4 h-4" />,
    linux: <Monitor className="w-4 h-4" />,
    ios: <Smartphone className="w-4 h-4" />,
    android: <Smartphone className="w-4 h-4" />,
    web: <Globe className="w-4 h-4" />
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="h-64 bg-gray-200 rounded mb-6"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !program) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Программа не найдена</h1>
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

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-4">
              <Link href={`/programs/${categorySlug || program.category?.slug}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад к {program.category?.name}
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <article className="prose prose-lg dark:prose-invert max-w-none">
                <header className="mb-8">
                  <div className="mb-6">
                    <h1 className="text-4xl font-bold mb-2">
                      {program.title}
                      {program.version && (
                        <span className="text-2xl text-muted-foreground ml-3">v{program.version}</span>
                      )}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-2">{program.description}</p>
                    {program.developer && (
                      <p className="text-base text-muted-foreground">
                        Разработчик: {program.developer}
                      </p>
                    )}
                  </div>

                </header>

                {program.whatsNew && (
                  <section className="mb-8">
                    <h2>Что нового</h2>
                    <div className="whitespace-pre-wrap">{program.whatsNew}</div>
                  </section>
                )}

                {program.detailedDescription && (
                  <section className="mb-8">
                    <h2>Описание</h2>
                    <div className="whitespace-pre-wrap">{program.detailedDescription}</div>
                  </section>
                )}


              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {program.logo && (
                <div className="mb-4">
                  <img
                    src={program.logo}
                    alt={`${program.title} логотип`}
                    className="w-full max-w-full h-auto object-contain rounded-lg border border-border"
                  />
                </div>
              )}
              <Card>
                <CardHeader>
                  <CardTitle>Информация о программе</CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full">
                    <tbody>
                      {program.version && (
                        <tr className="border-b border-border last:border-b-0">
                          <td className="py-2 pr-4 font-medium text-sm">Версия</td>
                          <td className="py-2 text-sm text-muted-foreground">{program.version}</td>
                        </tr>
                      )}
                      
                      {program.developer && (
                        <tr className="border-b border-border last:border-b-0">
                          <td className="py-2 pr-4 font-medium text-sm">Разработчик</td>
                          <td className="py-2 text-sm text-muted-foreground">{program.developer}</td>
                        </tr>
                      )}
                      
                      {program.releaseYear && (
                        <tr className="border-b border-border last:border-b-0">
                          <td className="py-2 pr-4 font-medium text-sm">Год выпуска</td>
                          <td className="py-2 text-sm text-muted-foreground">{program.releaseYear}</td>
                        </tr>
                      )}
                      
                      {program.license && (
                        <tr className="border-b border-border last:border-b-0">
                          <td className="py-2 pr-4 font-medium text-sm">Лицензия</td>
                          <td className="py-2 text-sm text-muted-foreground">{program.license}</td>
                        </tr>
                      )}
                      
                      {program.category && (
                        <tr className="border-b border-border last:border-b-0">
                          <td className="py-2 pr-4 font-medium text-sm">Категория</td>
                          <td className="py-2 text-sm text-muted-foreground">{program.category.name}</td>
                        </tr>
                      )}
                      
                      {program.platforms && Array.isArray(program.platforms) && program.platforms.length > 0 && (
                        <tr className="border-b border-border last:border-b-0">
                          <td className="py-2 pr-4 font-medium text-sm">Операционные системы</td>
                          <td className="py-2">
                            <div className="flex flex-wrap gap-1">
                              {program.platforms.map((platform: string) => (
                                <Badge key={platform} variant="outline" className="text-xs">
                                  {platform === 'macos' ? 'macOS' : 
                                   platform === 'ios' ? 'iOS' : 
                                   platform === 'web' ? 'Веб' :
                                   platform.charAt(0).toUpperCase() + platform.slice(1)}
                                </Badge>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                      
                      {program.pricing && (
                        <tr className="border-b border-border last:border-b-0">
                          <td className="py-2 pr-4 font-medium text-sm">Стоимость</td>
                          <td className="py-2 text-sm text-muted-foreground">
                            {program.pricing === 'free' && 'Бесплатная'}
                            {program.pricing === 'freemium' && 'Условно бесплатная'}
                            {program.pricing === 'paid' && (
                              <>
                                Платная
                                {program.price && (
                                  <span className="ml-2 font-medium text-foreground">
                                    {program.price}
                                  </span>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
              
              {/* Action buttons */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Ссылки</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {program.officialWebsite && (
                    <Button asChild variant="outline" size="sm" className="w-full justify-start">
                      <a href={program.officialWebsite} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4 mr-2" />
                        Официальный сайт
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    </Button>
                  )}
                  
                  {program.downloadUrl && (
                    <Button asChild size="sm" className="w-full justify-start">
                      <a href={program.downloadUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        Скачать
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    </Button>
                  )}
                  
                  {program.googlePlayUrl && (
                    <Button asChild variant="outline" size="sm" className="w-full justify-start">
                      <a href={program.googlePlayUrl} target="_blank" rel="noopener noreferrer">
                        <Smartphone className="w-4 h-4 mr-2" />
                        Google Play
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    </Button>
                  )}
                  
                  {program.appStoreUrl && (
                    <Button asChild variant="outline" size="sm" className="w-full justify-start">
                      <a href={program.appStoreUrl} target="_blank" rel="noopener noreferrer">
                        <Smartphone className="w-4 h-4 mr-2" />
                        App Store
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

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