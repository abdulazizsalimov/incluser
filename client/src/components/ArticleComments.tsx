import { useState, useEffect } from 'react';
import { Send, MessageCircle, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
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
  const [authorName, setAuthorName] = useState(user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '');
  const [authorEmail, setAuthorEmail] = useState(user?.email || '');
  const [content, setContent] = useState('');

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

  const handleSubmit = async (e: React.FormEvent, parentId?: number) => {
    e.preventDefault();
    
    if (!content.trim() || !authorName.trim() || !authorEmail.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
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
          authorName: authorName.trim(),
          authorEmail: authorEmail.trim(),
          content: content.trim(),
          parentId: parentId || null,
        }),
      });

      if (response.ok) {
        setContent('');
        setReplyingTo(null);
        await fetchComments();
        toast({
          title: "Comment submitted",
          description: "Your comment has been submitted for review.",
        });
      } else {
        throw new Error('Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Error",
        description: "Failed to submit comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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

  const CommentForm = ({ parentId, onCancel }: { parentId?: number; onCancel?: () => void }) => (
    <form onSubmit={(e) => handleSubmit(e, parentId)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`name-${parentId || 'main'}`}>Name *</Label>
          <Input
            id={`name-${parentId || 'main'}`}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <Label htmlFor={`email-${parentId || 'main'}`}>Email *</Label>
          <Input
            id={`email-${parentId || 'main'}`}
            type="email"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor={`content-${parentId || 'main'}`}>Comment *</Label>
        <Textarea
          id={`content-${parentId || 'main'}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={parentId ? "Write your reply..." : "Share your thoughts..."}
          rows={4}
          required
        />
      </div>
      
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          <Send className="h-4 w-4 mr-2" />
          {submitting ? 'Submitting...' : (parentId ? 'Reply' : 'Submit Comment')}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );

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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
          >
            <Reply className="h-4 w-4 mr-1" />
            Reply
          </Button>
        </div>
        
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{comment.content}</p>
        </div>
        
        {replyingTo === comment.id && (
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
          Comments
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
        Comments ({comments.length})
      </h3>
      
      {/* Comment Form */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8">
        <h4 className="text-lg font-medium mb-4">Leave a Comment</h4>
        <CommentForm />
      </div>
      
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
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </div>
  );
}