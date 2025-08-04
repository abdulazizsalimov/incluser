import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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

  // Get user email for anonymous reactions
  const getUserEmail = () => {
    if (user?.email) return user.email;
    
    // For anonymous users, use localStorage to track their email
    let anonymousEmail = localStorage.getItem('anonymousUserEmail');
    if (!anonymousEmail) {
      anonymousEmail = `anonymous_${Date.now()}@example.com`;
      localStorage.setItem('anonymousUserEmail', anonymousEmail);
    }
    return anonymousEmail;
  };

  const fetchReactions = async () => {
    try {
      const userEmail = getUserEmail();
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
      const userEmail = getUserEmail();
      
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
            title: "Reaction removed",
            description: "Your reaction has been removed.",
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
            title: "Reaction added",
            description: `You ${type}d this article.`,
          });
        }
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        title: "Error",
        description: "Failed to update reaction. Please try again.",
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

  return (
    <div className="flex items-center gap-4 py-4 border-y border-gray-200 dark:border-gray-700">
      <button
        onClick={() => handleReaction('like')}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          reactions.userReaction === 'like'
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
        }`}
        aria-label={`Like this article. Current likes: ${reactions.counts.likes}`}
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
        aria-label={`Dislike this article. Current dislikes: ${reactions.counts.dislikes}`}
      >
        <ThumbsDown className="h-5 w-5" />
        <span className="font-medium">{reactions.counts.dislikes}</span>
      </button>
    </div>
  );
}