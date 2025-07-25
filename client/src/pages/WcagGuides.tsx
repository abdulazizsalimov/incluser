import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Volume2, VolumeX } from "lucide-react";

export default function WcagGuides() {
  const [pdfError, setPdfError] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [speechInstance, setSpeechInstance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  useEffect(() => {
    // Прокручиваем в начало страницы при загрузке
    window.scrollTo(0, 0);
    
    document.title = "Руководство по обеспечению доступности веб-контента (WCAG) 2.1 - Incluser";
    
    // Определяем текущую тему
    const checkTheme = () => {
      const htmlElement = document.documentElement;
      setIsDarkTheme(htmlElement.classList.contains('dark'));
    };
    
    // Проверяем при загрузке
    checkTheme();
    
    // Наблюдаем за изменениями темы
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Текст для озвучивания основных разделов WCAG 2.1
  const wcagContent = `
    Руководство по обеспечению доступности веб-контента WCAG 2.1.
    
    Резюме:
    Руководство по обеспечению доступности веб-контента WCAG 2.1 содержит широкий спектр рекомендаций по обеспечению большей доступности веб-контента. Следование Руководству позволит сделать контент более доступным для большего числа людей с различными ограничениями, включая незрячих и слабовидящих, глухих и слабослышащих, с ограничениями подвижности, нарушениями речи, светочувствительностью, и их комбинациями, а также пониженной обучаемостью и расстройством когнитивных функций.

    Четыре принципа доступности:

    Принцип 1. Воспринимаемость.
    Информация и компоненты интерфейса пользователя должны быть представлены пользователям в форме, которая будет им доступна для восприятия. Это означает, что пользователи должны быть способны воспринимать представляемую им информацию - она не может быть невидимой для всех их органов чувств.

    Принцип 2. Управляемость.
    Компоненты интерфейса пользователя и навигация должны быть управляемыми. Это означает, что пользователи должны быть способны управлять элементами интерфейса - интерфейс не может требовать взаимодействия, которое пользователь не может выполнить.

    Принцип 3. Понятность.
    Информация и работа пользовательского интерфейса должны быть понятными. Это означает, что пользователи должны быть способны понимать информацию, а также работу пользовательского интерфейса - контент или работа не может быть сложнее того, что пользователь может понять.

    Принцип 4. Устойчивость.
    Контент должен быть достаточно устойчивым, чтобы его могли интерпретировать самые разнообразные пользовательские агенты, включая вспомогательные технологии. Это означает, что пользователи должны быть способны получать доступ к контенту по мере развития их технологий - по мере развития технологий и пользовательских агентов, контент должен оставаться доступным.

    Для полного изучения всех директив и критериев успеха, используйте полный PDF документ, представленный ниже.
  `;

  const handleSpeech = () => {
    if (isReading) {
      // Остановить чтение
      if (speechInstance) {
        speechSynthesis.cancel();
        setIsReading(false);
        setSpeechInstance(null);
      }
    } else {
      // Начать чтение
      const utterance = new SpeechSynthesisUtterance(wcagContent);
      
      // Настройки голоса
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Попытка найти русский голос
      const voices = speechSynthesis.getVoices();
      const russianVoice = voices.find(voice => 
        voice.lang.includes('ru') || voice.name.toLowerCase().includes('russian')
      );
      if (russianVoice) {
        utterance.voice = russianVoice;
      }

      utterance.onstart = () => {
        setIsReading(true);
      };

      utterance.onend = () => {
        setIsReading(false);
        setSpeechInstance(null);
      };

      utterance.onerror = () => {
        setIsReading(false);
        setSpeechInstance(null);
      };

      setSpeechInstance(utterance);
      speechSynthesis.speak(utterance);
    }
  };

  const pdfUrl = "/attached_assets/wcag-2.1-guide.pdf";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-6">
              Руководство по обеспечению доступности веб-контента (WCAG) 2.1
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              Рекомендация W3C от 5 июня 2018 г. - Полный текст руководства на русском языке
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button 
                onClick={handleSpeech}
                variant={isReading ? "destructive" : "secondary"}
                aria-label={isReading ? "Остановить озвучивание" : "Озвучить введение к WCAG 2.1"}
              >
                {isReading ? (
                  <>
                    <VolumeX className="w-4 h-4 mr-2" />
                    Остановить озвучивание
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Озвучить введение
                  </>
                )}
              </Button>
              
              <Button asChild variant="default">
                <a href={pdfUrl} download>
                  <Download className="w-4 h-4 mr-2" />
                  Скачать PDF
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Открыть в новой вкладке
                </a>
              </Button>
            </div>
          </header>

          <div className="bg-card rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden shadow-lg">
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  📄 Документ WCAG 2.1
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Используйте элементы управления PDF для навигации
                </p>
              </div>
            </div>
            {!pdfError ? (
              <div className="relative w-full bg-gray-50 dark:bg-gray-800 p-1" style={{ height: '80vh' }}>
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-0 rounded"
                  title="Руководство по обеспечению доступности веб-контента (WCAG) 2.1"
                  onError={() => setPdfError(true)}
                />
              </div>
            ) : (
              <div className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-4">Не удается отобразить PDF</h3>
                <p className="text-muted-foreground mb-6">
                  Ваш браузер не поддерживает встроенное отображение PDF файлов.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild>
                    <a href={pdfUrl} download>
                      <Download className="w-4 h-4 mr-2" />
                      Скачать документ
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Открыть в новой вкладке
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-200">
                💡 Для пользователей программ чтения с экрана
              </h3>
              <div className="prose dark:prose-invert max-w-none text-sm">
                <p className="mb-3">
                  NVDA и другие программы чтения с экрана имеют ограниченный доступ к содержимому PDF файлов, 
                  отображаемых в браузере. Для лучшего восприятия содержимого рекомендуем:
                </p>
                <ul className="list-disc list-inside space-y-1 mb-3">
                  <li>Использовать кнопку "Озвучить введение" выше для прослушивания основных принципов WCAG</li>
                  <li>Скачать PDF файл и открыть его в Adobe Reader или аналогичной программе</li>
                  <li>Использовать кнопку "Открыть в новой вкладке" для просмотра в отдельном окне браузера</li>
                </ul>
                <p className="text-xs text-muted-foreground mb-2">
                  Adobe Reader обеспечивает лучшую совместимость с программами чтения с экрана для PDF документов.
                </p>
                {isDarkTheme && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-2 rounded border border-amber-200 dark:border-amber-800">
                    <strong>Примечание о темной теме:</strong> Содержимое PDF документа отображается в оригинальном светлом дизайне 
                    из-за технических ограничений браузера. Рамка адаптирована под темную тему сайта.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-bold mb-4">О документе</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="mb-4">
                  Оригинальный нормативный текст Рекомендации Консорциума Всемирной паутины (W3C) на английском языке 
                  Web Content Accessibility Guidelines (WCAG) 2.1 доступен на его сайте. Настоящий перевод выполнен 
                  в инициативном порядке, имеет статус волонтерского (Volunteer Translation) и может содержать ошибки перевода.
                </p>
                <p className="mb-4">
                  <strong>Благодарность за помощь в работе над переводом:</strong> Шади Абу-Захра (Shadi Abou-Zahra), 
                  Майкл Купер (Michael Cooper), Эндрю Киркпатрик (Andrew Kirkpatrick), Николай Башмаков, Татьяна Фокина и dom1n1k.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Авторские права:</strong> на оригинальный текст © 2017-2018, W3C® (MIT, ERCIM, Keio и Beihang). 
                  Перевод © 2019-2020, Евгений Альтовский (ОД «Информация для всех»).
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}