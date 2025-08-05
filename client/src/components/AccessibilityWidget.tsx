import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CustomSelect } from "@/components/CustomSelect";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Type, Eye, Palette, Volume2, Moon, Sun, Monitor, ZoomIn, ChevronDown, ChevronRight, Settings, VolumeX, Play, Square, X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import AccessibleSlider from "@/components/AccessibleSlider";
import FloatingSpeechButton from "@/components/FloatingSpeechButton";

interface AccessibilityWidgetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AccessibilityWidget({ open, onOpenChange }: AccessibilityWidgetProps) {
  const { theme, setTheme, actualTheme } = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  // Handle panel visibility and animation
  useEffect(() => {
    if (open) {
      // Opening: show panel first, then animate
      setIsVisible(true);
      setHasBeenOpened(true);
      // Block background scroll and preserve position
      const scrollY = window.scrollY;
      document.body.style.top = `-${scrollY}px`;
      document.body.classList.add('panel-open');
      
      // Force layout calculation before animation
      if (panelRef.current) {
        panelRef.current.offsetHeight; // Trigger layout
      }
      // Use requestAnimationFrame for smoother animation timing
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else if (isVisible) {
      // Closing: animate out first, then hide
      setIsAnimating(false);
      // Restore background scroll and position
      const scrollY = document.body.style.top;
      document.body.classList.remove('panel-open');
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
      
      // Hide panel after animation completes
      setTimeout(() => {
        setIsVisible(false);
      }, 350); // Slightly longer to ensure animation completes
    }
  }, [open, isVisible]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Remove class and restore scroll if component unmounts with panel open
      const scrollY = document.body.style.top;
      document.body.classList.remove('panel-open');
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, []);

  // Focus management when panel opens
  useEffect(() => {
    if (open && firstFocusableRef.current) {
      // Focus the close button when panel opens
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 350); // Wait for animation to complete
    }
  }, [open]);

