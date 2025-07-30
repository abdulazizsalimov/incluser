import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ProgramWithRelations } from "@shared/schema";

export default function ManagePrograms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProgram, setNewProgram] = useState({
    title: "",
    slug: "",
    description: "",
    developer: "",
    categoryId: 0,
    isPublished: true,
  });
  const { toast } = useToast();

  usePageTitle("Управление программами - Админ панель");

  const { data: programsData, isLoading } = useQuery<{
    programs: ProgramWithRelations[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>({
    queryKey: ["/api/admin/programs", { search: searchTerm, categoryId: selectedCategory }],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/admin/program-categories"],
  });

  const deleteProgram = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/admin/programs/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/programs"] });
      toast({
        title: "Программа удалена",
        description: "Программа была успешно удалена",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createProgram = useMutation({
    mutationFn: async (programData: any) => {
      return await apiRequest("/api/admin/programs", "POST", programData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/programs"] });
      setIsCreateDialogOpen(false);
      setNewProgram({
        title: "",
        slug: "",
        description: "",
        developer: "",
        categoryId: 0,
        isPublished: true,
      });
      toast({
        title: "Программа создана",
        description: "Новая программа была успешно добавлена",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, isPublished }: { id: number; isPublished: boolean }) => {
      return await apiRequest(`/api/admin/programs/${id}`, "PUT", { 
        isPublished: !isPublished 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/programs"] });
      toast({
        title: "Статус обновлен",
        description: "Статус публикации программы изменен",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const programs = programsData?.programs || [];

  // Helper function to create slug from title
  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9а-я]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Handle form changes
  const handleNewProgramChange = (field: string, value: any) => {
    setNewProgram(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug when title changes
      if (field === 'title') {
        updated.slug = createSlug(value);
      }
      return updated;
    });
  };

  // Handle form submission
  const handleCreateProgram = () => {
    if (!newProgram.title || !newProgram.description || !newProgram.developer || !newProgram.categoryId) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }
    createProgram.mutate(newProgram);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Управление программами</h1>
          <p className="text-muted-foreground mt-2">
            Всего программ: {programsData?.pagination.total || 0}
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Добавить программу
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Добавить новую программу</DialogTitle>
              <DialogDescription>
                Заполните информацию о программе. Поля отмеченные * обязательны для заполнения.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Название *
                </Label>
                <Input
                  id="title"
                  value={newProgram.title}
                  onChange={(e) => handleNewProgramChange('title', e.target.value)}
                  className="col-span-3"
                  placeholder="Название программы"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="slug" className="text-right">
                  Slug
                </Label>
                <Input
                  id="slug"
                  value={newProgram.slug}
                  onChange={(e) => handleNewProgramChange('slug', e.target.value)}
                  className="col-span-3"
                  placeholder="url-адрес"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="developer" className="text-right">
                  Разработчик *
                </Label>
                <Input
                  id="developer"
                  value={newProgram.developer}
                  onChange={(e) => handleNewProgramChange('developer', e.target.value)}
                  className="col-span-3"
                  placeholder="Название разработчика"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Категория *
                </Label>
                <Select
                  value={newProgram.categoryId ? newProgram.categoryId.toString() : ""}
                  onValueChange={(value) => handleNewProgramChange('categoryId', parseInt(value))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category: any) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right mt-2">
                  Описание *
                </Label>
                <Textarea
                  id="description"
                  value={newProgram.description}
                  onChange={(e) => handleNewProgramChange('description', e.target.value)}
                  className="col-span-3"
                  placeholder="Описание программы..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Отмена
              </Button>
              <Button
                type="button"
                onClick={handleCreateProgram}
                disabled={createProgram.isPending}
              >
                {createProgram.isPending ? "Создание..." : "Создать программу"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Поиск программ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
          className="px-3 py-2 border border-input bg-background rounded-md"
        >
          <option value="">Все категории</option>
          {categories?.map((category: any) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {programs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Программы не найдены</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory
                ? "Попробуйте изменить параметры поиска"
                : "Создайте первую программу, чтобы начать"}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить программу
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Card key={program.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {program.logo && (
                      <img
                        src={program.logo}
                        alt={`${program.title} логотип`}
                        className="w-12 h-12 object-contain"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg leading-tight">
                        {program.title}
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {program.developer}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant={program.isPublished ? "default" : "secondary"}>
                      {program.isPublished ? "Опубликована" : "Черновик"}
                    </Badge>
                    {program.category && (
                      <Badge variant="outline" className="text-xs">
                        {program.category.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {program.description}
                </p>
                
                {program.platforms && Array.isArray(program.platforms) && program.platforms.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {program.platforms.map((platform: string) => (
                      <Badge key={platform} variant="secondary" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Изменить
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => togglePublish.mutate({ id: program.id, isPublished: program.isPublished || false })}
                    disabled={togglePublish.isPending}
                  >
                    {program.isPublished ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (confirm("Вы уверены, что хотите удалить эту программу?")) {
                        deleteProgram.mutate(program.id);
                      }
                    }}
                    disabled={deleteProgram.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}