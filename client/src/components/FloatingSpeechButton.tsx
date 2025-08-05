import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Square } from "lucide-react";

interface FloatingSpeechButtonProps {
  isEnabled: boolean;
  speechVoice: string;
  speechSpeed: number[];
  onSpeak: (text: string) => Promise<void>;
  onStop: () => void;
  isPlaying: boolean;
}

export default function FloatingSpeechButton({
  isEnabled,
  speechVoice,
  speechSpeed,
  onSpeak,
  onStop,
  isPlaying
}: FloatingSpeechButtonProps) {
  const [selectedText, setSelectedText] = useState("");
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [showButton, setShowButton] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isEnabled) {
      setShowButton(false);
      return;
    }

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 0) {
        setSelectedText(text);
        
        // Get selection position
        const range = selection?.getRangeAt(0);
        if (range) {
          const rect = range.getBoundingClientRect();
          
          // Position button near the end of selection
          const x = Math.min(rect.right + 10, window.innerWidth - 120);
          const y = rect.top - 50;
          
          setButtonPosition({ x, y });
          setShowButton(true);
        }
      } else {
        setShowButton(false);
        setSelectedText("");
      }
    };

    const handleMouseUp = () => {
      // Small delay to allow selection to be finalized
      setTimeout(handleSelectionChange, 10);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Handle keyboard text selection
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || 
          e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
          e.shiftKey) {
        setTimeout(handleSelectionChange, 10);
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Hide button if clicking outside of it, but not if clicking on the button itself
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        // Delay checking selection to allow button click to complete
        setTimeout(() => {
          const selection = window.getSelection();
          if (!selection?.toString().trim()) {
            setShowButton(false);
          }
        }, 100);
      }
    };

    const handleScroll = () => {
      // Hide button on scroll
      setShowButton(false);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isEnabled]);

  const handleSpeakClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🎯 FloatingSpeechButton CLICKED!', { 
      isPlaying, 
      selectedText: selectedText.substring(0, 50) + '...',
      position: buttonPosition,
      event: e
    });
    
    // Visual feedback
    if (buttonRef.current) {
      buttonRef.current.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (buttonRef.current) buttonRef.current.style.transform = 'scale(1)';
      }, 100);
    }
    
    if (isPlaying) {
      console.log('🛑 Stopping speech...');
      onStop();
    } else if (selectedText) {
      console.log('🗣️ Starting speech for selected text:', selectedText.substring(0, 100) + '...');
      try {
        await onSpeak(selectedText);
        console.log('✅ Speech started successfully');
      } catch (error) {
        console.error('❌ Error starting speech:', error);
      }
    } else {
      console.log('⚠️ No selected text to speak');
    }
    
    // Keep the selection after clicking
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selectedText) {
        // Try to restore selection if it was cleared
        const range = document.createRange();
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null
        );
        
        let node;
        while (node = walker.nextNode()) {
          if (node.textContent && node.textContent.includes(selectedText.substring(0, 20))) {
            try {
              const start = node.textContent.indexOf(selectedText.substring(0, 20));
              if (start !== -1) {
                range.setStart(node, start);
                range.setEnd(node, Math.min(start + selectedText.length, node.textContent.length));
                selection.removeAllRanges();
                selection.addRange(range);
                break;
              }
            } catch (err) {
              // Ignore range errors
            }
          }
        }
      }
    }, 50);
  };

  if (!showButton || !isEnabled) {
    return null;
  }

  return (
    <Button
      ref={buttonRef}
      variant="default"
      size="sm"
      onMouseDown={handleSpeakClick}
      className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl border border-blue-500 flex items-center gap-2 pointer-events-auto cursor-pointer"
      style={{
        position: 'fixed',
        left: `${buttonPosition.x}px`,
        top: `${buttonPosition.y}px`,
        zIndex: 999999,
        pointerEvents: 'auto',
        userSelect: 'none'
      }}
      title={isPlaying ? "Остановить озвучивание" : "Озвучить выделенный текст"}
    >
      {isPlaying ? (
        <Square className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </Button>
  );
}