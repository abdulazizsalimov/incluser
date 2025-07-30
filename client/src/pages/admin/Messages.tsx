import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Mail, MailOpen, Clock, User, Calendar, AlertTriangle, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { usePageTitle } from "@/hooks/usePageTitle";
import type { ContactMessage } from "@shared/schema";

export default function Messages() {
  usePageTitle("Сообщения - Админ панель");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ['/api/admin/messages'],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/admin/messages/${id}/read`, 'PATCH', {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/messages'] });
      toast({
        title: "Сообщение отмечено как прочитанное",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось отметить сообщение как прочитанное",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/admin/messages/${id}`, 'DELETE', undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/messages'] });
      toast({
        title: "Сообщение удалено",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить сообщение",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Загрузка сообщений...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Сообщения</h1>
        <p className="text-muted-foreground">
          Управление сообщениями из формы обратной связи
        </p>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Mail className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Пока нет сообщений</h3>
            <p className="text-muted-foreground">
              Новые сообщения из формы обратной связи будут отображаться здесь
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {messages.map((message) => (
            <Card key={message.id} className={`${!message.isRead ? 'border-primary bg-primary/5' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{message.subject}</CardTitle>
                      {message.type === "problem_report" && (
                        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Проблема
                        </Badge>
                      )}
                      {(!message.type || message.type === "contact") && (
                        <Badge variant="outline" className="text-xs">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Обратная связь
                        </Badge>
                      )}
                      {!message.isRead && (
                        <Badge variant="default" className="text-xs">
                          Новое
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {message.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <a 
                          href={`mailto:${message.email}`}
                          className="hover:text-primary"
                        >
                          {message.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(message.createdAt!)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!message.isRead && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsReadMutation.mutate(message.id)}
                        disabled={markAsReadMutation.isPending}
                      >
                        <MailOpen className="w-4 h-4 mr-1" />
                        Прочитано
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(message.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{message.message}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}