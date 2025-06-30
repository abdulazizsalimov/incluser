import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, User } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import type { ArticleWithRelations } from "@shared/schema";

interface ArticleCardProps {
  article: ArticleWithRelations;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const formatDate = (date: string | null) => {
    if (!date) return "";
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return "";
      return dateObj.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.warn('Date formatting error:', error);
      return "";
    }
  };

  return (
    <article className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 focus-within:ring-2 focus-within:ring-accent overflow-hidden">
      {article.featuredImage && (
        <img
          src={article.featuredImage}
          alt={article.featuredImageAlt || ""}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      )}
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-3">
          <Link 
            href={`/articles/${article.slug}`}
            className="text-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent rounded transition-colors"
          >
            {article.title}
          </Link>
        </h3>
        {article.excerpt && (
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <time 
              dateTime={article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined}
              className="flex items-center gap-1"
            >
              <span className="sr-only">Опубликовано:</span>
              {formatDate(article.publishedAt ? new Date(article.publishedAt).toISOString() : null)}
            </time>
            {article.readingTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span>{article.readingTime} мин чтения</span>
              </div>
            )}
          </div>
          {article.author && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" aria-hidden="true" />
              <span>{article.author.firstName} {article.author.lastName}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-3">
          {article.category && (
            <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium">
              {article.category.name}
            </span>
          )}
          <ShareButton
            title={article.title}
            url={`${window.location.origin}/articles/${article.slug}`}
            description={article.excerpt || ""}
            size="sm"
            variant="ghost"
          />
        </div>
      </CardContent>
    </article>
  );
}
