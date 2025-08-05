import { useState, useRef } from "react";
import { ChevronDown, ChevronUp, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

interface ExpandableSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export default function ExpandableSection({ 
  title, 
  description, 
  children, 
  defaultExpanded = false 
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentRef = useRef<HTMLDivElement>(null);
  const { isPlaying, speakText, stopSpeech } = useSpeechSynthesis();

  // Extract text content from children for speech synthesis
  const extractTextContent = (element: any): string => {
    if (typeof element === 'string') {
      return element;
    }
    
    if (element?.props?.children) {
      if (Array.isArray(element.props.children)) {
        return element.props.children.map(extractTextContent).join(' ');
      }
      return extractTextContent(element.props.children);
    }
    
    return '';
  };

  const handleSpeakSection = async () => {
    try {
      // First, get text from title and description
      let textToSpeak = `${title}. ${description}. `;
      
      // Then add content from expanded section
      if (isExpanded && contentRef.current) {
        const contentText = contentRef.current.innerText || contentRef.current.textContent || '';
        textToSpeak += contentText;
      } else {
        // If section is not expanded, try to extract text from children
        const childrenText = extractTextContent(children);
        textToSpeak += childrenText;
      }
      
      // Clean up the text
      textToSpeak = textToSpeak
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '. ')
        .trim();
      
      if (textToSpeak) {
        await speakText(textToSpeak);
      }
    } catch (error) {
      console.error('Error speaking section:', error);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0 sm:mt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={isPlaying ? stopSpeech : handleSpeakSection}
              className="flex items-center gap-2"
              title={isPlaying ? "Остановить озвучивание" : "Прослушать раздел"}
            >
              {isPlaying ? (
                <>
                  <VolumeX className="h-4 w-4" />
                  Стоп
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" />
                  Прослушать
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-controls={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {isExpanded ? (
                <>
                  Свернуть
                  <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Читать дальше
                  <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent 
          id={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className="pt-0"
        >
          <div 
            ref={contentRef}
            className="prose prose-lg dark:prose-invert max-w-none prose-content"
          >
            {children}
          </div>
        </CardContent>
      )}
    </Card>
  );
}