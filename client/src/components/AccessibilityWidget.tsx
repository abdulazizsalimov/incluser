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
import AccessibleSlider from "@/components/AccessibleSlider";

interface AccessibilityWidgetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AccessibilityWidget({ open, onOpenChange }: AccessibilityWidgetProps) {
  const { theme, setTheme } = useTheme();
  
  // Load all settings from localStorage
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('accessibility-font-size');
    return saved ? [parseInt(saved)] : [100];
  });
  
  const [lineHeight, setLineHeight] = useState(() => {
    const saved = localStorage.getItem('accessibility-line-height');
    return saved ? [parseInt(saved)] : [150];
  });
  
  const [letterSpacing, setLetterSpacing] = useState(() => {
    const saved = localStorage.getItem('accessibility-letter-spacing');
    return saved ? [parseInt(saved)] : [100];
  });
  
  const [highContrast, setHighContrast] = useState(() => {
    const saved = localStorage.getItem('accessibility-high-contrast');
    return saved === 'true';
  });
  
  const [grayscale, setGrayscale] = useState(() => {
    const saved = localStorage.getItem('accessibility-grayscale');
    return saved === 'true';
  });
  
  const [largeText, setLargeText] = useState(() => {
    const saved = localStorage.getItem('accessibility-large-text');
    return saved === 'true';
  });
  
  const [reducedMotion, setReducedMotion] = useState(() => {
    const saved = localStorage.getItem('accessibility-reduced-motion');
    return saved === 'true';
  });
  
  const [textMagnifier, setTextMagnifier] = useState(() => {
    const saved = localStorage.getItem('accessibility-text-magnifier');
    return saved === 'true';
  });

  const applyFontSize = (size: number) => {
    document.documentElement.style.fontSize = `${size}%`;
    localStorage.setItem('accessibility-font-size', size.toString());
  };

  const applyLineHeight = (height: number) => {
    document.documentElement.style.setProperty('--line-height-multiplier', `${height / 100}`);
    localStorage.setItem('accessibility-line-height', height.toString());
  };

  const applyLetterSpacing = (spacing: number) => {
    document.documentElement.style.setProperty('--letter-spacing-multiplier', `${(spacing - 100) / 100}em`);
    localStorage.setItem('accessibility-letter-spacing', spacing.toString());
  };

  const toggleHighContrast = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('accessibility-high-contrast', enabled.toString());
  };

  const toggleGrayscale = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('grayscale');
    } else {
      document.documentElement.classList.remove('grayscale');
    }
    localStorage.setItem('accessibility-grayscale', enabled.toString());
  };

  const toggleLargeText = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
    localStorage.setItem('accessibility-large-text', enabled.toString());
  };

  const toggleReducedMotion = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    localStorage.setItem('accessibility-reduced-motion', enabled.toString());
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

  // Apply saved settings on component mount
  useEffect(() => {
    applyFontSize(fontSize[0]);
    applyLineHeight(lineHeight[0]);
    applyLetterSpacing(letterSpacing[0]);
    
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    }
    
    if (grayscale) {
      document.documentElement.classList.add('grayscale');
    }
    
    if (largeText) {
      document.documentElement.classList.add('large-text');
    }
    
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    }
    
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
    setLineHeight([150]);
    setLetterSpacing([100]);
    setHighContrast(false);
    setGrayscale(false);
    setLargeText(false);
    setReducedMotion(false);
    setTextMagnifier(false);
    
    document.documentElement.style.fontSize = '';
    document.documentElement.style.removeProperty('--line-height-multiplier');
    document.documentElement.style.removeProperty('--letter-spacing-multiplier');
    document.documentElement.classList.remove('high-contrast', 'grayscale', 'large-text', 'reduce-motion', 'text-magnifier-enabled');
    
    // Clear all localStorage settings
    localStorage.removeItem('accessibility-font-size');
    localStorage.removeItem('accessibility-line-height');
    localStorage.removeItem('accessibility-letter-spacing');
    localStorage.removeItem('accessibility-high-contrast');
    localStorage.removeItem('accessibility-grayscale');
    localStorage.removeItem('accessibility-large-text');
    localStorage.removeItem('accessibility-reduced-motion');
    localStorage.removeItem('accessibility-text-magnifier');
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col" aria-describedby="accessibility-description">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Специальные возможности
          </DialogTitle>
        </DialogHeader>
        
        <div id="accessibility-description" className="sr-only">
          Панель настроек специальных возможностей для улучшения доступности сайта
        </div>

        <div className="space-y-6 overflow-y-auto flex-1 pr-2">
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

          {/* Grayscale Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <Label htmlFor="grayscale">Черно-белый режим</Label>
            </div>
            <Switch
              id="grayscale"
              checked={grayscale}
              onCheckedChange={(checked) => {
                setGrayscale(checked);
                toggleGrayscale(checked);
              }}
              aria-describedby="grayscale-desc"
            />
          </div>
          <p id="grayscale-desc" className="text-sm text-muted-foreground">
            Убирает все цвета, оставляя только оттенки серого
          </p>

          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <Label id="font-size-label" htmlFor="font-size">Размер шрифта: {fontSize[0]}%</Label>
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
              thumbAriaLabel={`Размер шрифта ${fontSize[0]} процентов`}
            />
            <p id="font-size-desc" className="text-xs text-muted-foreground">
              Используйте стрелки или перетаскивание для изменения от 75% до 150%
            </p>
          </div>

          {/* Line Height */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <Label id="line-height-label" htmlFor="line-height">Междустрочный интервал: {lineHeight[0]}%</Label>
            </div>
            <Slider
              id="line-height"
              value={lineHeight}
              onValueChange={(value) => {
                setLineHeight(value);
                applyLineHeight(value[0]);
              }}
              min={100}
              max={200}
              step={25}
              className="w-full"
              thumbAriaLabel={`Междустрочный интервал ${lineHeight[0]} процентов`}
            />
            <p id="line-height-desc" className="text-xs text-muted-foreground">
              Используйте стрелки или перетаскивание для изменения от 100% до 200%
            </p>
          </div>

          {/* Letter Spacing */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <Label id="letter-spacing-label" htmlFor="letter-spacing">Межбуквенный интервал: {letterSpacing[0]}%</Label>
            </div>
            <Slider
              id="letter-spacing"
              value={letterSpacing}
              onValueChange={(value) => {
                setLetterSpacing(value);
                applyLetterSpacing(value[0]);
              }}
              min={75}
              max={150}
              step={25}
              className="w-full"
              thumbAriaLabel={`Межбуквенный интервал ${letterSpacing[0]} процентов`}
            />
            <p id="letter-spacing-desc" className="text-xs text-muted-foreground">
              Используйте стрелки или перетаскивание для изменения от 75% до 150%
            </p>
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
          <div className="pt-4 border-t flex-shrink-0">
            <Button
              variant="outline"
              onClick={resetSettings}
              className="w-full"
            >
              Сбросить настройки
            </Button>
          </div>
        </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
