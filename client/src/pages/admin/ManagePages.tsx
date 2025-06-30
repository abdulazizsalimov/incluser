import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import PageEditor from "@/components/admin/PageEditor";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  ArrowLeft,
  FileText
} from "lucide-react";
import type { Page } from "@shared/schema";

export default function ManagePages() {
  const [showEditor, setShowEditor] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const { toast } = useToast();

  const { data: pages, isLoading } = useQuery<Page[]>({
    queryKey: ["/api/admin/pages"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/admin/pages", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pages"] });
      setShowEditor(false);
      setEditingPage(null);
      toast({
        title: "Страница создана",
        description: "Страница успешно создана",
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
        description: "Не удалось создать страницу",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      await apiRequest("PUT", `/api/admin/pages/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pages"] });
      setShowEditor(false);
      setEditingPage(null);
      toast({
        title: "Страница обновлена",
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
        description: "Не удалось обновить страницу",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pages"] });
      toast({
        title: "Страница удалена",
        description: "Страница успешно удалена",
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
        description: "Не удалось удалить страницу",
        variant: "destructive",
      });
    },
  });

  const handleSave = async (data: any) => {
    if (editingPage) {
      await updateMutation.mutateAsync({ id: editingPage.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setShowEditor(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Вы уверены, что хотите удалить эту страницу?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Неизвестно";
    return new Date(date).toLocaleDateString("ru-RU");
  };

  if (showEditor) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => {
              setShowEditor(false);
              setEditingPage(null);
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к списку
          </Button>
          <h1 className="text-2xl font-bold">
            {editingPage ? "Редактировать страницу" : "Создать страницу"}
          </h1>
        </div>

        <PageEditor
          page={editingPage || undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowEditor(false);
            setEditingPage(null);
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
          <h1 className="text-3xl font-bold text-foreground">Управление страницами</h1>
          <p className="text-muted-foreground mt-2">
            Редактируйте статические страницы сайта
          </p>
        </div>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Создать страницу
        </Button>
      </div>

      {/* Pages List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Страницы ({pages?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
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
          ) : pages?.length ? (
            <div className="space-y-4">
              {pages.map((page) => (
                <div key={page.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-3 h-3 rounded-full ${page.isPublished ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{page.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <Badge variant="outline" className="text-xs">
                          /{page.slug}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Обновлено {formatDate(page.updatedAt)}
                        </div>
                        {page.metaDescription && (
                          <span className="truncate max-w-xs">
                            {page.metaDescription}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`/${page.slug}`, "_blank")}
                    >
                      {page.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(page)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(page.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Нет страниц</h3>
                <p className="text-muted-foreground mb-4">
                  Создайте первую статическую страницу для вашего сайта
                </p>
                <Button onClick={() => setShowEditor(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Создать страницу
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Default Pages Info */}
      <Card>
        <CardHeader>
          <CardTitle>Основные страницы сайта</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Рекомендуемые страницы:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• "about" - О блоге/авторе</li>
                <li>• "contact" - Контактная информация</li>
                <li>• "privacy" - Политика конфиденциальности</li>
                <li>• "terms" - Пользовательское соглашение</li>
              </ul>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Советы по созданию:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Используйте понятные slug (URL)</li>
                <li>• Добавьте мета-описания для SEO</li>
                <li>• Структурируйте контент заголовками</li>
                <li>• Проверьте доступность страниц</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
