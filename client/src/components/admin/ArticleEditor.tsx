import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "./RichTextEditor";
import type { ArticleWithRelations, Category } from "@shared/schema";

const articleSchema = z.object({
  title: z.string().min(1, "Заголовок обязателен").max(200),
  slug: z.string().min(1, "URL-адрес обязателен").max(200),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Содержание обязательно"),
  featuredImage: z.string().url().optional().or(z.literal("")),
  featuredImageAlt: z.string().optional(),
  isPublished: z.boolean(),
  categoryId: z.number().optional(),
  readingTime: z.number().min(1).optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface ArticleEditorProps {
  article?: ArticleWithRelations;
  categories: Category[];
  onSave: (data: ArticleFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ArticleEditor({ 
  article, 
  categories, 
  onSave, 
  onCancel, 
  isLoading = false 
}: ArticleEditorProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || "",
      slug: article?.slug || "",
      excerpt: article?.excerpt || "",
      content: article?.content || "",
      featuredImage: article?.featuredImage || "",
      featuredImageAlt: article?.featuredImageAlt || "",
      isPublished: article?.isPublished || false,
      categoryId: article?.categoryId || undefined,
      readingTime: article?.readingTime || undefined,
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9а-я\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    if (!article) {
      const slug = generateSlug(title);
      form.setValue("slug", slug);
    }
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleContentChange = (content: string) => {
    const readingTime = estimateReadingTime(content);
    form.setValue("readingTime", readingTime);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Содержание статьи</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Заголовок</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleTitleChange(e.target.value);
                          }}
                          placeholder="Заголовок статьи"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL-адрес</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="url-adres-stati" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Краткое описание</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Краткое описание статьи"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Содержание</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value || ""}
                          onChange={(content) => {
                            field.onChange(content);
                            handleContentChange(content);
                          }}
                          placeholder="Начните вводить содержание статьи..."
                          height={500}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Публикация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Опубликовано</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Категория</FormLabel>
                      <Select
                        value={field.value ? field.value.toString() : "none"}
                        onValueChange={(value) => field.onChange(value === "none" ? undefined : parseInt(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Без категории</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="readingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Время чтения (минуты)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          placeholder="Автоматически рассчитано"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Главное изображение</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="featuredImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL изображения</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featuredImageAlt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Альтернативный текст</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Описание изображения" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Сохранение..." : article ? "Обновить" : "Создать"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Отмена
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
