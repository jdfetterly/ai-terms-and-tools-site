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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Term } from '@/lib/types';

type ViewMode = 'all' | 'interactive' | 'guides';

export default function AIPediaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
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

    // Apply view mode filter
    if (viewMode === 'interactive') {
      displayTerms = displayTerms.filter(term => 
        term.interactiveTools && 
        term.interactiveTools.length > 0 &&
        term.interactiveTools.some(tool => tool.type === 'interactive' || tool.type === 'external')
      );
    } else if (viewMode === 'guides') {
      displayTerms = displayTerms.filter(term => 
        term.interactiveTools && 
        term.interactiveTools.length > 0 &&
        term.interactiveTools.some(tool => tool.type === 'guide')
      );
    }

    // Apply category filter
    if (selectedCategory) {
      displayTerms = displayTerms.filter(term => term.category === selectedCategory);
    }

    // Apply search filter
    if (searchTerm) {
      displayTerms = displayTerms.filter(term =>
        term.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.content.simpleDefinition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (term.content.elaboration && term.content.elaboration.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    displayTerms.sort((a, b) => a.name.localeCompare(b.name));
    
    return displayTerms;
  }, [searchTerm, selectedCategory, viewMode]);

  const currentViewTitle = viewMode === 'interactive' 
    ? 'Interactive Tools' 
    : viewMode === 'guides'
    ? 'Guides'
    : selectedCategory 
    ? selectedCategory 
    : 'All Terms (A-Z)';

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setSelectedCategory(null); // Clear category when changing view mode
  };

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarContent className="p-0">
          {/* Info Boxes in Sidebar */}
          <SidebarGroup className="p-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-card rounded-lg shadow-sm border">
                <Sparkles className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-card-foreground mb-1">Your Guide to GenAI</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    A plain-English guide for navigating Generative AI. Learn to speak the language of Artificial Intelligence.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-card rounded-lg shadow-sm border">
                <Puzzle className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-card-foreground mb-1">Explore & Understand</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    For some of the terms below, I've either built or found interactive tools to help you grasp the concepts.
                  </p>
                </div>
              </div>
            </div>
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
              <span>Designed & (mostly) Vibe Coded with</span>
              <Heart className="h-2.5 w-2.5" />
            </p>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <div ref={staticHeaderRef} className="sticky top-0 z-30 bg-background px-6 py-4 lg:px-8 lg:py-6 border-b">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-headline mb-1 lg:mb-2 text-primary">
              Generative AI Explained
            </h1>
            <p className="text-base lg:text-lg text-foreground/90">
              Plain-English Explanations + Interactive Tools for Generative AI Terms
            </p>
          </div>
        </div>

        <header
          className="sticky z-20 flex h-auto min-h-14 lg:min-h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 lg:px-8 py-3"
          style={{ top: staticHeaderHeight ? `${staticHeaderHeight}px` : '0px' }}
        >
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
              <SidebarTrigger className="lg:hidden self-start" />
              
              {/* Search Bar */}
              <div className="relative lg:w-1/4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search terms..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Categories Dropdown */}
              <div className="lg:w-1/4">
                <Select value={selectedCategory || "all"} onValueChange={(value) => {
                  setSelectedCategory(value === "all" ? null : value);
                  setViewMode('all');
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {predefinedCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Browse Toggle Buttons */}
              <div className="flex flex-wrap lg:flex-nowrap gap-2">
                <Button
                  variant={viewMode === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewModeChange('all')}
                  className="flex items-center gap-2"
                >
                  <ListChecks className="h-4 w-4" />
                  <span className="hidden sm:inline">All Terms</span>
                  <span className="sm:hidden">All</span>
                </Button>
                <Button
                  variant={viewMode === 'interactive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewModeChange('interactive')}
                  className="flex items-center gap-2"
                >
                  <PlaySquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Interactive Tools</span>
                  <span className="sm:hidden">Interactive</span>
                </Button>
                <Button
                  variant={viewMode === 'guides' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewModeChange('guides')}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Guides</span>
                  <span className="sm:hidden">Guides</span>
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        <ScrollArea className="flex-1">
          <div className="p-6 max-w-7xl mx-auto">
            {filteredTerms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
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
