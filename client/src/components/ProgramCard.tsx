import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProgramWithRelations } from "@shared/schema";

interface ProgramCardProps {
  program: ProgramWithRelations;
}

export default function ProgramCard({ program }: ProgramCardProps) {
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <article className="h-full">
      <Card className="h-full hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500 dark:border-l-purple-500">
        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex items-start gap-4 mb-4">
            {program.logo && (
              <div className="flex-shrink-0">
                <img 
                  src={program.logo} 
                  alt={`Логотип ${program.title}`}
                  className="w-12 h-12 object-contain rounded"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  📱 Программа
                </Badge>
                {program.category && (
                  <Badge variant="outline" className="text-xs">
                    {program.category.name}
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2">
                <Link 
                  href={`/programs/${program.slug}`}
                  className="text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded"
                >
                  {program.title}
                  {program.version && (
                    <span className="text-sm text-muted-foreground ml-1">
                      v{program.version}
                    </span>
                  )}
                </Link>
              </h3>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
              {program.description}
            </p>

            {program.developer && (
              <p className="text-sm text-muted-foreground mb-2">
                <span className="font-medium">Разработчик:</span> {program.developer}
              </p>
            )}

            {program.platforms && program.platforms.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {program.platforms.map((platform, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-4 border-t">
            {program.createdAt && (
              <time dateTime={new Date(program.createdAt).toISOString()}>
                {formatDate(program.createdAt)}
              </time>
            )}
            {program.releaseYear && (
              <span>Год выпуска: {program.releaseYear}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </article>
  );
}