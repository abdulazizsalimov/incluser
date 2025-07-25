import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function WcagGuides() {
  useEffect(() => {
    document.title = "Руководства WCAG - Incluser";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <header className="mb-12 text-center">
              <h1 className="text-4xl font-bold mb-6">
                Руководство по обеспечению доступности веб-контента (WCAG) 2.1
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Подробное руководство по стандартам веб-доступности, переведенное на русский язык
              </p>
            </header>

            <div className="bg-card p-6 rounded-lg border mb-8">
              <h2 className="text-xl font-semibold mb-4">О документе</h2>
              <p className="mb-4">
                Оригинальный нормативный текст Рекомендации Консорциума Всемирной паутины (W3C) на английском языке 
                Web Content Accessibility Guidelines (WCAG) 2.1 доступен на его сайте. Настоящий перевод выполнен 
                в инициативном порядке, имеет статус волонтерского (Volunteer Translation) и может содержать ошибки перевода.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Рекомендация W3C от 5 июня 2018 г.</strong><br />
                Авторские права на оригинальный текст © 2017-2018, W3C® (MIT, ERCIM, Keio и Beihang).<br />
                Перевод © 2019-2020, Евгений Альтовский (ОД «Информация для всех»).
              </p>
            </div>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Резюме</h2>
              <p className="mb-4">
                Руководство по обеспечению доступности веб-контента (WCAG) 2.1 охватывает широкий спектр рекомендаций 
                по обеспечению доступности веб-контента. Следование этим руководящим принципам сделает контент доступным 
                для более широкого круга людей с инвалидностью, включая слепоту и слабовидение, глухоту и слабослышание, 
                ограниченные возможности обучения, когнитивные ограничения, ограниченные возможности передвижения, 
                нарушения речи, светочувствительность и их сочетания.
              </p>
              <p className="mb-4">
                Следование этим руководящим принципам также часто делает веб-контент более удобным для пользователей в целом.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Четыре принципа доступности</h2>
              <p className="mb-6">
                WCAG 2.1 основывается на четырех принципах, которые закладывают основу доступности в Интернете: 
                воспринимаемость, управляемость, понятность и устойчивость.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
                    1. Воспринимаемость
                  </h3>
                  <p className="text-sm">
                    Информация и компоненты пользовательского интерфейса должны быть представлены пользователям 
                    способами, которые они могут воспринимать.
                  </p>
                </div>
                
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-3 text-green-600 dark:text-green-400">
                    2. Управляемость
                  </h3>
                  <p className="text-sm">
                    Компоненты пользовательского интерфейса и навигация должны быть управляемыми.
                  </p>
                </div>
                
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-3 text-purple-600 dark:text-purple-400">
                    3. Понятность
                  </h3>
                  <p className="text-sm">
                    Информация и работа пользовательского интерфейса должны быть понятными.
                  </p>
                </div>
                
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-3 text-orange-600 dark:text-orange-400">
                    4. Устойчивость
                  </h3>
                  <p className="text-sm">
                    Контент должен быть достаточно устойчивым, чтобы его могли интерпретировать самые разнообразные 
                    пользовательские агенты, включая вспомогательные технологии.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Уровни соответствия</h2>
              <p className="mb-4">
                WCAG 2.1 определяет три уровня соответствия:
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="bg-card p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Уровень A (минимальный)</h4>
                  <p className="text-sm">
                    Базовый уровень доступности, который должен соблюдаться всеми веб-ресурсами.
                  </p>
                </div>
                
                <div className="bg-card p-4 rounded-lg border-l-4 border-yellow-500">
                  <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">Уровень AA (стандартный)</h4>
                  <p className="text-sm">
                    Рекомендуемый уровень для большинства веб-ресурсов, включающий дополнительные требования.
                  </p>
                </div>
                
                <div className="bg-card p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Уровень AAA (расширенный)</h4>
                  <p className="text-sm">
                    Высший уровень доступности с самыми строгими требованиями.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Основные критерии успеха</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
                    1. Воспринимаемость
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">1.1 Текстовые альтернативы</h4>
                      <p className="text-sm text-muted-foreground">
                        Предоставление текстовых альтернатив любому нетекстовому контенту для преобразования 
                        в другие формы, которые нужны людям, например крупный шрифт, шрифт Брайля, синтез речи, 
                        символы или более простой язык.
                      </p>
                    </div>
                    
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">1.2 Динамичный медиа-контент</h4>
                      <p className="text-sm text-muted-foreground">
                        Предоставление альтернатив для динамичного медиа-контента.
                      </p>
                    </div>
                    
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">1.3 Адаптируемость</h4>
                      <p className="text-sm text-muted-foreground">
                        Создание контента, который может быть представлен различными способами без потери смысла или структуры.
                      </p>
                    </div>
                    
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">1.4 Различимость</h4>
                      <p className="text-sm text-muted-foreground">
                        Облегчение пользователям видеть и слышать контент, включая отделение переднего плана от фона.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-400">
                    2. Управляемость
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">2.1 Доступность с клавиатуры</h4>
                      <p className="text-sm text-muted-foreground">
                        Обеспечение доступности всей функциональности с клавиатуры.
                      </p>
                    </div>
                    
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">2.2 Достаток времени</h4>
                      <p className="text-sm text-muted-foreground">
                        Предоставление пользователям достаточного времени для чтения и использования контента.
                      </p>
                    </div>
                    
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">2.3 Припадки и физические реакции</h4>
                      <p className="text-sm text-muted-foreground">
                        Избегание дизайна контента способом, который, как известно, вызывает припадки или физические реакции.
                      </p>
                    </div>
                    
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">2.4 Доступность навигации</h4>
                      <p className="text-sm text-muted-foreground">
                        Предоставление способов помочь пользователям ориентироваться, находить контент и определять свое местоположение.
                      </p>
                    </div>
                    
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">2.5 Модальность ввода</h4>
                      <p className="text-sm text-muted-foreground">
                        Облегчение пользователям работы с функциональностью через различные устройства ввода, помимо клавиатуры.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-purple-600 dark:text-purple-400">
                    3. Понятность
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">3.1 Удобочитаемость</h4>
                      <p className="text-sm text-muted-foreground">
                        Обеспечение читаемости и понятности текстового контента.
                      </p>
                    </div>
                    
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">3.2 Предсказуемость</h4>
                      <p className="text-sm text-muted-foreground">
                        Обеспечение появления и работы веб-страниц предсказуемыми способами.
                      </p>
                    </div>
                    
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">3.3 Помощь при вводе</h4>
                      <p className="text-sm text-muted-foreground">
                        Помощь пользователям избегать ошибок и исправлять их.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-orange-600 dark:text-orange-400">
                    4. Устойчивость
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">4.1 Совместимость</h4>
                      <p className="text-sm text-muted-foreground">
                        Максимизация совместимости с существующими и будущими вспомогательными технологиями.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Практические рекомендации</h2>
              
              <div className="bg-card p-6 rounded-lg border mb-6">
                <h3 className="text-xl font-semibold mb-4">Основные шаги для обеспечения доступности:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Используйте семантически правильную разметку HTML</li>
                  <li>Обеспечьте адекватный цветовой контраст (минимум 4.5:1 для обычного текста)</li>
                  <li>Добавьте альтернативный текст для всех изображений</li>
                  <li>Убедитесь, что сайт полностью доступен с клавиатуры</li>
                  <li>Используйте заголовки для структурирования контента</li>
                  <li>Предоставьте описательные ссылки</li>
                  <li>Обеспечьте формы понятными подписями и инструкциями</li>
                  <li>Тестируйте сайт с помощью программ чтения с экрана</li>
                </ol>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Инструменты для тестирования</h2>
              <p className="mb-4">
                Для проверки соответствия WCAG рекомендуется использовать комбинацию автоматических инструментов 
                и ручного тестирования:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm mb-4">
                <li><strong>Автоматические инструменты:</strong> WAVE, axe-core, Lighthouse Accessibility Audit</li>
                <li><strong>Программы чтения с экрана:</strong> NVDA, JAWS, VoiceOver</li>
                <li><strong>Тестирование клавиатуры:</strong> навигация только с помощью Tab, Enter, стрелок</li>
                <li><strong>Проверка контраста:</strong> Colour Contrast Analyser, WebAIM Contrast Checker</li>
              </ul>
            </section>

            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-bold mb-4">Заключение</h2>
              <p className="mb-4">
                WCAG 2.1 представляет собой комплексный набор рекомендаций, которые помогают создавать доступный 
                веб-контент для всех пользователей. Следование этим принципам не только улучшает доступность для 
                людей с инвалидностью, но и повышает общее качество пользовательского опыта.
              </p>
              <p className="text-sm text-muted-foreground">
                Для получения полного текста руководства и дополнительных ресурсов посетите официальный сайт W3C 
                или воспользуйтесь переводом на сайте «Информация для всех».
              </p>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}