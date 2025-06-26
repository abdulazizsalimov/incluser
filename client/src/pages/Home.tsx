import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkipLinks from "@/components/SkipLinks";
import type { ArticleWithRelations } from "@shared/schema";

export default function Home() {
  const { data: articlesData, isLoading } = useQuery<{ articles: ArticleWithRelations[]; total: number }>({
    queryKey: ["/api/articles"],
    queryFn: async () => {
      const response = await fetch("/api/articles?limit=3");
      if (!response.ok) throw new Error("Failed to fetch articles");
      return response.json();
    },
  });

  const articles = articlesData?.articles || [];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)' }}>
      <SkipLinks />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section 
          style={{ 
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 50%, #075985 100%)', 
            color: 'white',
            padding: '4rem 1rem'
          }} 
          role="banner" 
          aria-labelledby="hero-title"
        >
          <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
            <h1 id="hero-title" style={{ fontSize: 'clamp(2rem, 8vw, 4rem)', fontWeight: '700', marginBottom: '1.5rem', lineHeight: '1.2' }}>
              <span style={{ display: 'block', fontSize: 'clamp(3rem, 10vw, 5rem)', fontWeight: '700' }}>
                Incluser
              </span>
              <span style={{ display: 'block', fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', fontWeight: '500', marginTop: '0.5rem', opacity: '0.9' }}>
                доступный сайт о доступности
              </span>
            </h1>
            <p style={{ 
              fontSize: 'clamp(1.125rem, 4vw, 1.5rem)', 
              marginBottom: '2rem', 
              maxWidth: '48rem', 
              margin: '0 auto 2rem auto',
              opacity: '0.9',
              lineHeight: '1.6'
            }}>
              Личный блог, посвященный цифровой доступности, инклюзивному дизайну и созданию веб-решений, 
              которыми могут пользоваться все люди, независимо от их способностей.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
              <Link href="/articles" style={{ textDecoration: 'none' }}>
                <div style={{ 
                  background: 'white', 
                  color: '#0369a1', 
                  padding: '0.875rem 2rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'inline-block',
                  transition: 'all 0.2s'
                }}>
                  Читать статьи
                </div>
              </Link>
              <Link href="/about" style={{ textDecoration: 'none' }}>
                <div style={{ 
                  background: 'transparent', 
                  color: 'white', 
                  padding: '0.875rem 2rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  border: '2px solid white',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'inline-block',
                  transition: 'all 0.2s'
                }}>
                  Об авторе
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Latest Articles Section */}
        <section style={{ padding: '4rem 1rem' }} aria-labelledby="latest-articles">
          <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 id="latest-articles" style={{ fontSize: '2.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem' }}>
                Свежие статьи
              </h2>
              <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '32rem', margin: '0 auto' }}>
                Последние публикации о цифровой доступности, лучших практиках и новых решениях
              </p>
            </div>

            {isLoading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ 
                    background: 'white', 
                    borderRadius: '0.5rem', 
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ height: '1.5rem', background: '#e2e8f0', borderRadius: '0.25rem', marginBottom: '1rem' }}></div>
                    <div style={{ height: '1rem', background: '#e2e8f0', borderRadius: '0.25rem', marginBottom: '0.5rem' }}></div>
                    <div style={{ height: '1rem', background: '#e2e8f0', borderRadius: '0.25rem', width: '60%' }}></div>
                  </div>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {articles.map((article) => (
                  <article key={article.id} style={{ 
                    background: 'white', 
                    borderRadius: '0.5rem', 
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s'
                  }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.75rem' }}>
                      <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {article.title}
                      </Link>
                    </h3>
                    {article.excerpt && (
                      <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
                        {article.excerpt}
                      </p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: '#9ca3af' }}>
                      <span>{article.author?.firstName || 'Автор'}</span>
                      <span>{new Date(article.createdAt || '').toLocaleDateString('ru-RU')}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
                  Статьи пока не опубликованы. Скоро здесь появится интересный контент!
                </p>
              </div>
            )}

            {articles.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <Link href="/articles" style={{ textDecoration: 'none' }}>
                  <div style={{ 
                    background: '#0369a1', 
                    color: 'white', 
                    padding: '0.875rem 2rem',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'inline-block',
                    transition: 'all 0.2s'
                  }}>
                    Все статьи
                  </div>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}