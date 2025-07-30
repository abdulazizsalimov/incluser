import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePageTitle } from "@/hooks/usePageTitle";

const contactSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email адрес"),
  subject: z.string().min(5, "Тема должна содержать минимум 5 символов"),
  message: z.string().min(10, "Сообщение должно содержать минимум 10 символов"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  usePageTitle("Контакты - Incluser");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          type: "contact"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      toast({
        title: "Сообщение отправлено!",
        description: "Спасибо за ваше сообщение. Отвечу в течение 24 часов.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Ошибка отправки",
        description: "Произошла ошибка при отправке сообщения. Попробуйте ещё раз.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main id="main-content" role="main">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-purple-700 dark:via-blue-700 dark:to-indigo-700 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Контакты</h1>
            <p className="text-xl opacity-90">
              Свяжитесь со мной по вопросам цифровой доступности или сотрудничества
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Как со мной связаться
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                    Готов ответить на ваши вопросы о веб-доступности, обсудить возможности 
                    сотрудничества или выслушать ваш опыт в области инклюзивного дизайна.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <p className="text-muted-foreground">
                        Основной способ связи для деловых вопросов
                      </p>
                      <a 
                        href="mailto:salimov.abdulaziz.98@gmail.com" 
                        className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded"
                      >
                        salimov.abdulaziz.98@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Телефон</h3>
                      <p className="text-muted-foreground">
                        Для срочных вопросов и консультаций
                      </p>
                      <a 
                        href="tel:+998998316983" 
                        className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded"
                      >
                        +998 (99) 831-69-83
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Местоположение</h3>
                      <p className="text-muted-foreground">
                        Ташкент, Узбекистан
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Часовой пояс: UTC+5
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-3">О чём можно написать:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Вопросы по веб-доступности и WCAG</li>
                    <li>• Предложения по сотрудничеству</li>
                    <li>• Запросы на консультации</li>
                    <li>• Идеи для статей</li>
                    <li>• Обратная связь по блогу</li>
                  </ul>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5" aria-hidden="true" />
                      Отправить сообщение
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Имя *</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Ваше имя"
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
                                  {...field}
                                  type="email"
                                  placeholder="your@email.com"
                                  autoComplete="email"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Тема *</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Тема вашего сообщения"
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
                              <FormLabel>Сообщение *</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Расскажите подробнее о вашем вопросе или предложении..."
                                  rows={6}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full"
                          size="lg"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Отправляется...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Отправить сообщение
                            </>
                          )}
                        </Button>

                        <p className="text-sm text-muted-foreground">
                          * Обязательные поля. Отвечу в течение 24 часов.
                        </p>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* Live region for form feedback */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="contact-status"></div>
    </div>
  );
}
