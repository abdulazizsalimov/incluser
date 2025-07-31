import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AlertTriangle } from "lucide-react";

const reportProblemSchema = z.object({
  name: z.string().min(1, "Имя обязательно"),
  email: z.string().email("Некорректный email адрес"),
  subject: z.string().min(1, "Тема обязательна"),
  message: z.string().min(10, "Сообщение должно содержать минимум 10 символов"),
});

type ReportProblemForm = z.infer<typeof reportProblemSchema>;

interface ReportProblemDialogProps {
  children: React.ReactNode;
}

export default function ReportProblemDialog({ children }: ReportProblemDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ReportProblemForm>({
    resolver: zodResolver(reportProblemSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ReportProblemForm) => {
      await apiRequest("/api/contact", "POST", {
        ...data,
        type: "problem_report",
      });
    },
    onSuccess: () => {
      toast({
        title: "Сообщение отправлено",
        description: "Спасибо за информацию о проблеме. Мы рассмотрим её в ближайшее время.",
      });
      form.reset();
      setOpen(false);
      // Invalidate admin messages cache if admin is logged in
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить сообщение. Попробуйте ещё раз.",
        variant: "destructive",
      });
      console.error("Error submitting problem report:", error);
    },
  });

  const onSubmit = (data: ReportProblemForm) => {
    submitMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Сообщить о проблеме
          </DialogTitle>
          <DialogDescription>
            Если вы столкнулись с проблемой доступности или техническими неполадками на сайте, сообщите нам. 
            Мы стараемся исправить все проблемы как можно быстрее.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ваше имя *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Введите ваше имя" 
                        {...field}
                        autoComplete="name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="your.email@example.com" 
                        {...field}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тема *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Кратко опишите проблему"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание проблемы *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Подробно опишите проблему: что происходит, какие действия приводят к ошибке, какое устройство и программу экранного доступа вы используете..."
                      className="min-h-[120px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Отправляя сообщение, вы соглашаетесь с{" "}
                <a 
                  href="/privacy-policy" 
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  политикой конфиденциальности
                </a>
                .
              </p>
              
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={submitMutation.isPending}
                >
                  Отмена
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitMutation.isPending}
                  className="bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
                >
                  {submitMutation.isPending ? "Отправка..." : "Отправить"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}