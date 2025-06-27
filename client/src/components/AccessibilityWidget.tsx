import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Type, Eye, Palette, Volume2, Moon, Sun, Monitor } from "lucide-react";
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

  const resetSettings = () => {
    setFontSize([100]);
    setHighContrast(false);
    setLargeText(false);
    setReducedMotion(false);
    
    document.documentElement.style.fontSize = '';
    document.documentElement.classList.remove('high-contrast', 'large-text', 'reduce-motion');
  };

  return (
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
  );
}
