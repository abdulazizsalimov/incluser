import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkipLinks from "@/components/SkipLinks";
import type { Page } from "@shared/schema";

export default function About() {
  const { data: page, isLoading } = useQuery<Page>({
    queryKey: ["/api/pages/about"],
    queryFn: async () => {
      const response = await fetch("/api/pages/about");
      if (!response.ok) {
        // Return default content if page doesn't exist
        return {
          id: 0,
          title: "Об авторе",
          slug: "about",
          content: `
            <h2>О блоге Incluser</h2>
            <p>Добро пожаловать на Incluser — личный блог, посвящённый цифровой доступности и инклюзивному дизайну.</p>
            
            <h3>Миссия</h3>
            <p>Моя цель — делиться знаниями и опытом в области создания доступных веб-решений, которые могут использовать все люди, независимо от их физических возможностей.</p>
            
            <h3>О чём этот блог</h3>
            <ul>
              <li>Практические руководства по WCAG 2.1</li>
              <li>Обзоры инструментов для тестирования доступности</li>
              <li>Лучшие практики инклюзивного дизайна</li>
              <li>Реальные кейсы и решения проблем доступности</li>
              <li>Новости и тренды в области веб-доступности</li>
            </ul>
            
            <h3>Почему доступность важна</h3>
            <p>По данным ВОЗ, более 1 миллиарда людей в мире живут с какой-либо формой инвалидности. Создание доступных цифровых продуктов — это не только техническое требование, но и вопрос социальной справедливости.</p>
            
            <p>Доступный дизайн приносит пользу всем пользователям, делая интерфейсы более понятными, удобными и функциональными.</p>
          `,
          metaDescription: "О блоге Incluser, посвящённом цифровой доступности и инклюзивному дизайну",
          isPublished: true,
          updatedAt: new Date().toISOString(),
        } as Page;
      }
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SkipLinks />
      <Header />
      
      <main id="main-content" role="main">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <Skeleton className="h-12 w-64 bg-white/20" />
            ) : (
              <h1 className="text-4xl font-bold">{page?.title || "Об авторе"}</h1>
            )}
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ) : page ? (
              <div 
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-ul:text-foreground prose-li:text-foreground"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  Страница временно недоступна
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
