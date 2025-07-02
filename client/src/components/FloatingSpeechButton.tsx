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
      // Hide button if clicking outside of it
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        const selection = window.getSelection();
        if (!selection?.toString().trim()) {
          setShowButton(false);
        }
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

  const handleSpeakClick = async () => {
    if (isPlaying) {
      onStop();
    } else if (selectedText) {
      await onSpeak(selectedText);
    }
  };

  if (!showButton || !isEnabled) {
    return null;
  }

  return (
    <Button
      ref={buttonRef}
      variant="default"
      size="sm"
      onClick={handleSpeakClick}
      className="fixed z-50 bg-blue-600 hover:bg-blue-700 text-white shadow-lg border border-blue-500 flex items-center gap-2"
      style={{
        left: `${buttonPosition.x}px`,
        top: `${buttonPosition.y}px`,
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