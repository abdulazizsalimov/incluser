import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, 
  FileText, 
  Tags, 
  Settings, 
  ArrowLeft,
  Mail,
  Smartphone,
  FolderOpen,
  Users
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Нет доступа",
        description: "Вы не авторизованы. Выполняется вход в систему...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    if (!isLoading && isAuthenticated && !user?.isAdmin) {
      toast({
        title: "Доступ запрещен",
        description: "Требуются права администратора",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const sidebarItems = [
    { href: "/admin", label: "Панель управления", icon: LayoutDashboard },
    { href: "/admin/articles", label: "Статьи", icon: FileText },
    { href: "/admin/categories", label: "Категории", icon: Tags },
    { href: "/admin/programs", label: "Программы", icon: Smartphone },
    { href: "/admin/program-categories", label: "Категории программ", icon: FolderOpen },
    { href: "/admin/pages", label: "Страницы", icon: FileText },
    { href: "/admin/messages", label: "Сообщения", icon: Mail },
    { href: "/admin/users", label: "Пользователи", icon: Users },
    { href: "/admin/settings", label: "Настройки", icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Панель администратора</h2>
            <nav className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => window.location.href = "/"}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться на сайт
              </Button>
              <Separator className="my-4" />
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href || 
                  (item.href !== "/admin" && location.startsWith(item.href));
                
                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => window.location.href = item.href}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
