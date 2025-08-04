import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { LoginDialog } from '@/components/LoginDialog';
import { Button } from '@/components/ui/button';

interface ArticleReactionsProps {
  articleId: number;
}

interface ReactionData {
  counts: {
    likes: number;
    dislikes: number;
  };
  userReaction: 'like' | 'dislike' | null;
}

export function ArticleReactions({ articleId }: ArticleReactionsProps) {
  const [reactions, setReactions] = useState<ReactionData>({
    counts: { likes: 0, dislikes: 0 },
    userReaction: null
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Show reactions for everyone, but only allow clicking for registered users

  const fetchReactions = async () => {
    try {
      const userEmail = user?.email;
      if (!userEmail) return;
      
      const response = await fetch(`/api/articles/${articleId}/reactions?userEmail=${encodeURIComponent(userEmail)}`);
      
      if (response.ok) {
        const data = await response.json();
        setReactions(data);
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (type: 'like' | 'dislike') => {
    try {
      const userEmail = user?.email;
      if (!userEmail) return;
      
      // If user clicked the same reaction, remove it
      if (reactions.userReaction === type) {
        const response = await fetch(`/api/articles/${articleId}/reactions`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userEmail }),
        });

        if (response.ok) {
          await fetchReactions();
          toast({
            title: "Реакция удалена",
            description: "Ваша реакция была удалена.",
          });
        }
      } else {
        // Add or change reaction
        const response = await fetch(`/api/articles/${articleId}/reactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            reactionType: type,
            userEmail 
          }),
        });

        if (response.ok) {
          await fetchReactions();
          toast({
            title: "Реакция добавлена",
            description: `Вы поставили ${type === 'like' ? 'лайк' : 'дизлайк'} этой статье.`,
          });
        }
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить реакцию. Попробуйте еще раз.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchReactions();
  }, [articleId]);

  if (loading) {
    return (
      <div className="flex items-center gap-4 py-4">
        <div className="flex items-center gap-2 opacity-50">
          <ThumbsUp className="h-5 w-5" />
          <span>0</span>
        </div>
        <div className="flex items-center gap-2 opacity-50">
          <ThumbsDown className="h-5 w-5" />
          <span>0</span>
        </div>
      </div>
    );
  }

  if (!user?.email) {
    // Show reactions without interaction for non-logged users
    return (
      <div className="flex items-center gap-4 py-4 border-y border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400">
          <ThumbsUp className="h-5 w-5" />
          <span className="font-medium">{reactions.counts.likes}</span>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400">
          <ThumbsDown className="h-5 w-5" />
          <span className="font-medium">{reactions.counts.dislikes}</span>
        </div>
        
        <div className="text-muted-foreground text-sm ml-4 flex items-center gap-2">
          <span>Войдите в систему, чтобы оставлять реакции на статьи</span>
          <LoginDialog>
            <Button size="sm" variant="outline">
              Войти
            </Button>
          </LoginDialog>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 py-4 border-y border-gray-200 dark:border-gray-700">
      <button
        onClick={() => handleReaction('like')}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          reactions.userReaction === 'like'
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
        }`}
        aria-label={`Понравилась эта статья. Лайков: ${reactions.counts.likes}`}
      >
        <ThumbsUp className="h-5 w-5" />
        <span className="font-medium">{reactions.counts.likes}</span>
      </button>
      
      <button
        onClick={() => handleReaction('dislike')}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          reactions.userReaction === 'dislike'
            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
        }`}
        aria-label={`Не понравилась эта статья. Дизлайков: ${reactions.counts.dislikes}`}
      >
        <ThumbsDown className="h-5 w-5" />
        <span className="font-medium">{reactions.counts.dislikes}</span>
      </button>
    </div>
  );
}