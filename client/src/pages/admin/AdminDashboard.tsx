import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { 
  FileText, 
  Eye, 
  Users, 
  TrendingUp, 
  Plus,
  Edit,
  Settings
} from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import type { ArticleWithRelations, Category, Page } from "@shared/schema";

export default function AdminDashboard() {
  usePageTitle("Админ панель - Incluser");
  const [, setLocation] = useLocation();
  
  const { data: articlesData, isLoading: articlesLoading } = useQuery<{
    articles: ArticleWithRelations[];
    totalCount: number;
  }>({
    queryKey: ["/api/admin/articles", { limit: 5 }],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/admin/categories"],
  });

  const { data: pages, isLoading: pagesLoading } = useQuery<Page[]>({
    queryKey: ["/api/admin/pages"],
  });

  const publishedArticles = articlesData?.articles.filter(a => a.isPublished).length || 0;
  const draftArticles = (articlesData?.totalCount || 0) - publishedArticles;

  const handleCreateArticle = () => {
    // Программно переходим на страницу создания статьи
    setLocation('/admin/articles?create=true');
  };

  const handleCreateCategory = () => {
    // Программно переходим на страницу создания категории
    setLocation('/admin/categories?create=true');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Панель администратора</h1>
        <p className="text-muted-foreground mt-2">
          Управление контентом блога Incluser
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего статей</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {articlesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{articlesData?.totalCount || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {publishedArticles} опубликовано, {draftArticles} черновиков
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Категории</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {categoriesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{categories?.length || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Активных категорий
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Страницы</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {pagesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{pages?.length || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Статических страниц
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Просмотры</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">
              За текущий месяц
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Управление статьями
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Создавайте, редактируйте и публикуйте статьи о цифровой доступности
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => window.location.href = "/admin/articles"}
              >
                <Edit className="h-4 w-4 mr-2" />
                Управлять
              </Button>
              <Button size="sm" variant="outline" onClick={handleCreateArticle}>
                <Plus className="h-4 w-4 mr-2" />
                Создать
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Категории
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Организуйте статьи по тематическим категориям
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="secondary" 
                className="flex-1"
                onClick={() => window.location.href = "/admin/categories"}
              >
                <Settings className="h-4 w-4 mr-2" />
                Настроить
              </Button>
              <Button size="sm" variant="outline" onClick={handleCreateCategory}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Страницы сайта
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Редактируйте статические страницы: "О блоге", "Контакты" и другие
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="secondary" 
                className="flex-1"
                onClick={() => window.location.href = "/admin/pages"}
              >
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Управление пользователями
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Управляйте пользователями, которые входили через Google OAuth
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="secondary" 
                className="flex-1"
                onClick={() => window.location.href = "/admin/users"}
              >
                <Users className="h-4 w-4 mr-2" />
                Управлять
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Последние статьи</CardTitle>
        </CardHeader>
        <CardContent>
          {articlesLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : articlesData?.articles.length ? (
            <div className="space-y-4">
              {articlesData.articles.slice(0, 5).map((article) => (
                <div key={article.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${article.isPublished ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <div>
                      <h3 className="font-medium">{article.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {article.category?.name} • {article.readingTime} мин чтения
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = "/admin/articles"}
                >
                  Посмотреть все статьи
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Статей пока нет</p>
              <Button className="mt-4" onClick={handleCreateArticle}>
                <Plus className="h-4 w-4 mr-2" />
                Создать первую статью
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
