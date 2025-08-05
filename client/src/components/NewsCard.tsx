import ArticleCard from "@/components/ArticleCard";
import ProgramCard from "@/components/ProgramCard";
import type { ArticleWithRelations, ProgramWithRelations } from "@shared/schema";

interface NewsItem {
  type: 'article' | 'program';
  data: ArticleWithRelations | ProgramWithRelations;
  createdAt: Date | string;
}

interface NewsCardProps {
  item: NewsItem;
}

export default function NewsCard({ item }: NewsCardProps) {
  if (item.type === 'article') {
    return <ArticleCard article={item.data as ArticleWithRelations} />;
  } else {
    return <ProgramCard program={item.data as ProgramWithRelations} />;
  }
}