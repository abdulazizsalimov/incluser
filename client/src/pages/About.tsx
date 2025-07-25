import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Page } from "@shared/schema";

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            <div style="display: flex; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap;">
              <div style="flex: 0 0 300px;">
                <img src="/author-photo.png" alt="Абдулазиз Салимов" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" />
              </div>
              <div style="flex: 1; min-width: 300px;">
                <h2>Абдулазиз Салимов</h2>
                <p><strong>Эксперт по цифровой доступности</strong></p>
                <p>Меня зовут Абдулазиз Салимов. Я являюсь человеком с инвалидностью по зрению I группы и специалистом в области цифровой доступности.</p>
                
                <p>Работаю в Центре управления проектами цифрового правительства при Министерстве цифровых технологий Республики Узбекистан. Основное направление моей деятельности — аудит цифровых сервисов на доступность для людей с различными формами инвалидности.</p>
                
                <p>В рамках профессиональной деятельности работаю с Единым порталом интерактивных государственных услуг <span lang="en">my.gov.uz</span>: выявляю барьеры в использовании сервисов, консультирую команды разработчиков, участвую в разработке и внедрении решений, которые делают цифровую среду доступнее для всех пользователей.</p>
              </div>
            </div>
            
            <h3>Профессиональная деятельность</h3>
            <p>Помимо аудита цифровых сервисов, провожу обучающие тренинги для людей с инвалидностью о возможностях и особенностях работы с электронными государственными услугами. Эта работа направлена на повышение цифровой грамотности и расширение возможностей участия людей с инвалидностью в цифровом обществе.</p>
            
            <p>Активно занимаюсь изучением <span lang="en">IT</span>-технологий и веб-разработки, что позволяет мне лучше понимать технические аспекты создания доступных решений и эффективно взаимодействовать с командами разработчиков.</p>
            
            <h3>О проекте <span lang="en">Incluser</span></h3>
            <p>Этот блог создан для того, чтобы делиться практическими знаниями и опытом в области цифровой доступности. Здесь вы найдете материалы о стандартах <span lang="en">WCAG</span>, лучших практиках инклюзивного дизайна, обзоры инструментов тестирования доступности и реальные кейсы из практики.</p>
            
            <h3>Что такое цифровая доступность?</h3>
            <p>Цифровая доступность означает создание веб-сайтов, приложений и цифрового контента, которыми могут пользоваться все люди, включая людей с инвалидностью. Это включает в себя учет потребностей людей с нарушениями зрения, слуха, моторики и когнитивных функций.</p>
            
            <h3>Темы блога</h3>
            <ul>
              <li>Практические руководства по стандартам <span lang="en">WCAG 2.1</span></li>
              <li>Обзоры инструментов для тестирования доступности</li>
              <li>Лучшие практики инклюзивного дизайна</li>
              <li>Реальные кейсы и решения проблем доступности</li>
              <li>Новости и тренды в области веб-доступности</li>
              <li>Опыт работы с государственными цифровыми сервисами</li>
            </ul>
            
            <h3>Почему доступность важна</h3>
            <p>По данным Всемирной организации здравоохранения, более 1 миллиарда людей в мире живут с какой-либо формой инвалидности. Создание доступных цифровых продуктов — это не только техническое требование, но и вопрос социальной справедливости и равных возможностей.</p>
            
            <p>Доступный дизайн приносит пользу всем пользователям, делая интерфейсы более понятными, удобными и функциональными. Это принцип универсального дизайна в действии.</p>
          `,
          metaDescription: "Об Абдулазизе Салимове — эксперте по цифровой доступности, работающем в Министерстве цифровых технологий Узбекистана",
          isPublished: true,
          updatedAt: new Date(),
        };
      }
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main id="main-content" role="main">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-purple-700 dark:via-blue-700 dark:to-indigo-700 text-white py-16">
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
                className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-ul:text-foreground prose-li:text-foreground"
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
