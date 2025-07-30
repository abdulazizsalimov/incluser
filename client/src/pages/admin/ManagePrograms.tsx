import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ProgramWithRelations } from "@shared/schema";

export default function ManagePrograms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
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

  const { data: categories } = useQuery({
    queryKey: ["/api/admin/program-categories"],
  });

  const deleteProgram = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/admin/programs/${id}`, {
        method: "DELETE",
      });
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

  const togglePublish = useMutation({
    mutationFn: async ({ id, isPublished }: { id: number; isPublished: boolean }) => {
      await apiRequest(`/api/admin/programs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !isPublished }),
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
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Добавить программу
        </Button>
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
            <Button>
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