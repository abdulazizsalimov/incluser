import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Upload } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ProgramWithRelations } from "@shared/schema";

export default function ManagePrograms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [actualSearch, setActualSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Debounce search to prevent constant re-renders
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setActualSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramWithRelations | null>(null);
  const [newProgram, setNewProgram] = useState({
    title: "",
    version: "",
    slug: "",
    description: "",
    whatsNew: "",
    detailedDescription: "",
    developer: "",
    logo: "",
    officialWebsite: "",
    downloadUrl: "",
    googlePlayUrl: "",
    appStoreUrl: "",
    categoryId: 0,
    isPublished: true,
    releaseYear: new Date().getFullYear(),
    license: "",
    platforms: [] as string[],
    pricing: "free",
    price: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUploadType, setLogoUploadType] = useState<"url" | "file">("url");
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
    queryKey: ["/api/admin/programs", { search: actualSearch, categoryId: selectedCategory }],
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

  const updateProgram = useMutation({
    mutationFn: async (data: any) => {
      if (!editingProgram) throw new Error("No program selected for editing");
      
      let finalData = { ...data };
      
      // Handle logo file upload if needed
      if (logoFile && logoUploadType === "file") {
        const formData = new FormData();
        formData.append("image", logoFile);
        
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error("Failed to upload logo");
        }
        
        const result = await response.json();
        finalData.logo = result.url;
      }
      
      return await apiRequest(`/api/admin/programs/${editingProgram.id}`, "PUT", finalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/programs"] });
      setIsEditDialogOpen(false);
      setEditingProgram(null);
      setNewProgram({
        title: "",
        version: "",
        slug: "",
        description: "",
        whatsNew: "",
        detailedDescription: "",
        developer: "",
        logo: "",
        officialWebsite: "",
        downloadUrl: "",
        googlePlayUrl: "",
        appStoreUrl: "",
        categoryId: 0,
        isPublished: true,
        releaseYear: new Date().getFullYear(),
        license: "",
        platforms: [] as string[],
        pricing: "free",
        price: "",
      });
      setLogoFile(null);
      toast({
        title: "Программа обновлена",
        description: "Программа была успешно обновлена",
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
        version: "",
        slug: "",
        description: "",
        whatsNew: "",
        detailedDescription: "",
        developer: "",
        logo: "",
        officialWebsite: "",
        downloadUrl: "",
        googlePlayUrl: "",
        appStoreUrl: "",
        categoryId: 0,
        isPublished: true,
        releaseYear: new Date().getFullYear(),
        license: "",
        platforms: [] as string[],
        pricing: "free",
        price: "",
      });
      setLogoFile(null);
      setLogoUploadType("url");
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

  // Open edit dialog
  const openEditDialog = (program: ProgramWithRelations) => {
    setEditingProgram(program);
    setNewProgram({
      title: program.title || "",
      version: program.version || "",
      slug: program.slug || "",
      description: program.description || "",
      whatsNew: program.whatsNew || "",
      detailedDescription: program.detailedDescription || "",
      developer: program.developer || "",
      logo: program.logo || "",
      officialWebsite: program.officialWebsite || "",
      downloadUrl: program.downloadUrl || "",
      googlePlayUrl: program.googlePlayUrl || "",
      appStoreUrl: program.appStoreUrl || "",
      categoryId: program.categoryId || 0,
      isPublished: program.isPublished || false,
      releaseYear: program.releaseYear || new Date().getFullYear(),
      license: program.license || "",
      platforms: program.platforms || [],
      pricing: program.pricing || "free",
      price: program.price || "",
    });
    setLogoFile(null);
    setLogoUploadType("url");
    setIsEditDialogOpen(true);
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
  const handleCreateProgram = async () => {
    if (!newProgram.title || !newProgram.description || !newProgram.developer || !newProgram.categoryId) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    let programData = { ...newProgram };

    // Handle file upload if a file is selected
    if (logoUploadType === "file" && logoFile) {
      try {
        const formData = new FormData();
        formData.append('image', logoFile);

        const response = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const { filePath } = await response.json();
        programData.logo = filePath;
      } catch (error) {
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить изображение",
          variant: "destructive",
        });
        return;
      }
    }

    if (editingProgram) {
      updateProgram.mutate(programData);
    } else {
      createProgram.mutate(programData);
    }
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
        <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
          setIsCreateDialogOpen(open && !editingProgram);
          setIsEditDialogOpen(open && !!editingProgram);
          if (!open) {
            setEditingProgram(null);
            setNewProgram({
              title: "",
              version: "",
              slug: "",
              description: "",
              whatsNew: "",
              detailedDescription: "",
              developer: "",
              logo: "",
              officialWebsite: "",
              downloadUrl: "",
              googlePlayUrl: "",
              appStoreUrl: "",
              categoryId: 0,
              isPublished: true,
              releaseYear: new Date().getFullYear(),
              license: "",
              platforms: [] as string[],
              pricing: "free",
              price: "",
            });
            setLogoFile(null);
            setLogoUploadType("url");
          }
        }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Добавить программу
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>{editingProgram ? "Редактировать программу" : "Добавить новую программу"}</DialogTitle>
              <DialogDescription>
                {editingProgram ? "Изменить информацию о программе." : "Заполните информацию о программе."} Поля отмеченные * обязательны для заполнения.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 overflow-y-auto flex-1">
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
                <Label htmlFor="version" className="text-right">
                  Версия
                </Label>
                <Input
                  id="version"
                  value={newProgram.version}
                  onChange={(e) => handleNewProgramChange('version', e.target.value)}
                  className="col-span-3"
                  placeholder="1.0.0"
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
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">
                  Логотип/Иконка
                </Label>
                <div className="col-span-3">
                  <Tabs value={logoUploadType} onValueChange={(value) => setLogoUploadType(value as "url" | "file")}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="url">URL</TabsTrigger>
                      <TabsTrigger value="file">Файл</TabsTrigger>
                    </TabsList>
                    <TabsContent value="url" className="mt-2">
                      <Input
                        value={newProgram.logo}
                        onChange={(e) => handleNewProgramChange('logo', e.target.value)}
                        placeholder="URL изображения логотипа"
                      />
                    </TabsContent>
                    <TabsContent value="file" className="mt-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                toast({
                                  title: "Файл слишком большой",
                                  description: "Размер файла не должен превышать 5 МБ",
                                  variant: "destructive",
                                });
                                return;
                              }
                              setLogoFile(file);
                            }
                          }}
                          className="flex-1"
                        />
                        <Upload className="w-4 h-4 text-muted-foreground" />
                      </div>
                      {logoFile && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Выбран файл: {logoFile.name}
                        </p>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="officialWebsite" className="text-right">
                  Сайт
                </Label>
                <Input
                  id="officialWebsite"
                  value={newProgram.officialWebsite}
                  onChange={(e) => handleNewProgramChange('officialWebsite', e.target.value)}
                  className="col-span-3"
                  placeholder="https://example.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="downloadUrl" className="text-right">
                  Скачать
                </Label>
                <Input
                  id="downloadUrl"
                  value={newProgram.downloadUrl}
                  onChange={(e) => handleNewProgramChange('downloadUrl', e.target.value)}
                  className="col-span-3"
                  placeholder="Прямая ссылка для скачивания"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="googlePlayUrl" className="text-right">
                  Google Play
                </Label>
                <Input
                  id="googlePlayUrl"
                  value={newProgram.googlePlayUrl}
                  onChange={(e) => handleNewProgramChange('googlePlayUrl', e.target.value)}
                  className="col-span-3"
                  placeholder="https://play.google.com/store/apps/details?id=..."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="appStoreUrl" className="text-right">
                  App Store
                </Label>
                <Input
                  id="appStoreUrl"
                  value={newProgram.appStoreUrl}
                  onChange={(e) => handleNewProgramChange('appStoreUrl', e.target.value)}
                  className="col-span-3"
                  placeholder="https://apps.apple.com/app/..."
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
                    {Array.isArray(categories) && categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Год выпуска */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="releaseYear" className="text-right">
                  Год выпуска
                </Label>
                <Input
                  id="releaseYear"
                  type="number"
                  value={newProgram.releaseYear}
                  onChange={(e) => handleNewProgramChange('releaseYear', parseInt(e.target.value) || new Date().getFullYear())}
                  className="col-span-3"
                  placeholder="2024"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                />
              </div>
              
              {/* Лицензия */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="license" className="text-right">
                  Лицензия
                </Label>
                <Input
                  id="license"
                  value={newProgram.license}
                  onChange={(e) => handleNewProgramChange('license', e.target.value)}
                  className="col-span-3"
                  placeholder="GPL, MIT, Проприетарная, Бесплатная и т.д."
                />
              </div>
              
              {/* Операционные системы */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">
                  Операционные системы
                </Label>
                <div className="col-span-3 space-y-2">
                  {['windows', 'macos', 'linux', 'ios', 'android', 'web'].map((platform) => (
                    <label key={platform} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newProgram.platforms && newProgram.platforms.includes(platform)}
                        onChange={(e) => {
                          const currentPlatforms = [...(newProgram.platforms || [])];
                          if (e.target.checked) {
                            currentPlatforms.push(platform);
                          } else {
                            const index = currentPlatforms.indexOf(platform);
                            if (index > -1) currentPlatforms.splice(index, 1);
                          }
                          handleNewProgramChange('platforms', currentPlatforms);
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm capitalize">
                        {platform === 'macos' ? 'macOS' : 
                         platform === 'ios' ? 'iOS' : 
                         platform === 'web' ? 'Веб-браузер' :
                         platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Стоимость */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pricing" className="text-right">
                  Стоимость
                </Label>
                <Select
                  value={newProgram.pricing}
                  onValueChange={(value) => handleNewProgramChange('pricing', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Выберите тип стоимости" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Бесплатная</SelectItem>
                    <SelectItem value="freemium">Условно бесплатная</SelectItem>
                    <SelectItem value="paid">Платная</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Цена (показывается только для платных) */}
              {newProgram.pricing === 'paid' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Цена
                  </Label>
                  <Input
                    id="price"
                    value={newProgram.price}
                    onChange={(e) => handleNewProgramChange('price', e.target.value)}
                    className="col-span-3"
                    placeholder="$19.99, 1500 руб., €15 и т.д."
                  />
                </div>
              )}
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right mt-2">
                  Описание *
                </Label>
                <Textarea
                  id="description"
                  value={newProgram.description}
                  onChange={(e) => handleNewProgramChange('description', e.target.value)}
                  className="col-span-3"
                  placeholder="Краткое описание программы..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="whatsNew" className="text-right mt-2">
                  Что нового
                </Label>
                <Textarea
                  id="whatsNew"
                  value={newProgram.whatsNew}
                  onChange={(e) => handleNewProgramChange('whatsNew', e.target.value)}
                  className="col-span-3"
                  placeholder="Новые функции и изменения..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="detailedDescription" className="text-right mt-2">
                  Подробное описание
                </Label>
                <Textarea
                  id="detailedDescription"
                  value={newProgram.detailedDescription}
                  onChange={(e) => handleNewProgramChange('detailedDescription', e.target.value)}
                  className="col-span-3"
                  placeholder="Детальная информация о программе..."
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setIsEditDialogOpen(false);
                }}
              >
                Отмена
              </Button>
              <Button
                type="button"
                onClick={handleCreateProgram}
                disabled={createProgram.isPending || updateProgram.isPending}
              >
                {editingProgram 
                  ? (updateProgram.isPending ? "Сохранение..." : "Сохранить изменения")
                  : (createProgram.isPending ? "Создание..." : "Создать программу")
                }
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
          {Array.isArray(categories) && categories.map((category: any) => (
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
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => openEditDialog(program)}
                  >
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