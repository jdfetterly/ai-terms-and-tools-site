
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { terms as allTermsData, categories as predefinedCategories } from '@/data/terms';
import TermCard from '@/components/TermCard';
import RequestTermDialog from '@/components/RequestTermDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ListChecks, Search, Brain, Sparkles, Puzzle, Lightbulb } from 'lucide-react';
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
  const [sortBy, setSortBy] = useState<'category' | 'alphabetical'>('alphabetical'); // Default to A-Z
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

    if (selectedCategory) {
      displayTerms = displayTerms.filter(term => term.category === selectedCategory);
    }

    if (searchTerm) {
      displayTerms = displayTerms.filter(term =>
        term.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.content.simpleDefinition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (term.content.elaboration && term.content.elaboration.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (sortBy === 'alphabetical') {
      displayTerms.sort((a, b) => a.name.localeCompare(b.name));
    } else { // Sort by category, respecting predefined order (when a specific category is selected)
      // If selectedCategory is not null, we're already filtered, just sort by name
      // If selectedCategory is null AND sortBy is 'category' (this case is now less likely to be the primary view)
      // we sort by the predefined category order, then by name.
      if (selectedCategory) {
         displayTerms.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        displayTerms.sort((a, b) => {
          const categoryAIndex = predefinedCategories.indexOf(a.category);
          const categoryBIndex = predefinedCategories.indexOf(b.category);

          if (categoryAIndex !== categoryBIndex) {
            return categoryAIndex - categoryBIndex;
          }
          return a.name.localeCompare(b.name);
        });
      }
    }
    return displayTerms;
  }, [searchTerm, selectedCategory, sortBy]);

  const termsGroupedByCategory = useMemo(() => {
    // This grouping is only used if no specific category is selected AND sorting by category
    // Since default is A-Z, this will only be active if a future feature re-enables it,
    // or if a category is selected (but then filteredTerms is rendered directly).
    // For consistency, we'll keep the logic, but it's primarily for when a category is chosen now.
    if (sortBy !== 'category' || selectedCategory !== null) {
      return null;
    }
    const grouped: Record<string, Term[]> = {};
    predefinedCategories.forEach(category => {
      const termsInThisCategory = filteredTerms.filter(term => term.category === category);
      if (termsInThisCategory.length > 0) {
        grouped[category] = termsInThisCategory;
      }
    });
    return grouped;
  }, [filteredTerms, sortBy, selectedCategory, predefinedCategories]);


  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4 items-center">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-headline font-semibold">AI Lexicon</h1>
            </div>
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
                    setSortBy('alphabetical');
                  }}
                  isActive={selectedCategory === null && sortBy === 'alphabetical'}
                  tooltip="View all terms alphabetically"
                  className="w-full"
                >
                  <ListChecks />
                  All Terms (A-Z)
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
                      setSortBy('category'); // When a category is selected, we sort by category (implicitly, then by name)
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
        <SidebarFooter className="p-4 border-t space-y-2">
           <Button variant="outline" className="w-full" onClick={() => setIsRequestDialogOpen(true)}>
            <Lightbulb className="mr-2 h-4 w-4" />
            Request New Term
          </Button>
          <p className="text-xs text-muted-foreground text-center">© {new Date().getFullYear()} AI Lexicon</p>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <div ref={staticHeaderRef} className="sticky top-0 z-30 bg-background p-6 border-b">
          <h1 className="text-3xl lg:text-4xl font-bold font-headline mb-2 text-primary">
            The 2025 AI Glossary
          </h1>
          <p className="text-lg text-foreground/90">
            Key Terms and Concepts You Actually Need to Know
          </p>
        </div>

        <header
          className="sticky z-20 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6"
          style={{ top: staticHeaderHeight ? `${staticHeaderHeight}px` : '0px' }}
        >
          <SidebarTrigger className="md:hidden" />
          <h2 className="text-xl font-semibold font-headline">
            {selectedCategory ? selectedCategory : (sortBy === 'alphabetical' ? 'All Terms (A-Z)' : 'All Terms (by Category)')}
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

            {termsGroupedByCategory && selectedCategory === null && sortBy === 'category' ? ( // This condition for grouped view is now less likely to be primary
              Object.keys(termsGroupedByCategory).length > 0 ? (
                predefinedCategories.map(category => {
                  const termsInThisCategory = termsGroupedByCategory[category];
                  if (!termsInThisCategory || termsInThisCategory.length === 0) {
                    return null;
                  }
                  return (
                    <section key={category} className="mb-12">
                      <h3 className="text-2xl font-semibold font-headline text-primary mb-6 pb-2 border-b border-primary/30">
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {termsInThisCategory.map(term => (
                          <TermCard key={term.id} term={term} />
                        ))}
                      </div>
                    </section>
                  );
                })
              ) : (
                 <div className="text-center text-muted-foreground py-10">
                  <Search className="mx-auto h-12 w-12 mb-4" />
                  <p className="text-lg">No terms found.</p>
                  <p>Try adjusting your search or category selection.</p>
                </div>
              )
            ) : filteredTerms.length > 0 ? ( // This will be the default rendering path now
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

