import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import ArticleEditor from "@/components/admin/ArticleEditor";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  Clock,
  User,
  ArrowLeft
} from "lucide-react";
import type { ArticleWithRelations, Category } from "@shared/schema";

export default function ManageArticles() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleWithRelations | null>(null);
  const { toast } = useToast();

  const articlesPerPage = 10;

  const { data: categoriesData } = useQuery<Category[]>({
    queryKey: ["/api/admin/categories"],
  });

  const { data: articlesData, isLoading } = useQuery<{
    articles: ArticleWithRelations[];
    totalCount: number;
    totalPages: number;
  }>({
    queryKey: ["/api/admin/articles", { page: currentPage, limit: articlesPerPage, search, categoryId: categoryFilter }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: articlesPerPage.toString(),
      });
      
      if (search) params.append("search", search);
      if (categoryFilter && categoryFilter !== "all") params.append("categoryId", categoryFilter);
      
      const response = await fetch(`/api/admin/articles?${params}`);
      if (!response.ok) throw new Error("Failed to fetch articles");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/admin/articles", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      setShowEditor(false);
      setEditingArticle(null);
      toast({
        title: "Статья создана",
        description: "Статья успешно создана",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Нет доступа",
          description: "Вы не авторизованы. Выполняется вход в систему...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Ошибка",
        description: "Не удалось создать статью",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      await apiRequest("PUT", `/api/admin/articles/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      setShowEditor(false);
      setEditingArticle(null);
      toast({
        title: "Статья обновлена",
        description: "Изменения сохранены успешно",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Нет доступа",
          description: "Вы не авторизованы. Выполняется вход в систему...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статью",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      toast({
        title: "Статья удалена",
        description: "Статья успешно удалена",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Нет доступа",
          description: "Вы не авторизованы. Выполняется вход в систему...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Ошибка",
        description: "Не удалось удалить статью",
        variant: "destructive",
      });
    },
  });

  const handleSave = async (data: any) => {
    if (editingArticle) {
      await updateMutation.mutateAsync({ id: editingArticle.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleEdit = (article: ArticleWithRelations) => {
    setEditingArticle(article);
    setShowEditor(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Вы уверены, что хотите удалить эту статью?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "Не опубликовано";
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return "Не опубликовано";
      return dateObj.toLocaleDateString("ru-RU");
    } catch (error) {
      console.warn('Date formatting error:', error);
      return "Не опубликовано";
    }
  };

  if (showEditor) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => {
              setShowEditor(false);
              setEditingArticle(null);
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к списку
          </Button>
          <h1 className="text-2xl font-bold">
            {editingArticle ? "Редактировать статью" : "Создать статью"}
          </h1>
        </div>

        <ArticleEditor
          article={editingArticle || undefined}
          categories={categoriesData || []}
          onSave={handleSave}
          onCancel={() => {
            setShowEditor(false);
            setEditingArticle(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Управление статьями</h1>
          <p className="text-muted-foreground mt-2">
            Создавайте и редактируйте статьи о цифровой доступности
          </p>
        </div>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Создать статью
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Поиск статей..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Поиск</Button>
            </form>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Все категории" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {categoriesData?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Статьи ({articlesData?.totalCount || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                  <Skeleton className="h-12 w-12" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          ) : articlesData?.articles.length ? (
            <div className="space-y-4">
              {articlesData.articles.map((article) => (
                <div key={article.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-3 h-3 rounded-full ${article.isPublished ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{article.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        {article.category && (
                          <Badge variant="secondary" className="text-xs">
                            {article.category.name}
                          </Badge>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(article.publishedAt)}
                        </div>
                        {article.readingTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.readingTime} мин
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {article.author.firstName} {article.author.lastName}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`/articles/${article.slug}`, "_blank")}
                      aria-label={article.isPublished ? `Просмотреть статью "${article.title}"` : `Предварительный просмотр статьи "${article.title}"`}
                      title={article.isPublished ? "Просмотреть опубликованную статью" : "Предварительный просмотр неопубликованной статьи"}
                    >
                      {article.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(article)}
                      aria-label={`Редактировать статью "${article.title}"`}
                      title="Редактировать статью"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(article.id)}
                      disabled={deleteMutation.isPending}
                      aria-label={`Удалить статью "${article.title}"`}
                      title="Удалить статью"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {(articlesData?.totalPages || 1) > 1 && (
                <div className="flex justify-center gap-2 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Назад
                  </Button>
                  <span className="flex items-center px-3 text-sm">
                    Страница {currentPage} из {articlesData?.totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(articlesData?.totalPages || 1, prev + 1))}
                    disabled={currentPage === (articlesData?.totalPages || 1)}
                  >
                    Вперёд
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Edit className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Нет статей</h3>
                <p className="text-muted-foreground mb-4">
                  {search || categoryFilter 
                    ? "По вашему запросу ничего не найдено"
                    : "Создайте первую статью для вашего блога"
                  }
                </p>
                {(search || categoryFilter) ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearch("");
                      setCategoryFilter("");
                      setCurrentPage(1);
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                ) : (
                  <Button onClick={() => setShowEditor(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Создать статью
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
