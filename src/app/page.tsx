'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { terms as allTermsData, categories as predefinedCategories } from '@/data/terms';
import TermCard from '@/components/TermCard';
import RequestTermDialog from '@/components/RequestTermDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ListChecks, Search, Sparkles, Puzzle, Lightbulb, Heart, PlaySquare, Globe, Linkedin, PenSquare, BookOpen, Bot } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar';
import type { Term } from '@/lib/types';

export default function AIPediaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showInteractiveOnly, setShowInteractiveOnly] = useState(false);
  const [staticHeaderHeight, setStaticHeaderHeight] = useState(0);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

  const staticHeaderRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateHeight = () => {
      if (staticHeaderRef.current) {
        setStaticHeaderHeight(staticHeaderRef.current.offsetHeight);
      }
    };
    calculateHeight(); // Initial calculation
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  const filteredTerms = useMemo(() => {
    let displayTerms = [...allTermsData];

    if (showInteractiveOnly) {
      displayTerms = displayTerms.filter(term => term.interactiveTools && term.interactiveTools.length > 0);
    } else if (selectedCategory) {
      displayTerms = displayTerms.filter(term => term.category === selectedCategory);
    }

    if (searchTerm) {
      displayTerms = displayTerms.filter(term =>
        term.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.content.simpleDefinition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (term.content.elaboration && term.content.elaboration.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    displayTerms.sort((a, b) => a.name.localeCompare(b.name));
    
    return displayTerms;
  }, [searchTerm, selectedCategory, showInteractiveOnly]);

  const currentViewTitle = showInteractiveOnly 
    ? 'Interactive Tools' 
    : selectedCategory 
    ? selectedCategory 
    : 'All Terms (A-Z)';


  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4 items-center">
            <a href="https://www.chatbotlabs.io/" target="_blank" rel="noopener noreferrer" className="text-2xl font-orbitron font-semibold text-primary hover:text-primary/90 transition-colors">
              ChatBotLabs.io
            </a>
        </SidebarHeader>
        <Separator />
        <SidebarContent className="p-0">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search terms..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <SidebarGroup className="p-2">
            <SidebarGroupLabel>Browse</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    setSelectedCategory(null);
                    setShowInteractiveOnly(false);
                  }}
                  isActive={selectedCategory === null && !showInteractiveOnly}
                  tooltip="View all terms alphabetically"
                  className="w-full"
                >
                  <ListChecks />
                  All Terms (A-Z)
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    setSelectedCategory(null);
                    setShowInteractiveOnly(true);
                  }}
                  isActive={showInteractiveOnly}
                  tooltip="View terms with interactive tools"
                  className="w-full"
                >
                  <PlaySquare />
                  Interactive Tools
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup className="p-2">
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
            <SidebarMenu>
              {predefinedCategories.map((category) => (
                <SidebarMenuItem key={category}>
                  <SidebarMenuButton
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowInteractiveOnly(false);
                    }}
                    isActive={selectedCategory === category}
                    tooltip={`View terms in ${category}`}
                    className="w-full"
                  >
                    {category}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t space-y-4">
          <div className="flex flex-col space-y-2">
            <Button variant="outline" size="sm" className="w-full border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => setIsRequestDialogOpen(true)}>
              Request New Term
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-4 text-muted-foreground">
              <a href="https://x.com/realJDFetterly" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" title="X Profile">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 1200 1227"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6904H306.615L611.412 515.685L658.88 583.579L1076.55 1160.31H913.946L569.165 687.854V687.828Z" />
                </svg>
                <span className="sr-only">X Profile</span>
              </a>
              <a href="https://www.linkedin.com/in/jdfetterly/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" title="LinkedIn Profile">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn Profile</span>
              </a>
              <a href="https://the-context-window.ghost.io/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" title="The Context Window">
                <BookOpen className="h-4 w-4" />
                <span className="sr-only">The Context Window</span>
              </a>
              <a href="https://www.chatbotlabs.io/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" title="ChatBot Labs">
                <Bot className="h-4 w-4" />
                <span className="sr-only">ChatBot Labs</span>
              </a>
            </div>
            <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center space-x-1">
              <span>Designed & Vibe Coded with</span>
              <Heart className="h-2.5 w-2.5" />
            </p>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <div ref={staticHeaderRef} className="sticky top-0 z-30 bg-background p-6 border-b">
          <h1 className="text-3xl lg:text-4xl font-bold font-headline mb-2 text-primary">
            Generative AI Explained
          </h1>
          <p className="text-lg text-foreground/90">
            Plain-English Explanations + Interactive Tools for Generative AI Terms
          </p>
        </div>

        <header
          className="sticky z-20 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6"
          style={{ top: staticHeaderHeight ? `${staticHeaderHeight}px` : '0px' }}
        >
          <SidebarTrigger className="md:hidden" />
          <h2 className="text-xl font-semibold font-headline">
            {currentViewTitle}
          </h2>
        </header>
        
        <ScrollArea className="flex-1">
          <div className="p-6">
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 bg-card rounded-lg shadow">
                <Sparkles className="h-8 w-8 text-accent shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-card-foreground mb-1">Your Guide to GenAI</h3>
                  <p className="text-sm text-muted-foreground">
                    A plain-English guide for navigating Generative AI. Learn to speak the language of Artificial Intelligence.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card rounded-lg shadow">
                <Puzzle className="h-8 w-8 text-accent shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-card-foreground mb-1">Explore & Understand</h3>
                  <p className="text-sm text-muted-foreground">
                    For some of the terms below, I’ve either built or found interactive tools to help you grasp the concepts.
                  </p>
                </div>
              </div>
            </div>

            {filteredTerms.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
                {filteredTerms.map(term => (
                  <TermCard key={term.id} term={term} />
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-10">
                <Search className="mx-auto h-12 w-12 mb-4" />
                <p className="text-lg">No terms found.</p>
                <p>Try adjusting your search or category selection.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SidebarInset>
      <RequestTermDialog isOpen={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen} />
    </SidebarProvider>
  );
}
