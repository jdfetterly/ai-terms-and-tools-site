'use client';

import type { Term, InteractiveTool } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MarkdownRenderer from './MarkdownRenderer';
import InteractiveToolModal from './InteractiveToolModal';
import React, { useState } from 'react';
import { Loader2, Wand2, PlaySquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';

interface TermCardProps {
  term: Term;
}

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';

export default function TermCard({ term }: TermCardProps) {
  const [generatedExample, setGeneratedExample] = useState<string | null>(null);
  const [isLoadingExample, setIsLoadingExample] = useState(false);
  const [selectedTool, setSelectedTool] = useState<InteractiveTool | null>(null);
  const { toast } = useToast();

  const handleGenerateExample = async () => {
    if (isStaticExport) return;
    
    setIsLoadingExample(true);
    setGeneratedExample(null);
    
    try {
      const { generateExampleAction } = await import('@/app/actions');
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate example",
        variant: "destructive",
      });
    }
    
    setIsLoadingExample(false);
  };

  return (
    <>
      <Card id={term.id} className="mb-4 shadow-sm border overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
        <CardHeader className="bg-card-foreground/5 pb-3">
          <CardTitle className="text-xl font-headline text-primary">{term.name}</CardTitle>
          <div className="flex items-center justify-between mt-1">
            <Badge variant="default" className="text-xs">{term.category}</Badge>
            {term.interactiveTools && term.interactiveTools.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <PlaySquare className="h-4 w-4 text-accent cursor-default" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Interactive tool available</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-3 pb-4 flex-1 flex flex-col space-y-3">
          <div>
            <h3 className="text-base font-semibold text-primary mb-1">Simple Definition</h3>
            <div className="text-sm">
              <MarkdownRenderer content={term.content.simpleDefinition} />
            </div>
          </div>

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="example" className="border-b-0">
              <AccordionTrigger className="text-sm py-2 hover:no-underline">Example</AccordionTrigger>
              <AccordionContent className="text-sm pb-2">
                {term.content.example ? (
                  <MarkdownRenderer content={term.content.example} />
                ) : (
                  <>
                    {isStaticExport ? (
                      <div className="text-muted-foreground mt-2">
                        <span>AI example generation is disabled in static builds.</span>
                      </div>
                    ) : isLoadingExample ? (
                      <div className="flex items-center space-x-2 text-muted-foreground mt-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Generating example...</span>
                      </div>
                    ) : generatedExample ? (
                      <MarkdownRenderer content={generatedExample} />
                    ) : (
                      <Button onClick={handleGenerateExample} variant="outline" size="sm" className="mt-2">
                        <Wand2 className="mr-2 h-3 w-3" />
                        Generate Example with AI
                      </Button>
                    )}
                  </>
                )}
              </AccordionContent>
            </AccordionItem>

            {term.content.analogy && (
              <AccordionItem value="analogy" className="border-b-0">
                <AccordionTrigger className="text-sm py-2 hover:no-underline">Analogy</AccordionTrigger>
                <AccordionContent className="text-sm pb-2">
                  <MarkdownRenderer content={term.content.analogy} />
                </AccordionContent>
              </AccordionItem>
            )}

            {term.content.elaboration && (
              <AccordionItem value="elaboration" className="border-b-0">
                <AccordionTrigger className="text-sm py-2 hover:no-underline">Elaboration</AccordionTrigger>
                <AccordionContent className="text-sm pb-2">
                  <MarkdownRenderer content={term.content.elaboration} />
                </AccordionContent>
              </AccordionItem>
            )}

            {term.content.whyItMatters && (
              <AccordionItem value="why-it-matters" className="border-b-0">
                <AccordionTrigger className="text-sm py-2 hover:no-underline">Why it Matters</AccordionTrigger>
                <AccordionContent className="text-sm pb-2">
                  <MarkdownRenderer content={term.content.whyItMatters} />
                </AccordionContent>
              </AccordionItem>
            )}

            {term.interactiveTools && term.interactiveTools.length > 0 && (
              <AccordionItem value="interactive-tools" className="border-b-0">
                <AccordionTrigger className="text-sm py-2 hover:no-underline">Interactive Tools</AccordionTrigger>
                <AccordionContent className="text-sm pb-2">
                  <div className="space-y-2">
                    {term.interactiveTools.map(tool => (
                       <Button 
                        key={tool.url}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTool(tool)}
                        className="w-full justify-start text-xs"
                      >
                        <PlaySquare className="mr-2 h-3 w-3" />
                        Launch: {tool.name}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </CardContent>
      </Card>
      
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
