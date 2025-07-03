'use client';

import type { Term, InteractiveTool } from '@/lib/types';
import { Button } from '@/components/ui/button';
import MarkdownRenderer from './MarkdownRenderer';
import InteractiveToolModal from './InteractiveToolModal';
import { generateExampleAction } from '@/app/actions';
import React, { useState } from 'react';
import { Loader2, Wand2, PlaySquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TermCardProps {
  term: Term;
}

export default function TermCard({ term }: TermCardProps) {
  const [generatedExample, setGeneratedExample] = useState<string | null>(null);
  const [isLoadingExample, setIsLoadingExample] = useState(false);
  const [selectedTool, setSelectedTool] = useState<InteractiveTool | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  const handleGenerateExample = async () => {
    setIsLoadingExample(true);
    setGeneratedExample(null);
    const result = await generateExampleAction(term.name);
    if ('error' in result) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      setGeneratedExample(result.example);
    }
    setIsLoadingExample(false);
  };

  // Determine what additional content we have
  const hasExample = term.content.example || generatedExample;
  const hasAnalogy = term.content.analogy;
  const hasElaboration = term.content.elaboration;
  const hasWhyItMatters = term.content.whyItMatters;
  const hasInteractiveTools = term.interactiveTools && term.interactiveTools.length > 0;
  
  const hasAdditionalContent = hasExample || hasAnalogy || hasElaboration || hasWhyItMatters || hasInteractiveTools;

  return (
    <>
      <div 
        id={term.id} 
        className={cn(
          "group bg-white rounded-xl border border-gray-200",
          "shadow-sm hover:shadow-md transition-all duration-300 ease-out",
          "overflow-hidden hover:scale-[1.01]",
          "flex flex-col h-full"
        )}
      >
        {/* Card Header */}
        <div className="p-6 pb-4 flex-1">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                {term.name}
              </h2>
              <Badge 
                variant="secondary" 
                className="bg-purple-100 text-purple-700 border-purple-200 rounded-lg px-2 py-1 text-sm font-medium"
              >
                {term.category}
              </Badge>
            </div>
            
            {hasInteractiveTools && (
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <PlaySquare className="h-5 w-5 text-blue-600" />
              </div>
            )}
          </div>

          {/* Primary Definition */}
          <div className="prose prose-sm max-w-none">
            <div className="text-gray-700 leading-relaxed">
              <MarkdownRenderer content={term.content.simpleDefinition} />
            </div>
          </div>
        </div>

        {/* Interactive Tools Section */}
        {hasInteractiveTools && (
          <div className="px-6 pb-4">
            <div className="space-y-2">
              {term.interactiveTools!.map(tool => (
                <button
                  key={tool.url}
                  onClick={() => setSelectedTool(tool)}
                  className={cn(
                    "w-full p-3 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200",
                    "text-blue-700 hover:text-blue-800 font-medium text-sm text-left",
                    "transition-all duration-200 ease-out",
                    "block whitespace-normal leading-relaxed"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className="p-1 bg-blue-100 rounded flex-shrink-0 mt-0.5">
                      <PlaySquare className="h-3 w-3" />
                    </div>
                    <span>Try: {tool.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Additional Content Toggle - Bottom Aligned */}
        {hasAdditionalContent && (
          <div className="border-t border-gray-200 mt-auto">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={cn(
                "w-full p-4 flex items-center justify-between",
                "text-gray-600 hover:text-gray-900 transition-colors duration-200",
                "group/toggle"
              )}
            >
              <span className="font-medium text-sm">
                {showDetails ? 'Show Less' : 'Learn More'}
              </span>
              {showDetails ? (
                <ChevronUp className="h-4 w-4 transition-transform duration-200 group-hover/toggle:scale-110 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover/toggle:scale-110 flex-shrink-0" />
              )}
            </button>
          </div>
        )}

        {/* Expandable Details */}
        {hasAdditionalContent && showDetails && (
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="p-6 space-y-6">
              
              {/* Example Section */}
              {(hasExample || !term.content.example) && (
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    Example
                  </h3>
                  {term.content.example ? (
                    <div className="prose max-w-none text-gray-700">
                      <MarkdownRenderer content={term.content.example} />
                    </div>
                  ) : isLoadingExample ? (
                    <div className="flex items-center gap-3 text-gray-600 py-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Generating example...</span>
                    </div>
                  ) : generatedExample ? (
                    <div className="prose max-w-none text-gray-700">
                      <MarkdownRenderer content={generatedExample} />
                    </div>
                  ) : (
                    <Button 
                      onClick={handleGenerateExample} 
                      variant="outline" 
                      className="rounded-lg hover:shadow-sm transition-all duration-200 text-sm"
                    >
                      <Wand2 className="mr-2 h-3 w-3" />
                      Generate Example with AI
                    </Button>
                  )}
                </div>
              )}

              {/* Analogy Section */}
              {hasAnalogy && term.content.analogy && (
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Think of it Like...
                  </h3>
                  <div className="prose max-w-none text-gray-700">
                    <MarkdownRenderer content={term.content.analogy} />
                  </div>
                </div>
              )}

              {/* Deep Dive Section */}
              {hasElaboration && term.content.elaboration && (
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Deep Dive
                  </h3>
                  <div className="prose max-w-none text-gray-700">
                    <MarkdownRenderer content={term.content.elaboration} />
                  </div>
                </div>
              )}

              {/* Why It Matters Section */}
              {hasWhyItMatters && term.content.whyItMatters && (
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    Why It Matters
                  </h3>
                  <div className="prose max-w-none text-gray-700">
                    <MarkdownRenderer content={term.content.whyItMatters} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {selectedTool && (
        <InteractiveToolModal
          isOpen={!!selectedTool}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedTool(null);
            }
          }}
          tool={selectedTool}
        />
      )}
    </>
  );
}
