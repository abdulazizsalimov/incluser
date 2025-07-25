import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0 mt-1"
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
      </CardHeader>
      
      {isExpanded && (
        <CardContent 
          id={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className="pt-0"
        >
          <div className="prose prose-lg dark:prose-invert max-w-none prose-content">
            {children}
          </div>
        </CardContent>
      )}
    </Card>
  );
}