'use client';

import type { Term, InteractiveTool } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MarkdownRenderer from './MarkdownRenderer';
import InteractiveToolModal from './InteractiveToolModal';
import SmartToolHandler from './SmartToolHandler';
import React, { useState } from 'react';
import { PlaySquare, BookOpen, ExternalLink } from 'lucide-react';
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

export default function TermCard({ term }: TermCardProps) {
  const [selectedTool, setSelectedTool] = useState<InteractiveTool | null>(null);
  const { toast } = useToast();

  const handleCardClick = () => {
    // Convert term name to lowercase hyphen-separated format for GA4
    const termLabel = term.name.toLowerCase().replace(/\s+/g, '-');
    
    // Call GA4 tracking function (declared globally in layout.tsx)
    if (typeof window !== 'undefined' && (window as any).trackViewTerm) {
      (window as any).trackViewTerm(termLabel);
    }
  };

  const handleOpenModal = (tool: InteractiveTool) => {
    setSelectedTool(tool);
  };

  // Determine what icon to show based on available tools
  const getCardIcon = () => {
    if (!term.interactiveTools || term.interactiveTools.length === 0) {
      return null;
    }

    const hasInteractiveOrExternal = term.interactiveTools.some(tool => 
      tool.type === 'interactive' || tool.type === 'external'
    );
    const hasGuides = term.interactiveTools.some(tool => tool.type === 'guide');

    // Show PlaySquare for any interactive tools (iframe or external)
    if (hasInteractiveOrExternal) {
      return <PlaySquare className="h-4 w-4 text-accent cursor-default" />;
    } else if (hasGuides) {
      return <BookOpen className="h-4 w-4 text-accent cursor-default" />;
    }
    
    return null;
  };

  const getTooltipText = () => {
    if (!term.interactiveTools || term.interactiveTools.length === 0) {
      return '';
    }

    const types = [];
    if (term.interactiveTools.some(tool => tool.type === 'interactive' || tool.type === 'external')) {
      types.push('interactive tools');
    }
    if (term.interactiveTools.some(tool => tool.type === 'guide')) {
      types.push('guides');
    }

    return `${types.join(', ')} available`;
  };

  return (
    <>
      <Card 
        id={term.id} 
        className="mb-4 shadow-sm border flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer h-full"
        onClick={handleCardClick}
      >
        <CardHeader className="bg-card-foreground/5 pb-3 flex-shrink-0">
          <CardTitle className="text-xl font-headline text-primary min-h-[3.5rem] flex items-start leading-tight">{term.name}</CardTitle>
          <div className="flex items-center justify-between mt-1">
            <Badge variant="default" className="text-xs">{term.category}</Badge>
            {getCardIcon() && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>{getCardIcon()}</div>
                </TooltipTrigger>
                <TooltipContent side="left" align="center" sideOffset={8}>
                  <p>{getTooltipText()}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col">
          {/* Simple Definition - Top Aligned */}
          <div className="px-4 pt-3 pb-4 flex-shrink-0">
            <h3 className="text-base font-semibold text-primary mb-2">Simple Definition</h3>
            <div className="text-sm">
              <MarkdownRenderer content={term.content.simpleDefinition} />
            </div>
          </div>

          {/* Spacer to push accordion to bottom */}
          <div className="flex-1"></div>

          {/* Accordion Menu - Bottom Aligned */}
          <div className="flex-shrink-0">
            <Accordion type="single" collapsible className="w-full">
              {term.content.analogy && (
                <AccordionItem value="analogy" className="border-b-0">
                  <AccordionTrigger className="text-sm py-2 px-4 hover:no-underline">Analogy</AccordionTrigger>
                  <AccordionContent className="text-sm px-4 pb-3">
                    <MarkdownRenderer content={term.content.analogy} />
                  </AccordionContent>
                </AccordionItem>
              )}

              {term.content.example && (
                <AccordionItem value="example" className="border-b-0">
                  <AccordionTrigger className="text-sm py-2 px-4 hover:no-underline">Example</AccordionTrigger>
                  <AccordionContent className="text-sm px-4 pb-3">
                    <MarkdownRenderer content={term.content.example} />
                  </AccordionContent>
                </AccordionItem>
              )}

              {term.content.elaboration && (
                <AccordionItem value="elaboration" className="border-b-0">
                  <AccordionTrigger className="text-sm py-2 px-4 hover:no-underline">Detailed Definition</AccordionTrigger>
                  <AccordionContent className="text-sm px-4 pb-3">
                    <MarkdownRenderer content={term.content.elaboration} />
                  </AccordionContent>
                </AccordionItem>
              )}

              {term.content.whyItMatters && (
                <AccordionItem value="why-it-matters" className="border-b-0">
                  <AccordionTrigger className="text-sm py-2 px-4 hover:no-underline">Why it Matters</AccordionTrigger>
                  <AccordionContent className="text-sm px-4 pb-3">
                    <MarkdownRenderer content={term.content.whyItMatters} />
                  </AccordionContent>
                </AccordionItem>
              )}

              {term.interactiveTools && term.interactiveTools.length > 0 && (
                <AccordionItem value="interactive-tools" className="border-b-0">
                  <AccordionTrigger className="text-sm py-2 px-4 hover:no-underline">Interactive Tools</AccordionTrigger>
                  <AccordionContent className="text-sm px-4 pb-4">
                    <div className="space-y-2">
                      {term.interactiveTools.map(tool => (
                        <SmartToolHandler
                          key={tool.url}
                          tool={tool}
                          onOpenModal={handleOpenModal}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
            
            {/* Ensure consistent bottom padding for all cards */}
            <div className="pb-4"></div>
          </div>
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
