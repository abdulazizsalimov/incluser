import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main id="main-content" role="main">
        {/* Hero Section */}
        <section className="bg-gradient-primary text-primary-foreground py-24 dark:from-primary dark:to-secondary" aria-labelledby="hero-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span lang="en">Incluser</span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-medium mt-2 opacity-90">
                доступный сайт о доступности
              </span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto opacity-90 leading-relaxed">
              Личный блог, посвященный цифровой доступности, инклюзивному дизайну и созданию веб-решений, 
              которыми могут пользоваться все люди, независимо от их способностей.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground border-2 border-card"
                onClick={() => window.location.href = "/articles"}
              >
                Читать статьи
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => window.location.href = "/about"}
              >
                Об авторе
              </Button>
            </div>
          </div>
        </section>

        {/* Sign in prompt */}
        <section className="py-16 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Присоединяйтесь к сообществу
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Войдите в систему, чтобы получить доступ к дополнительным материалам и возможности комментирования.
            </p>
            <Button 
              size="lg"
              onClick={() => window.location.href = "/api/login"}
            >
              Войти в систему
            </Button>
          </div>
        </section>

        {/* Digital Accessibility Info Section */}
        <section className="py-16" aria-labelledby="accessibility-info">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 id="accessibility-info" className="text-3xl font-bold text-foreground mb-8">
                Что такое цифровая доступность?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-card-foreground">Для всех пользователей</h3>
                  <p className="text-muted-foreground">
                    Доступность означает, что веб-сайты и приложения могут использовать люди 
                    с различными способностями и ограничениями.
                  </p>
                </div>

                <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-card-foreground">Стандарты WCAG</h3>
                  <p className="text-muted-foreground">
                    Следование международным стандартам WCAG обеспечивает 
                    высокое качество и доступность цифровых продуктов.
                  </p>
                </div>

                <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.006 2.006 0 0 0 18.06 7c-.8 0-1.54.5-1.85 1.26l-1.92 5.75c-.16.48-.21 1.03-.12 1.58L15.49 19H12l-.53-4H9.41l.59 4.5c.1.75.69 1.33 1.45 1.5H20v-1h-1.5l.5-4z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-card-foreground">Социальная ответственность</h3>
                  <p className="text-muted-foreground">
                    Создание инклюзивных решений — это вопрос социальной ответственности 
                    и равных возможностей в цифровом мире.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
