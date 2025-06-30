import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Type, Eye, Palette, Volume2, Moon, Sun, Monitor, ZoomIn } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface AccessibilityWidgetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AccessibilityWidget({ open, onOpenChange }: AccessibilityWidgetProps) {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState([100]);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [textMagnifier, setTextMagnifier] = useState(() => {
    // Load saved state from localStorage
    const saved = localStorage.getItem('accessibility-text-magnifier');
    return saved === 'true';
  });

  const applyFontSize = (size: number) => {
    document.documentElement.style.fontSize = `${size}%`;
  };

  const toggleHighContrast = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const toggleLargeText = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  };

  const toggleReducedMotion = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  const toggleTextMagnifier = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('text-magnifier-enabled');
    } else {
      document.documentElement.classList.remove('text-magnifier-enabled');
    }
    // Save state to localStorage
    localStorage.setItem('accessibility-text-magnifier', enabled.toString());
  };

  // Apply saved text magnifier state on component mount
  useEffect(() => {
    if (textMagnifier) {
      document.documentElement.classList.add('text-magnifier-enabled');
    }
  }, []);

  // Text magnifier functionality
  useEffect(() => {
    if (!textMagnifier) return;

    let magnifierOverlay: HTMLDivElement | null = null;
    let magnifierContent: HTMLDivElement | null = null;
    let scrollTop = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!e.shiftKey) {
        if (magnifierOverlay) {
          magnifierOverlay.remove();
          magnifierOverlay = null;
          magnifierContent = null;
          scrollTop = 0;
        }
        return;
      }

      const target = e.target as HTMLElement;
      if (!target) return;

      // Check if target is a text-containing element with meaningful text
      const isValidTextElement = (el: HTMLElement): boolean => {
        // Skip container elements that don't typically contain direct text
        const containerTags = ['HTML', 'BODY', 'DIV', 'SECTION', 'ARTICLE', 'MAIN', 'ASIDE', 'NAV', 'HEADER', 'FOOTER', 'UL', 'OL'];
        if (containerTags.includes(el.tagName)) return false;
        
        // Accept elements that typically contain text
        const textTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'A', 'BUTTON', 'LABEL', 'LI', 'TD', 'TH', 'TIME', 'STRONG', 'EM', 'CODE'];
        if (textTags.includes(el.tagName)) return true;
        
        // For other elements, check if they have direct text content (not inherited from children)
        const textNode = Array.from(el.childNodes).find(node => 
          node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
        );
        return !!textNode;
      };

      if (!isValidTextElement(target)) return;

      // Get text content - prefer direct text over full element text
      let textContent = '';
      
      // For text elements, use their content directly
      const textTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'BUTTON', 'LABEL', 'SPAN', 'LI', 'TD', 'TH', 'TIME', 'STRONG', 'EM', 'CODE'];
      if (textTags.includes(target.tagName)) {
        textContent = target.textContent?.trim() || '';
      } else {
        // For other elements, get only direct text nodes
        const directTextNodes = Array.from(target.childNodes)
          .filter(node => node.nodeType === Node.TEXT_NODE)
          .map(node => node.textContent?.trim())
          .filter(text => text);
        
        textContent = directTextNodes.join(' ');
      }

      // Don't limit text length anymore - let it scroll
      if (!textContent || textContent.length === 0) return;

      // Create or update overlay
      if (!magnifierOverlay) {
        magnifierOverlay = document.createElement('div');
        magnifierOverlay.style.cssText = `
          position: fixed;
          background: black;
          border: 3px solid #00bfff;
          border-radius: 8px;
          z-index: 10000;
          pointer-events: none;
          max-width: 600px;
          max-height: 400px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          display: flex;
          overflow: hidden;
        `;

        magnifierContent = document.createElement('div');
        magnifierContent.style.cssText = `
          color: white;
          font-size: 48px;
          font-weight: bold;
          padding: 20px;
          word-wrap: break-word;
          overflow-y: auto;
          flex: 1;
          scrollbar-width: thin;
          scrollbar-color: #00bfff #333;
        `;

        // Custom scrollbar styles for webkit browsers
        magnifierContent.innerHTML = `
          <style>
            .magnifier-content::-webkit-scrollbar {
              width: 12px;
            }
            .magnifier-content::-webkit-scrollbar-track {
              background: #333;
            }
            .magnifier-content::-webkit-scrollbar-thumb {
              background: #00bfff;
              border-radius: 6px;
            }
            .magnifier-content::-webkit-scrollbar-thumb:hover {
              background: #0099cc;
            }
          </style>
        `;
        
        magnifierContent.className = 'magnifier-content';
        magnifierOverlay.appendChild(magnifierContent);
        document.body.appendChild(magnifierOverlay);

        scrollTop = 0;
      }

      const textNode = document.createTextNode(textContent);
      magnifierContent!.innerHTML = '';
      magnifierContent!.appendChild(textNode);
      magnifierContent!.scrollTop = scrollTop;
      
      // Position overlay near mouse cursor
      const rect = magnifierOverlay.getBoundingClientRect();
      let left = e.clientX + 20;
      let top = e.clientY - rect.height - 20;

      // Adjust position if overlay goes off screen
      if (left + rect.width > window.innerWidth) {
        left = e.clientX - rect.width - 20;
      }
      if (top < 0) {
        top = e.clientY + 20;
      }

      magnifierOverlay.style.left = `${left}px`;
      magnifierOverlay.style.top = `${top}px`;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!e.shiftKey || !magnifierContent) return;
      
      e.preventDefault();
      scrollTop += e.deltaY;
      if (scrollTop < 0) scrollTop = 0;
      
      const maxScroll = magnifierContent.scrollHeight - magnifierContent.clientHeight;
      if (scrollTop > maxScroll) scrollTop = maxScroll;
      
      magnifierContent.scrollTop = scrollTop;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift' && magnifierOverlay) {
        magnifierOverlay.remove();
        magnifierOverlay = null;
        magnifierContent = null;
        scrollTop = 0;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keyup', handleKeyUp);
      if (magnifierOverlay) {
        magnifierOverlay.remove();
      }
    };
  }, [textMagnifier]);

  const resetSettings = () => {
    setFontSize([100]);
    setHighContrast(false);
    setLargeText(false);
    setReducedMotion(false);
    setTextMagnifier(false);
    
    document.documentElement.style.fontSize = '';
    document.documentElement.classList.remove('high-contrast', 'large-text', 'reduce-motion', 'text-magnifier-enabled');
    
    // Clear localStorage
    localStorage.removeItem('accessibility-text-magnifier');
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md" aria-describedby="accessibility-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Специальные возможности
          </DialogTitle>
        </DialogHeader>
        
        <div id="accessibility-description" className="sr-only">
          Панель настроек специальных возможностей для улучшения доступности сайта
        </div>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {theme === 'light' && <Sun className="h-4 w-4" />}
              {theme === 'dark' && <Moon className="h-4 w-4" />}
              {theme === 'system' && <Monitor className="h-4 w-4" />}
              <Label htmlFor="theme-select">Тема оформления</Label>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme-select" aria-label="Выбрать тему оформления">
                <SelectValue placeholder="Выберите тему" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Светлая
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Темная
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Как в системе
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Выберите предпочитаемую цветовую схему
            </p>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <Label htmlFor="font-size">Размер шрифта: {fontSize[0]}%</Label>
            </div>
            <Slider
              id="font-size"
              value={fontSize}
              onValueChange={(value) => {
                setFontSize(value);
                applyFontSize(value[0]);
              }}
              min={75}
              max={150}
              step={25}
              className="w-full"
              aria-label="Изменить размер шрифта"
            />
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <Label htmlFor="high-contrast">Высокий контраст</Label>
            </div>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={(checked) => {
                setHighContrast(checked);
                toggleHighContrast(checked);
              }}
              aria-describedby="high-contrast-desc"
            />
          </div>
          <p id="high-contrast-desc" className="text-sm text-muted-foreground">
            Увеличивает контрастность для лучшей видимости
          </p>

          {/* Large Text */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <Label htmlFor="large-text">Крупный текст</Label>
            </div>
            <Switch
              id="large-text"
              checked={largeText}
              onCheckedChange={(checked) => {
                setLargeText(checked);
                toggleLargeText(checked);
              }}
              aria-describedby="large-text-desc"
            />
          </div>
          <p id="large-text-desc" className="text-sm text-muted-foreground">
            Делает весь текст на сайте крупнее
          </p>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <Label htmlFor="reduced-motion">Уменьшить анимации</Label>
            </div>
            <Switch
              id="reduced-motion"
              checked={reducedMotion}
              onCheckedChange={(checked) => {
                setReducedMotion(checked);
                toggleReducedMotion(checked);
              }}
              aria-describedby="reduced-motion-desc"
            />
          </div>
          <p id="reduced-motion-desc" className="text-sm text-muted-foreground">
            Отключает анимации и переходы
          </p>

          {/* Text Magnifier */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ZoomIn className="h-4 w-4" />
              <Label htmlFor="text-magnifier">Увеличение при наведении</Label>
            </div>
            <Switch
              id="text-magnifier"
              checked={textMagnifier}
              onCheckedChange={(checked) => {
                setTextMagnifier(checked);
                toggleTextMagnifier(checked);
              }}
              aria-describedby="text-magnifier-desc"
            />
          </div>
          <p id="text-magnifier-desc" className="text-sm text-muted-foreground">
            Зажмите Shift и наведите на текст для увеличения
          </p>

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={resetSettings}
            className="w-full"
          >
            Сбросить настройки
          </Button>
        </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
