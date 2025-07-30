import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
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
              <Link href={`/programs/${program.category?.slug}`}>
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
                  <div className="flex items-start gap-6 mb-6">
                    {program.logo && (
                      <img
                        src={program.logo}
                        alt={`${program.title} логотип`}
                        className="w-20 h-20 object-contain"
                      />
                    )}
                    <div className="flex-1">
                      <h1 className="text-4xl font-bold mb-2">
                        {program.title}
                        {program.version && (
                          <span className="text-2xl text-muted-foreground ml-3">v{program.version}</span>
                        )}
                      </h1>
                      {program.developer && (
                        <p className="text-lg text-muted-foreground">
                          Разработчик: {program.developer}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {program.platforms && Array.isArray(program.platforms) && program.platforms.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {program.platforms.map((platform: string) => (
                        <Badge key={platform} variant="secondary" className="flex items-center gap-1">
                          {platformIcons[platform as keyof typeof platformIcons]}
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </header>

                <section className="mb-8">
                  <h2>Описание</h2>
                  <p className="text-lg">{program.description}</p>
                </section>

                {program.whatsNew && (
                  <section className="mb-8">
                    <h2>Что нового</h2>
                    <div className="whitespace-pre-wrap">{program.whatsNew}</div>
                  </section>
                )}

                {program.detailedDescription && (
                  <section className="mb-8">
                    <h2>Подробное описание</h2>
                    <div className="whitespace-pre-wrap">{program.detailedDescription}</div>
                  </section>
                )}

                {/* Action buttons table */}
                <section className="mb-8">
                  <h2>Загрузка и ссылки</h2>
                  <div className="not-prose">
                    <table className="w-full border border-border rounded-lg overflow-hidden">
                      <tbody>
                        {program.downloadUrl && (
                          <tr className="border-b border-border last:border-b-0">
                            <td className="p-4 font-medium bg-muted/50">Скачать</td>
                            <td className="p-4">
                              <Button asChild size="sm">
                                <a href={program.downloadUrl} target="_blank" rel="noopener noreferrer">
                                  <Download className="w-4 h-4 mr-2" />
                                  Прямая загрузка
                                  <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                              </Button>
                            </td>
                          </tr>
                        )}
                        
                        {program.officialWebsite && (
                          <tr className="border-b border-border last:border-b-0">
                            <td className="p-4 font-medium bg-muted/50">Официальный сайт</td>
                            <td className="p-4">
                              <Button asChild variant="outline" size="sm">
                                <a href={program.officialWebsite} target="_blank" rel="noopener noreferrer">
                                  <Globe className="w-4 h-4 mr-2" />
                                  Посетить сайт
                                  <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                              </Button>
                            </td>
                          </tr>
                        )}
                        
                        {program.googlePlayUrl && (
                          <tr className="border-b border-border last:border-b-0">
                            <td className="p-4 font-medium bg-muted/50">Google Play</td>
                            <td className="p-4">
                              <Button asChild variant="outline" size="sm">
                                <a href={program.googlePlayUrl} target="_blank" rel="noopener noreferrer">
                                  <Smartphone className="w-4 h-4 mr-2" />
                                  Google Play Store
                                  <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                              </Button>
                            </td>
                          </tr>
                        )}
                        
                        {program.appStoreUrl && (
                          <tr className="border-b border-border last:border-b-0">
                            <td className="p-4 font-medium bg-muted/50">App Store</td>
                            <td className="p-4">
                              <Button asChild variant="outline" size="sm">
                                <a href={program.appStoreUrl} target="_blank" rel="noopener noreferrer">
                                  <Smartphone className="w-4 h-4 mr-2" />
                                  Apple App Store
                                  <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                              </Button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Информация о программе</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {program.releaseYear && (
                    <div>
                      <h4 className="font-medium mb-1">Год выпуска</h4>
                      <p className="text-sm text-muted-foreground">{program.releaseYear}</p>
                    </div>
                  )}
                  
                  {program.license && (
                    <div>
                      <h4 className="font-medium mb-1">Лицензия</h4>
                      <p className="text-sm text-muted-foreground">{program.license}</p>
                    </div>
                  )}
                  
                  {program.category && (
                    <div>
                      <h4 className="font-medium mb-1">Категория</h4>
                      <Badge variant="secondary">{program.category.name}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}