  // Observer to handle dynamically added elements
  useEffect(() => {
    if (!panelRef.current) return;

    const observer = new MutationObserver((mutations) => {
      if (!open) {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              const focusableElements = element.querySelectorAll(
                'button, [href], input, select, textarea, [role="slider"], [tabindex="0"], [data-radix-slider-thumb], [role="button"]'
              );
              focusableElements.forEach(el => {
                (el as HTMLElement).setAttribute('tabindex', '-1');
              });
            }
          });
        });
      }
    });

    observer.observe(panelRef.current, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, [open]);

  // Focus management when panel opens/closes
  useEffect(() => {
    if (open) {
      // Focus first element when panel opens
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);
    }
    // Removed automatic focus return to prevent interference with form inputs
  }, [open]);

  // Focus trap implementation
  useEffect(() => {
    if (!open || !panelRef.current) return;

    const panel = panelRef.current;
    const focusableElements = panel.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab: moving backwards
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: moving forwards
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    panel.addEventListener('keydown', handleTab);
    return () => panel.removeEventListener('keydown', handleTab);
  }, [open]);

  // Handle Escape key to close panel
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        e.stopPropagation();
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape, true); // Use capture phase
      return () => document.removeEventListener('keydown', handleEscape, true);
    }
  }, [open, onOpenChange]);
  
  // Load all settings from localStorage
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('accessibility-font-size');
    return saved ? [parseInt(saved)] : [100];
  });
  
  const [lineHeight, setLineHeight] = useState(() => {
    const saved = localStorage.getItem('accessibility-line-height');
    return saved ? [parseInt(saved)] : [100];
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

  const [textToSpeech, setTextToSpeech] = useState(() => {
    const saved = localStorage.getItem('accessibility-text-to-speech');
    return saved === 'true';
  });

  const [speechVoice, setSpeechVoice] = useState(() => {
    const saved = localStorage.getItem('accessibility-speech-voice') || 'rhvoice'; // Default to RHVoice
    return saved;
  });

  const [speechSpeed, setSpeechSpeed] = useState(() => {
    const saved = localStorage.getItem('accessibility-speech-speed');
    return saved ? [parseFloat(saved)] : [1.0];
  });

  // RHVoice specific settings
  const [rhvoiceRate, setRhvoiceRate] = useState(() => {
    const saved = localStorage.getItem('accessibility-rhvoice-rate');
    return saved || '50'; // Normal speed by default
  });

  const [rhvoiceVoice, setRhvoiceVoice] = useState(() => {
    const saved = localStorage.getItem('accessibility-rhvoice-voice');
    return saved || 'elena'; // Elena voice by default
  });

  const [rhvoiceVolume, setRhvoiceVolume] = useState(() => {
    const saved = localStorage.getItem('accessibility-rhvoice-volume');
    return saved || '100'; // Full volume by default
  });

  const { isPlaying, speakText, stopSpeech: globalStopSpeech, setSpeechEngine, setRHVoiceSettings, currentEngine } = useSpeechSynthesis();
  const [showSpeechSettings, setShowSpeechSettings] = useState(false);

  // Text magnifier settings
  const [magnifierColorScheme, setMagnifierColorScheme] = useState(() => {
    const saved = localStorage.getItem('accessibility-magnifier-color-scheme');
    const userSet = localStorage.getItem('accessibility-magnifier-user-set') === 'true';
    
    // If user hasn't set a scheme, use theme-based default
    if (!saved || !userSet) {
      return actualTheme === 'dark' ? 'black-white' : 'white-black';
    }
    return saved;
  });

  const [hasUserSetMagnifierScheme, setHasUserSetMagnifierScheme] = useState(() => {
    return localStorage.getItem('accessibility-magnifier-user-set') === 'true';
  });

  const [magnifierFontSize, setMagnifierFontSize] = useState(() => {
    const saved = localStorage.getItem('accessibility-magnifier-font-size');
    return saved || 'large';
  });

  const [showMagnifierSettings, setShowMagnifierSettings] = useState(false);
  const [showAdvancedFont, setShowAdvancedFont] = useState(false);

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

  const toggleTextToSpeech = (enabled: boolean) => {
    setTextToSpeech(enabled);
    localStorage.setItem('accessibility-text-to-speech', enabled.toString());
    
    if (!enabled) {
      globalStopSpeech();
      setShowSpeechSettings(false);
    }
  };

  const updateSpeechVoice = (voice: string) => {
    setSpeechVoice(voice);
    localStorage.setItem('accessibility-speech-voice', voice);
  };

  const updateSpeechSpeed = (speed: number[]) => {
    setSpeechSpeed(speed);
    localStorage.setItem('accessibility-speech-speed', speed[0].toString());
  };

  const updateRhvoiceRate = (rate: string) => {
    setRhvoiceRate(rate);
    localStorage.setItem('accessibility-rhvoice-rate', rate);
  };

  const updateRhvoiceVoice = (voice: string) => {
    setRhvoiceVoice(voice);
    localStorage.setItem('accessibility-rhvoice-voice', voice);
  };

  const updateRhvoiceVolume = (volume: string) => {
    setRhvoiceVolume(volume);
    localStorage.setItem('accessibility-rhvoice-volume', volume);
  };

  // Speech synthesis functions using centralized hook
  const handleSpeakText = async (text: string) => {
    if (!text.trim()) return;
    
    try {
      // Use the unified speech system
      await speakText(text);
    } catch (error) {
      console.error('Speech synthesis error:', error);
    }
  };

  // Update settings when voice preference changes
  useEffect(() => {
    setSpeechEngine(speechVoice as 'browser' | 'rhvoice');
    localStorage.setItem('accessibility-speech-voice', speechVoice);
  }, [speechVoice, setSpeechEngine]);

  // Update RHVoice settings when they change
  useEffect(() => {
    setRHVoiceSettings({
      rate: parseInt(rhvoiceRate),
      pitch: 50, // Fixed pitch
      volume: parseInt(rhvoiceVolume),
      voice: rhvoiceVoice
    });
  }, [rhvoiceRate, rhvoiceVoice, rhvoiceVolume, setRHVoiceSettings]);

  const speakSelectedText = async () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    
    try {
      if (selectedText) {
        await speakText(selectedText);
      } else {
        // If no text selected, speak the current page title
        const title = document.title || 'Заголовок страницы отсутствует';
        await speakText(title);
      }
    } catch (error) {
      console.error('Speech synthesis error:', error);
    }
  };

  const updateMagnifierColorScheme = (scheme: string) => {
    setMagnifierColorScheme(scheme);
    localStorage.setItem('accessibility-magnifier-color-scheme', scheme);
    setHasUserSetMagnifierScheme(true);
    localStorage.setItem('accessibility-magnifier-user-set', 'true');
  };

  const updateMagnifierFontSize = (size: string) => {
    setMagnifierFontSize(size);
    localStorage.setItem('accessibility-magnifier-font-size', size);
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

    // Text-to-speech is now controlled via UI buttons only

    // Set default color scheme based on theme if user hasn't set one
    const userSet = localStorage.getItem('accessibility-magnifier-user-set') === 'true';
    
    if (!userSet) {
      const defaultScheme = actualTheme === 'dark' ? 'black-white' : 'white-black';
      setMagnifierColorScheme(defaultScheme);
      localStorage.setItem('accessibility-magnifier-color-scheme', defaultScheme);
    }
  }, []);

  // Auto-switch magnifier color scheme when theme changes
  useEffect(() => {
    const savedTheme = localStorage.getItem('accessibility-last-theme');
    const userSet = localStorage.getItem('accessibility-magnifier-user-set') === 'true';
    
    // If theme changed and user hasn't manually set a scheme, apply new default
    if (savedTheme && savedTheme !== actualTheme && !userSet) {
      const newScheme = actualTheme === 'dark' ? 'black-white' : 'white-black';
      setMagnifierColorScheme(newScheme);
      localStorage.setItem('accessibility-magnifier-color-scheme', newScheme);
    }
    
    // If theme changed and user had set a scheme, reset their choice to get new default
    if (savedTheme && savedTheme !== actualTheme && userSet) {
      const newScheme = actualTheme === 'dark' ? 'black-white' : 'white-black';
      setMagnifierColorScheme(newScheme);
      setHasUserSetMagnifierScheme(false);
      localStorage.setItem('accessibility-magnifier-color-scheme', newScheme);
      localStorage.setItem('accessibility-magnifier-user-set', 'false');
    }
    
    // Save current theme
    localStorage.setItem('accessibility-last-theme', actualTheme);
  }, [actualTheme]);

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
        // Get color scheme settings
        const colorSchemes = {
          'black-white': { bg: 'black', color: 'white', border: '#00bfff', scrollbar: '#00bfff #333' },
          'white-black': { bg: 'white', color: 'black', border: '#333', scrollbar: '#333 #ddd' },
          'sepia': { bg: '#f4f1e8', color: '#5c4b37', border: '#8b7355', scrollbar: '#8b7355 #e8dcc0' },
          'light-blue': { bg: '#f0fbff', color: '#4285f4', border: '#4285f4', scrollbar: '#4285f4 #e6f7ff' }
        };
        
        const currentScheme = colorSchemes[magnifierColorScheme as keyof typeof colorSchemes] || colorSchemes['black-white'];
        
        // Get font size settings
        const fontSizes = {
          'medium': '36px',
          'large': '48px',
          'very-large': '64px'
        };
        
        const currentFontSize = fontSizes[magnifierFontSize as keyof typeof fontSizes] || fontSizes['large'];

        magnifierOverlay = document.createElement('div');
        magnifierOverlay.style.cssText = `
          position: fixed;
          background: ${currentScheme.bg};
          border: 3px solid ${currentScheme.border};
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
          color: ${currentScheme.color};
          font-size: ${currentFontSize};
          font-weight: bold;
          padding: 20px;
          word-wrap: break-word;
          overflow-y: auto;
          flex: 1;
          scrollbar-width: thin;
          scrollbar-color: ${currentScheme.scrollbar};
        `;

        // Custom scrollbar styles for webkit browsers
        const scrollbarColors = currentScheme.scrollbar.split(' ');
        const thumbColor = scrollbarColors[0];
        const trackColor = scrollbarColors[1];
        
        magnifierContent.innerHTML = `
          <style>
            .magnifier-content::-webkit-scrollbar {
              width: 12px;
            }
            .magnifier-content::-webkit-scrollbar-track {
              background: ${trackColor};
            }
            .magnifier-content::-webkit-scrollbar-thumb {
              background: ${thumbColor};
              border-radius: 6px;
            }
            .magnifier-content::-webkit-scrollbar-thumb:hover {
              background: ${thumbColor}dd;
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
      
      // Position overlay near mouse cursor with smart positioning
      const rect = magnifierOverlay.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const margin = 20;
      
      let left = e.clientX + margin;
      let top = e.clientY - rect.height - margin;

      // Adjust horizontal position if overlay goes off screen
      if (left + rect.width > viewportWidth) {
        left = e.clientX - rect.width - margin;
        // If still doesn't fit, align to the right edge
        if (left < 0) {
          left = viewportWidth - rect.width - margin;
        }
      }
      
      // Adjust vertical position with smart logic
      if (top < 0) {
        // If doesn't fit above cursor, try below
        top = e.clientY + margin;
        
        // If still doesn't fit below (goes past bottom), position to fit in viewport
        if (top + rect.height > viewportHeight) {
          // Try to center vertically around cursor
          top = e.clientY - rect.height / 2;
          
          // Ensure it doesn't go above viewport
          if (top < margin) {
            top = margin;
          }
          
          // Ensure it doesn't go below viewport
          if (top + rect.height > viewportHeight - margin) {
            top = viewportHeight - rect.height - margin;
          }
        }
      } else if (top + rect.height > viewportHeight) {
        // If positioned above but still goes past bottom, move up
        top = viewportHeight - rect.height - margin;
        
        // If even at top of viewport it doesn't fit, keep at top with margin
        if (top < margin) {
          top = margin;
        }
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
  }, [textMagnifier, magnifierColorScheme, magnifierFontSize]);

  const resetSettings = () => {
    setFontSize([100]);
    setLineHeight([100]);
    setLetterSpacing([100]);
    setHighContrast(false);
    setGrayscale(false);
    setLargeText(false);
    setReducedMotion(false);
    setTextMagnifier(false);
    setMagnifierColorScheme(actualTheme === 'dark' ? 'white-black' : 'black-white');
    setMagnifierFontSize('large');
    setHasUserSetMagnifierScheme(false);
    setShowAdvancedFont(false);
    setShowMagnifierSettings(false);
    setTextToSpeech(false);
    setSpeechVoice('browser');
    setSpeechSpeed([1.0]);
    setShowSpeechSettings(false);
    globalStopSpeech();
    
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
    localStorage.removeItem('accessibility-magnifier-color-scheme');
    localStorage.removeItem('accessibility-magnifier-font-size');
    localStorage.removeItem('accessibility-magnifier-user-set');
    localStorage.removeItem('accessibility-last-theme');
    localStorage.removeItem('accessibility-text-to-speech');
    localStorage.removeItem('accessibility-speech-voice');
    localStorage.removeItem('accessibility-speech-speed');
  };

  const panelContent = (
    <TooltipProvider>
      {/* Backdrop - only show when visible */}
      {isVisible && (
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity duration-300 accessibility-backdrop"
          style={{
            zIndex: 99998,
            filter: 'none',
            isolation: 'isolate',
            pointerEvents: 'auto',
            opacity: open ? 0.5 : 0
          }}
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Side Panel */}
      <div 
        ref={panelRef}
        className="accessibility-panel fixed top-0 right-0 h-full w-96 bg-background border-l shadow-xl flex flex-col"
        style={{
          display: isVisible ? 'flex' : 'none',
          // Force hardware acceleration and better rendering
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          transform: isAnimating ? 'translateX(0) translateZ(0)' : 'translateX(100%) translateZ(0)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // Force colors even in grayscale mode with highest z-index and isolation
          zIndex: 99999,
          filter: 'none',
          isolation: 'isolate',
          backgroundColor: actualTheme === 'dark' ? 'hsl(222.2, 84%, 4.9%)' : 'hsl(0, 0%, 100%)',
          borderColor: actualTheme === 'dark' ? 'hsl(217.2, 32.6%, 17.5%)' : 'hsl(214.3, 31.8%, 91.4%)',
          color: actualTheme === 'dark' ? 'hsl(210, 40%, 98%)' : 'hsl(222.2, 84%, 4.9%)',
          overflowY: 'auto',
          pointerEvents: 'auto'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-title"
        aria-describedby="accessibility-description"
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h2 id="accessibility-title" className="flex items-center gap-2 text-lg font-semibold">
            <Eye className="h-5 w-5" />
            Специальные возможности
          </h2>
          <Button
            ref={firstFocusableRef}
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            aria-label="Закрыть панель"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div id="accessibility-description" className="sr-only">
          Панель настроек специальных возможностей для улучшения доступности сайта
        </div>

        {/* Scrollable Content */}
        <div className="space-y-6 flex-1 p-4 overflow-y-auto" style={{ position: 'relative' }}>
          {/* Theme Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {theme === 'light' && <Sun className="h-4 w-4" />}
              {theme === 'dark' && <Moon className="h-4 w-4" />}
              {theme === 'system' && <Monitor className="h-4 w-4" />}
              <Label>Тема оформления</Label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {/* Light Theme */}
              <div className="text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setTheme('light')}
                      className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 w-full ${
                        theme === 'light' 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      aria-label="Светлая тема"
                    >
                      <div className="w-full h-16 rounded bg-white border border-gray-200 overflow-hidden">
                        {/* Mini site preview - light theme */}
                        <div className="h-3 bg-blue-50 border-b border-gray-200 flex items-center px-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full mr-1"></div>
                          <div className="w-4 h-0.5 bg-gray-300 rounded"></div>
                        </div>
                        <div className="p-1 space-y-1">
                          <div className="w-full h-1 bg-blue-500 rounded"></div>
                          <div className="w-4/5 h-0.5 bg-gray-400 rounded"></div>
                          <div className="w-3/5 h-0.5 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                      <div className="absolute -top-1 -right-1">
                        <Sun className="h-3 w-3 text-yellow-500" />
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Светлая тема</TooltipContent>
                </Tooltip>
                <p className="text-xs text-muted-foreground mt-2">Светлая</p>
              </div>

              {/* Dark Theme */}
              <div className="text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 w-full ${
                        theme === 'dark' 
                          ? 'border-purple-500 ring-2 ring-purple-200' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      aria-label="Темная тема"
                    >
                      <div className="w-full h-16 rounded bg-gray-900 border border-gray-700 overflow-hidden">
                        {/* Mini site preview - dark theme */}
                        <div className="h-3 bg-gray-800 border-b border-gray-700 flex items-center px-2">
                          <div className="w-1 h-1 bg-purple-500 rounded-full mr-1"></div>
                          <div className="w-4 h-0.5 bg-gray-500 rounded"></div>
                        </div>
                        <div className="p-1 space-y-1">
                          <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded"></div>
                          <div className="w-4/5 h-0.5 bg-gray-400 rounded"></div>
                          <div className="w-3/5 h-0.5 bg-gray-500 rounded"></div>
                        </div>
                      </div>
                      <div className="absolute -top-1 -right-1">
                        <Moon className="h-3 w-3 text-purple-400" />
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Темная тема</TooltipContent>
                </Tooltip>
                <p className="text-xs text-muted-foreground mt-2">Темная</p>
              </div>

              {/* System Theme */}
              <div className="text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setTheme('system')}
                      className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 w-full ${
                        theme === 'system' 
                          ? 'border-green-500 ring-2 ring-green-200' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      aria-label="Как в системе"
                    >
                      <div className="w-full h-16 rounded border border-gray-300 overflow-hidden bg-gradient-to-b from-white via-gray-100 to-gray-900">
                        {/* Mini site preview - split theme */}
                        <div className="h-3 bg-gray-100 border-b border-gray-300 flex items-center px-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full mr-1"></div>
                          <div className="w-4 h-0.5 bg-gray-400 rounded"></div>
                        </div>
                        <div className="h-8 bg-gradient-to-b from-white to-gray-900 flex items-center justify-center">
                          <div className="w-6 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded opacity-70"></div>
                        </div>
                      </div>
                      <div className="absolute -top-1 -right-1">
                        <Monitor className="h-3 w-3 text-green-500" />
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Как в системе</TooltipContent>
                </Tooltip>
                <p className="text-xs text-muted-foreground mt-2">Авто</p>
              </div>
            </div>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <Label id="font-size-label" htmlFor="font-size">Размер шрифта: {fontSize[0]}%</Label>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedFont(!showAdvancedFont)}
                className="h-6 w-6 p-0"
                aria-label={showAdvancedFont ? "Скрыть дополнительные настройки шрифта" : "Показать дополнительные настройки шрифта"}
              >
                {showAdvancedFont ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
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

            {/* Advanced Font Settings */}
            {showAdvancedFont && (
              <div className="space-y-4 pl-6 border-l-2 border-muted">
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
              </div>
            )}
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ZoomIn className="h-4 w-4" />
                <Label htmlFor="text-magnifier">Увеличение при наведении</Label>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setShowMagnifierSettings(!showMagnifierSettings)}
                      aria-label="Настройки увеличения текста"
                      disabled={!textMagnifier}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Настройки</p>
                  </TooltipContent>
                </Tooltip>
                <Switch
                  id="text-magnifier"
                  checked={textMagnifier}
                  onCheckedChange={(checked) => {
                    setTextMagnifier(checked);
                    toggleTextMagnifier(checked);
                    if (!checked) setShowMagnifierSettings(false);
                  }}
                  aria-describedby="text-magnifier-desc"
                />
              </div>
            </div>
            <p id="text-magnifier-desc" className="text-sm text-muted-foreground">
              Зажмите Shift и наведите на текст для увеличения
            </p>

            {/* Magnifier Settings */}
            {showMagnifierSettings && textMagnifier && (
              <div className="space-y-4 pl-6 border-l-2 border-muted">
                {/* Color Scheme Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Цветовая схема</Label>
                  <div className="grid grid-cols-4 gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={`h-8 w-full border-2 rounded-md flex items-center justify-center text-white font-bold text-sm transition-colors ${
                            magnifierColorScheme === 'black-white' 
                              ? 'border-blue-500 bg-black' 
                              : 'border-gray-300 bg-black hover:border-gray-400'
                          }`}
                          onClick={() => updateMagnifierColorScheme('black-white')}
                          aria-label="Черный фон, белый текст"
                        >
                          T
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Черный фон, белый текст</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={`h-8 w-full border-2 rounded-md flex items-center justify-center text-black font-bold text-sm transition-colors ${
                            magnifierColorScheme === 'white-black' 
                              ? 'border-blue-500 bg-white' 
                              : 'border-gray-300 bg-white hover:border-gray-400'
                          }`}
                          onClick={() => updateMagnifierColorScheme('white-black')}
                          aria-label="Белый фон, черный текст"
                        >
                          T
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Белый фон, черный текст</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={`h-8 w-full border-2 rounded-md flex items-center justify-center font-bold text-sm transition-colors ${
                            magnifierColorScheme === 'sepia' 
                              ? 'border-blue-500 bg-[#f4f1e8] text-[#5c4b37]' 
                              : 'border-gray-300 bg-[#f4f1e8] text-[#5c4b37] hover:border-gray-400'
                          }`}
                          onClick={() => updateMagnifierColorScheme('sepia')}
                          aria-label="Режим защиты глаз"
                        >
                          T
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Режим защиты глаз</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={`h-8 w-full border-2 rounded-md flex items-center justify-center font-bold text-sm transition-colors ${
                            magnifierColorScheme === 'light-blue' 
                              ? 'border-blue-500 bg-[#f0fbff] text-[#4285f4]' 
                              : 'border-gray-300 bg-[#f0fbff] text-[#4285f4] hover:border-gray-400'
                          }`}
                          onClick={() => updateMagnifierColorScheme('light-blue')}
                          aria-label="Светло-голубая схема"
                        >
                          T
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Светло-голубая схема</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Font Size Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Размер шрифта</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={magnifierFontSize === 'medium' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateMagnifierFontSize('medium')}
                      className="text-xs"
                    >
                      Средний
                    </Button>
                    <Button
                      variant={magnifierFontSize === 'large' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateMagnifierFontSize('large')}
                      className="text-xs"
                    >
                      Большой
                    </Button>
                    <Button
                      variant={magnifierFontSize === 'very-large' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateMagnifierFontSize('very-large')}
                      className="text-xs"
                    >
                      Очень большой
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Text to Speech */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <Label htmlFor="text-to-speech">Озвучивание текста</Label>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setShowSpeechSettings(!showSpeechSettings)}
                      aria-label="Настройки озвучивания"
                      disabled={!textToSpeech}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Настройки</p>
                  </TooltipContent>
                </Tooltip>
                <Switch
                  id="text-to-speech"
                  checked={textToSpeech}
                  onCheckedChange={(checked) => {
                    toggleTextToSpeech(checked);
                    if (!checked) setShowSpeechSettings(false);
                  }}
                  aria-describedby="text-to-speech-desc"
                />
              </div>
            </div>
            
            <p id="text-to-speech-desc" className="text-sm text-muted-foreground">
              Озвучивает выделенный текст
            </p>

            {textToSpeech && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={speakSelectedText}
                  disabled={isPlaying}
                  className="flex items-center gap-2"
                >
                  {isPlaying ? (
                    <>
                      <Square className="h-4 w-4" />
                      Озвучивается...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Озвучить
                    </>
                  )}
                </Button>
                
                {isPlaying && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={globalStopSpeech}
                    className="flex items-center gap-2"
                  >
                    <VolumeX className="h-4 w-4" />
                    Стоп
                  </Button>
                )}
              </div>
            )}

            {showSpeechSettings && textToSpeech && (
              <div className="space-y-4 pl-4 border-l-2 border-muted">
                <div>
                  <Label htmlFor="speech-voice">Голос</Label>
                  <CustomSelect
                    value={speechVoice}
                    onChange={updateSpeechVoice}
                    options={[
                      { value: "browser", label: "Браузерный синтезатор" },
                      { value: "rhvoice", label: "RHVoice (высокое качество)" }
                    ]}
                    placeholder="Выберите голос"
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {speechVoice === 'rhvoice' 
                      ? 'Профессиональный русский синтезатор речи (с автоматическим fallback)'
                      : 'Встроенный синтезатор браузера'
                    }
                  </p>
                </div>

                {speechVoice === 'browser' ? (
                  <div>
                    <Label id="speech-speed-label">Скорость речи: {speechSpeed[0].toFixed(1)}x</Label>
                    <AccessibleSlider
                      id="speech-speed"
                      value={speechSpeed}
                      onValueChange={updateSpeechSpeed}
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      label="Скорость речи"
                      unit="x"
                      className="mt-2"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Голос</Label>
                      <CustomSelect
                        value={rhvoiceVoice}
                        onChange={updateRhvoiceVoice}
                        options={[
                          { value: "elena", label: "Елена" },
                          { value: "irina", label: "Ирина" },
                          { value: "anna", label: "Анна" },
                          { value: "tatyana", label: "Татьяна" }
                        ]}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Скорость</Label>
                      <CustomSelect
                        value={rhvoiceRate}
                        onChange={updateRhvoiceRate}
                        options={[
                          { value: "30", label: "Медленно (30%)" },
                          { value: "50", label: "Нормально (50%)" },
                          { value: "70", label: "Быстро (70%)" },
                          { value: "90", label: "Очень быстро (90%)" }
                        ]}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Громкость</Label>
                      <CustomSelect
                        value={rhvoiceVolume}
                        onChange={updateRhvoiceVolume}
                        options={[
                          { value: "25", label: "Тихо (25%)" },
                          { value: "50", label: "Средне (50%)" },
                          { value: "75", label: "Громко (75%)" },
                          { value: "100", label: "Очень громко (100%)" }
                        ]}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Fixed Bottom Section with Reset Button */}
        <div className="p-4 border-t flex-shrink-0">
          <Button
            variant="outline"
            onClick={resetSettings}
            className="w-full"
          >
            Сбросить настройки
          </Button>
        </div>
      </div>
      
      {/* Floating Speech Button */}
      <FloatingSpeechButton
        isEnabled={textToSpeech}
        speechVoice={speechVoice}
        speechSpeed={speechSpeed}
        onSpeak={speakText}
        onStop={globalStopSpeech}
        isPlaying={isPlaying}
      />
    </TooltipProvider>
  );

  // Create isolated container for panel outside of all CSS contexts
  useEffect(() => {
    let panelContainer = document.getElementById('accessibility-panel-container');
    if (!panelContainer) {
      panelContainer = document.createElement('div');
      panelContainer.id = 'accessibility-panel-container';
      panelContainer.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        pointer-events: none !important;
        z-index: 999999 !important;
        filter: none !important;
        isolation: isolate !important;
      `;
      document.documentElement.appendChild(panelContainer);
    }
    return () => {
      const container = document.getElementById('accessibility-panel-container');
      if (container && !document.querySelector('.accessibility-panel')) {
        container.remove();
      }
    };
  }, []);

  // Render panel in isolated container
  const panelContainer = document.getElementById('accessibility-panel-container');
  return panelContainer ? createPortal(panelContent, panelContainer) : null;
}
