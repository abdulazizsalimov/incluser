import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";

export default function WcagGuides() {
  const [pdfError, setPdfError] = useState(false);
  
  useEffect(() => {
    document.title = "Руководство по обеспечению доступности веб-контента (WCAG) 2.1 - Incluser";
  }, []);

  const pdfUrl = "/attached_assets/Руководство по обеспечению доступности веб-контента (WCAG) 2.1 _ Информация для всех_1753427531966.pdf";

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

          <div className="bg-card rounded-lg border overflow-hidden">
            {!pdfError ? (
              <div className="relative w-full" style={{ height: '80vh' }}>
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-0"
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

          <div className="mt-8 bg-card p-6 rounded-lg border">
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
      </main>
      
      <Footer />
    </div>
  );
}