import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Send, MessageCircle, Reply, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { LoginDialog } from '@/components/LoginDialog';
import type { CommentWithAuthor } from '@shared/schema';

interface ArticleCommentsProps {
  articleId: number;
}

export function ArticleComments({ articleId }: ArticleCommentsProps) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Form state
  const [content, setContent] = useState('');
  
  // Антиспам состояние - глобальное для всех форм
  const [globalCooldownEnd, setGlobalCooldownEnd] = useState<number | null>(null);
  
  // Show comments for everyone, but only allow commenting for registered users

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/articles/${articleId}/comments`);
      
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  // Компонент кнопки с изолированной анимацией
  const CooldownButton = memo(({ 
    disabled, 
    submitting, 
    isReply, 
    cooldownEnd 
  }: { 
    disabled: boolean; 
    submitting: boolean; 
    isReply: boolean;
    cooldownEnd: number | null;
  }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [progressWidth, setProgressWidth] = useState(0);
    const isInCooldown = cooldownEnd !== null && Date.now() < cooldownEnd;

    useEffect(() => {
      if (!cooldownEnd) {
        setTimeLeft(0);
        setProgressWidth(0);
        return;
      }

      const interval = setInterval(() => {
        const now = Date.now();
        const timeRemaining = cooldownEnd - now;
        const left = Math.max(0, Math.ceil(timeRemaining / 1000));
        const totalMs = 15000;
        const elapsed = totalMs - timeRemaining;
        const progress = Math.min(100, Math.max(0, (elapsed / totalMs) * 100));
        
        setTimeLeft(left);
        setProgressWidth(progress);
        
        if (timeRemaining <= 0) {
          setTimeLeft(0);
          setProgressWidth(0);
        }
      }, 50);

      return () => clearInterval(interval);
    }, [cooldownEnd]);

    return (
      <Button 
        type="submit" 
        disabled={disabled || isInCooldown}
        className={`relative overflow-hidden min-w-[200px] transition-colors duration-200 ${
          isInCooldown 
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700' 
            : ''
        }`}
      >
        {/* Прогресс-бар с ярким цветом */}
        {isInCooldown && (
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-75 ease-out"
            style={{ 
              width: `${progressWidth}%`,
              transform: 'translateZ(0)',
            }}
          />
        )}
        
        {/* Контент кнопки */}
        <div className="relative z-10 flex items-center">
          <Send className="h-4 w-4 mr-2" />
          {submitting 
            ? 'Отправка...' 
            : isInCooldown
              ? `Следующая отправка через ${timeLeft}с`
              : (isReply ? 'Ответить' : 'Отправить комментарий')
          }
        </div>
      </Button>
    );
  });

  const CommentForm = ({ parentId, onCancel }: { parentId?: number; onCancel?: () => void }) => {
    // Create separate state for each form to prevent focus loss
    const [localContent, setLocalContent] = useState('');
    
    const handleLocalSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!localContent.trim() || !user) {
        toast({
          title: "Ошибка",
          description: "Необходимо заполнить все поля.",
          variant: "destructive",
        });
        return;
      }

      setSubmitting(true);
      
      try {
        const response = await fetch(`/api/articles/${articleId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            authorName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
            authorEmail: user.email,
            content: localContent.trim(),
            parentId: parentId || null,
          }),
        });

        if (response.ok) {
          setLocalContent('');
          setReplyingTo(null);
          if (onCancel) onCancel();
          
          // Запускаем антиспам таймер на 15 секунд
          setGlobalCooldownEnd(Date.now() + 15000);
          
          await fetchComments();
          toast({
            title: "Комментарий добавлен",
            description: "Ваш комментарий был успешно добавлен.",
          });
        } else {
          throw new Error('Failed to submit comment');
        }
      } catch (error) {
        console.error('Error submitting comment:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось отправить комментарий. Попробуйте еще раз.",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <form onSubmit={handleLocalSubmit} className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <User className="h-4 w-4" />
          <span>Комментирует: {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email}</span>
        </div>
        
        <div>
          <Label htmlFor={`content-${parentId || 'main'}`}>Комментарий *</Label>
          <Textarea
            id={`content-${parentId || 'main'}`}
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            placeholder={parentId ? "Напишите ваш ответ..." : "Поделитесь своими мыслями..."}
            rows={4}
            required
            disabled={submitting}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Пожалуйста, будьте вежливы и соблюдайте правила нашего сообщества при общении.
          </p>
        </div>
        
        <div className="flex gap-2">
          <CooldownButton 
            disabled={submitting}
            submitting={submitting}
            isReply={!!parentId}
            cooldownEnd={globalCooldownEnd}
          />
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Отмена
            </Button>
          )}
        </div>
      </form>
    );
  };

  const CommentItem = ({ comment }: { comment: CommentWithAuthor }) => (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100">
              {comment.author?.firstName && comment.author?.lastName 
                ? `${comment.author.firstName} ${comment.author.lastName}`
                : comment.authorName
              }
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(comment.createdAt?.toString() || new Date().toString())}
            </p>
          </div>
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            >
              <Reply className="h-4 w-4 mr-1" />
              Ответить
            </Button>
          )}
        </div>
        
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{comment.content}</p>
        </div>
        
        {user && replyingTo === comment.id && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <CommentForm 
              parentId={comment.id} 
              onCancel={() => setReplyingTo(null)} 
            />
          </div>
        )}
      </div>
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="py-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Комментарии
        </h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        Комментарии ({comments.length})
      </h3>
      
      {/* Comment Form - only for registered users */}
      {user ? (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8">
          <h4 className="text-lg font-medium mb-2">Оставить комментарий</h4>
          <p className="text-sm text-muted-foreground mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded border-l-4 border-blue-500">
            <strong>Правила сообщества:</strong> Мы ценим уважительное общение. 
            Пожалуйста, будьте вежливы, конструктивны и помогайте создавать дружелюбную атмосферу для всех участников.
          </p>
          <CommentForm />
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8 text-center">
          <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Для добавления комментариев необходимо войти в систему
          </p>
          <LoginDialog>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Войти
            </Button>
          </LoginDialog>
        </div>
      )}
      
      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Пока нет комментариев. Станьте первым, кто поделится мыслями!
          </p>
        </div>
      )}
    </div>
  );
}