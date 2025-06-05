'use client';

import type { Term } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MarkdownRenderer from './MarkdownRenderer';
import InteractiveToolEmbed from './InteractiveToolEmbed';
import { generateExampleAction } from '@/app/actions';
import React, { useState } from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TermCardProps {
  term: Term;
}

export default function TermCard({ term }: TermCardProps) {
  const [generatedExample, setGeneratedExample] = useState<string | null>(null);
  const [isLoadingExample, setIsLoadingExample] = useState(false);
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

  const renderContentPart = (label: string, content?: string) => {
    if (!content) return null;
    return (
      <div className="mb-3">
        <h4 className="font-semibold text-md text-primary mb-1">{label}</h4>
        <MarkdownRenderer content={content} />
      </div>
    );
  };

  return (
    <Card id={term.id} className="mb-6 shadow-lg_ overflow-hidden">
      <CardHeader className="bg-card-foreground/5">
        <CardTitle className="text-2xl font-headline text-primary">{term.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{term.category}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {renderContentPart('Simple Definition', term.content.simpleDefinition)}
        {renderContentPart('Analogy', term.content.analogy)}
        
        {term.content.example ? (
          renderContentPart('Example', term.content.example)
        ) : (
          <div className="mb-3">
            <h4 className="font-semibold text-md text-primary mb-1">Example</h4>
            {isLoadingExample ? (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating example...</span>
              </div>
            ) : generatedExample ? (
              <MarkdownRenderer content={generatedExample} />
            ) : (
              <Button onClick={handleGenerateExample} variant="outline" size="sm">
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Example with AI
              </Button>
            )}
          </div>
        )}

        {renderContentPart('Elaboration', term.content.elaboration)}
        {renderContentPart('Why it Matters', term.content.whyItMatters)}

        {term.interactiveTools && term.interactiveTools.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3 text-primary">Interactive Tools</h3>
            {term.interactiveTools.map(tool => (
              <InteractiveToolEmbed key={tool.url} tool={tool} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
