import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MetaTags from "@/components/MetaTags";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Shield, Eye, Lock, Mail, FileText, Clock } from "lucide-react";

export default function PrivacyPolicy() {
  usePageTitle("Политика конфиденциальности - Incluser");

  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title="Политика конфиденциальности | Incluser"
        description="Политика конфиденциальности сайта Incluser.uz - как мы обрабатываем и защищаем ваши персональные данные"
        url={window.location.href}
      />
      <Header />
      
      <main id="main-content" role="main">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-purple-700 dark:via-blue-700 dark:to-indigo-700 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-6">
              <Shield className="w-12 h-12" />
              <h1 className="text-4xl font-bold">
                Политика конфиденциальности
              </h1>
            </div>
            <p className="text-xl opacity-90 max-w-3xl">
              Мы уважаем ваше право на конфиденциальность и обеспечиваем прозрачность в вопросах обработки персональных данных
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Последнее обновление: июль 2025 г.
                </p>
                <p className="text-blue-800 dark:text-blue-200">
                  Сайт Incluser.uz серьезно относится к защите персональных данных пользователей и соблюдает принципы прозрачности в их обработке.
                </p>
              </div>

              {/* Какие данные собираем */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold mb-0">Какие данные мы собираем</h2>
                </div>
                <p className="text-lg text-muted-foreground mb-4">
                  Через формы обратной связи на нашем сайте мы можем получать следующую информацию:
                </p>
                <ul className="space-y-2 text-base">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Имя пользователя</strong> — для персонализации общения</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Адрес электронной почты</strong> — для возможности ответить на ваше обращение</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Тема и текст сообщения</strong> — содержание вашего обращения</span>
                  </li>
                </ul>
              </div>

              {/* Как используем данные */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold mb-0">Цели обработки данных</h2>
                </div>
                <p className="text-lg text-muted-foreground mb-4">
                  Предоставленные вами персональные данные используются исключительно в следующих целях:
                </p>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                  <div className="p-4 bg-card border border-border rounded-lg">
                    <Mail className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">Обработка обращений</h3>
                    <p className="text-sm text-muted-foreground">
                      Своевременное рассмотрение и ответ на ваши вопросы и предложения
                    </p>
                  </div>
                  <div className="p-4 bg-card border border-border rounded-lg">
                    <Shield className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">Обратная связь</h3>
                    <p className="text-sm text-muted-foreground">
                      Поддержание диалога с пользователями для улучшения сервиса
                    </p>
                  </div>
                  <div className="p-4 bg-card border border-border rounded-lg">
                    <Eye className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">Улучшение сайта</h3>
                    <p className="text-sm text-muted-foreground">
                      Анализ обращений для повышения доступности и качества контента
                    </p>
                  </div>
                </div>
              </div>

              {/* Принципы обработки */}
              <div className="mb-10 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <h2 className="text-2xl font-bold mb-0 text-green-900 dark:text-green-100">Принципы безопасности</h2>
                </div>
                <ul className="space-y-3 text-green-800 dark:text-green-200">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Никаким маркетинговым целям</strong> ваши данные не служат</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Третьим лицам данные не передаются</strong> без вашего явного согласия</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Минимальные сроки хранения</strong> — данные удаляются после обработки обращения</span>
                  </li>
                </ul>
              </div>

              {/* Cookies и аналитика */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold mb-0">Файлы cookie и аналитика</h2>
                </div>
                <p className="text-lg">
                  Наш сайт <strong>не использует сторонние системы аналитики</strong> и не устанавливает 
                  сторонние файлы cookie без вашего ведома. Мы используем только технически необходимые 
                  файлы cookie для обеспечения корректной работы сайта.
                </p>
              </div>

              {/* Права пользователей */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold mb-0">Ваши права</h2>
                </div>
                <p className="text-lg mb-4">
                  В соответствии с принципами защиты персональных данных, вы имеете следующие права:
                </p>
                <div className="bg-card border border-border rounded-lg p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Право на доступ</strong> — узнать, какие данные о вас мы обрабатываем</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Право на исправление</strong> — запросить изменение неточных данных</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Право на удаление</strong> — потребовать удаления ваших персональных данных</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Право на возражение</strong> — отозвать согласие на обработку данных</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Контакты */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold mb-0">Контакты по вопросам конфиденциальности</h2>
                </div>
                <p className="text-lg mb-4">
                  Если у вас возникли вопросы о том, как обрабатываются ваши персональные данные, 
                  или вы хотите воспользоваться своими правами, пожалуйста, свяжитесь с нами.
                </p>
                <p className="font-medium">
                  Вы можете использовать <strong>любые доступные способы связи, указанные на 
                  странице "Контакты"</strong> данного сайта. Мы обязуемся рассмотреть ваше 
                  обращение в кратчайшие сроки.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}