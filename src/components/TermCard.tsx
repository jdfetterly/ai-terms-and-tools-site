
'use client';

import type { Term, InteractiveTool } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MarkdownRenderer from './MarkdownRenderer';
import InteractiveToolModal from './InteractiveToolModal';
import { generateExampleAction } from '@/app/actions';
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

interface TermCardProps {
  term: Term;
}

export default function TermCard({ term }: TermCardProps) {
  const [generatedExample, setGeneratedExample] = useState<string | null>(null);
  const [isLoadingExample, setIsLoadingExample] = useState(false);
  const [selectedTool, setSelectedTool] = useState<InteractiveTool | null>(null);
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

  return (
    <>
      <Card id={term.id} className="mb-6 shadow-lg_ overflow-hidden flex flex-col">
        <CardHeader className="bg-card-foreground/5">
          <CardTitle className="text-2xl font-headline text-primary">{term.name}</CardTitle>
          <div className="flex items-center justify-between mt-1">
            <CardDescription className="text-sm text-muted-foreground">{term.category}</CardDescription>
            {term.interactiveTools && term.interactiveTools.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <PlaySquare className="h-5 w-5 text-accent cursor-default" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Interactive tool available</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-4 flex-1 flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-primary mb-1">Simple Definition</h3>
            <MarkdownRenderer content={term.content.simpleDefinition} />
          </div>

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="example">
              <AccordionTrigger>Example</AccordionTrigger>
              <AccordionContent>
                {term.content.example ? (
                  <MarkdownRenderer content={term.content.example} />
                ) : (
                  <>
                    {isLoadingExample ? (
                      <div className="flex items-center space-x-2 text-muted-foreground mt-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Generating example...</span>
                      </div>
                    ) : generatedExample ? (
                      <MarkdownRenderer content={generatedExample} />
                    ) : (
                      <Button onClick={handleGenerateExample} variant="outline" size="sm" className="mt-2">
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Example with AI
                      </Button>
                    )}
                  </>
                )}
              </AccordionContent>
            </AccordionItem>

            {term.content.analogy && (
              <AccordionItem value="analogy">
                <AccordionTrigger>Analogy</AccordionTrigger>
                <AccordionContent>
                  <MarkdownRenderer content={term.content.analogy} />
                </AccordionContent>
              </AccordionItem>
            )}

            {term.content.elaboration && (
              <AccordionItem value="elaboration">
                <AccordionTrigger>Elaboration</AccordionTrigger>
                <AccordionContent>
                  <MarkdownRenderer content={term.content.elaboration} />
                </AccordionContent>
              </AccordionItem>
            )}

            {term.content.whyItMatters && (
              <AccordionItem value="why-it-matters">
                <AccordionTrigger>Why it Matters</AccordionTrigger>
                <AccordionContent>
                  <MarkdownRenderer content={term.content.whyItMatters} />
                </AccordionContent>
              </AccordionItem>
            )}

            {term.interactiveTools && term.interactiveTools.length > 0 && (
              <AccordionItem value="interactive-tools">
                <AccordionTrigger>Interactive Tools</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {term.interactiveTools.map(tool => (
                       <Button 
                        key={tool.url}
                        variant="outline"
                        onClick={() => setSelectedTool(tool)}
                        className="w-full justify-start"
                      >
                        <PlaySquare className="mr-2 h-4 w-4" />
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
