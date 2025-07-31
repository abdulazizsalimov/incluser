import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ProgramCategory } from "@shared/schema";

export default function ManageProgramCategories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProgramCategory | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const { toast } = useToast();

  usePageTitle("Управление категориями программ - Админ панель");

  const { data: categories = [], isLoading } = useQuery<ProgramCategory[]>({
    queryKey: ["/api/admin/program-categories"],
  });

  const createCategory = useMutation({
    mutationFn: async (category: typeof newCategory) => {
      await apiRequest("/api/admin/program-categories", "POST", category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/program-categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/program-categories"] });
      setIsCreateDialogOpen(false);
      setNewCategory({ name: "", slug: "", description: "" });
      toast({
        title: "Категория создана",
        description: "Категория программ была успешно создана",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать категорию",
        variant: "destructive",
      });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async (category: ProgramCategory) => {
      await apiRequest(`/api/admin/program-categories/${category.id}`, "PUT", category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/program-categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/program-categories"] });
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      toast({
        title: "Категория обновлена",
        description: "Категория программ была успешно обновлена",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить категорию",
        variant: "destructive",
      });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/admin/program-categories/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/program-categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/program-categories"] });
      toast({
        title: "Категория удалена",
        description: "Категория программ была успешно удалена",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось удалить категорию",
        variant: "destructive",
      });
    },
  });

  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Ошибка",
        description: "Название категории обязательно",
        variant: "destructive",
      });
      return;
    }

    const slug = newCategory.slug.trim() || 
      newCategory.name.toLowerCase()
        .replace(/[^a-zа-я0-9\s-]/gi, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

    createCategory.mutate({ ...newCategory, slug });
  };

  const handleEditCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast({
        title: "Ошибка",
        description: "Название категории обязательно",
        variant: "destructive",
      });
      return;
    }

    updateCategory.mutate(editingCategory);
  };

  const openEditDialog = (category: ProgramCategory) => {
    setEditingCategory({ ...category });
    setIsEditDialogOpen(true);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Категории программ</h1>
          <p className="text-muted-foreground">
            Управление категориями программ и приложений
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Создать категорию
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать новую категорию</DialogTitle>
              <DialogDescription>
                Создайте новую категорию для программ и приложений
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Название *</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Например: Программы экранного доступа"
                />
              </div>
              
              <div>
                <Label htmlFor="slug">URL (slug)</Label>
                <Input
                  id="slug"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                  placeholder="screen-readers (оставьте пустым для автогенерации)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Используется в URL. Если не указан, будет создан автоматически.
                </p>
              </div>
              
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={newCategory.description || ""}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Краткое описание категории..."
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleCreateCategory} disabled={createCategory.isPending}>
                {createCategory.isPending ? "Создание..." : "Создать"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Поиск категорий..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories List */}
      <div className="grid gap-4">
        {filteredCategories.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? "Категории не найдены" : "Нет категорий программ"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>
                      URL: /programs/{category.slug}
                    </CardDescription>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (window.confirm(`Удалить категорию "${category.name}"?`)) {
                          deleteCategory.mutate(category.id);
                        }
                      }}
                      disabled={deleteCategory.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать категорию</DialogTitle>
            <DialogDescription>
              Изменить информацию о категории программ
            </DialogDescription>
          </DialogHeader>
          
          {editingCategory && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Название *</Label>
                <Input
                  id="edit-name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="Название категории"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-slug">URL (slug)</Label>
                <Input
                  id="edit-slug"
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  placeholder="URL категории"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description">Описание</Label>
                <Textarea
                  id="edit-description"
                  value={editingCategory.description || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="Описание категории..."
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleEditCategory} disabled={updateCategory.isPending}>
              {updateCategory.isPending ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}