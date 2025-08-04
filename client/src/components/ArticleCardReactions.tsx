import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';

interface ArticleCardReactionsProps {
  articleId: number;
}

interface ReactionCounts {
  likes: number;
  dislikes: number;
  comments: number;
}

export function ArticleCardReactions({ articleId }: ArticleCardReactionsProps) {
  const [counts, setCounts] = useState<ReactionCounts>({
    likes: 0,
    dislikes: 0,
    comments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch reactions
        const reactionsResponse = await fetch(`/api/articles/${articleId}/reactions`);
        if (reactionsResponse.ok) {
          const reactionsData = await reactionsResponse.json();
          
          // Fetch comments
          const commentsResponse = await fetch(`/api/articles/${articleId}/comments`);
          const commentsData = commentsResponse.ok ? await commentsResponse.json() : [];
          
          setCounts({
            likes: reactionsData.counts?.likes || 0,
            dislikes: reactionsData.counts?.dislikes || 0,
            comments: Array.isArray(commentsData) ? commentsData.length : 0
          });
        }
      } catch (error) {
        console.error('Error fetching reaction counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [articleId]);

  if (loading) {
    return (
      <div className="flex items-center gap-4 text-xs text-muted-foreground opacity-50">
        <div className="flex items-center gap-1">
          <ThumbsUp className="h-3 w-3" />
          <span>0</span>
        </div>
        <div className="flex items-center gap-1">
          <ThumbsDown className="h-3 w-3" />
          <span>0</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="h-3 w-3" />
          <span>0</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <ThumbsUp className="h-3 w-3" />
        <span>{counts.likes}</span>
      </div>
      <div className="flex items-center gap-1">
        <ThumbsDown className="h-3 w-3" />
        <span>{counts.dislikes}</span>
      </div>
      <div className="flex items-center gap-1">
        <MessageCircle className="h-3 w-3" />
        <span>{counts.comments}</span>
      </div>
    </div>
  );
}