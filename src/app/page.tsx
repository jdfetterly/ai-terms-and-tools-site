
'use client';

import React, { useState, useMemo } from 'react';
import { terms, categories } from '@/data/terms';
import TermCard from '@/components/TermCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { LayoutDashboard, ListChecks, Search, Brain } from 'lucide-react';
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
import Link from 'next/link';

export default function AIPediaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'category' | 'alphabetical'>('category');

  const filteredTerms = useMemo(() => {
    let displayTerms = terms;

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
    } else { // Default to category sort, then alphabetical within category
      displayTerms.sort((a, b) => {
        if (a.category.localeCompare(b.category) !== 0) {
          return a.category.localeCompare(b.category);
        }
        return a.name.localeCompare(b.name);
      });
    }

    return displayTerms;
  }, [searchTerm, selectedCategory, sortBy]);

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
                    setSortBy('category');
                  }}
                  isActive={selectedCategory === null && sortBy === 'category'}
                  tooltip="View all terms by category"
                  className="w-full"
                >
                  <LayoutDashboard />
                  All Terms (by Category)
                </SidebarMenuButton>
              </SidebarMenuItem>
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
              {categories.map((category) => (
                <SidebarMenuItem key={category}>
                  <SidebarMenuButton
                    onClick={() => setSelectedCategory(category)}
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
        <SidebarFooter className="p-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AI Lexicon</p>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6">
          <SidebarTrigger className="md:hidden" />
          <h2 className="text-xl font-semibold font-headline">
            {selectedCategory ? selectedCategory : (sortBy === 'alphabetical' ? 'All Terms (A-Z)' : 'All Terms')}
          </h2>
        </header>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTerms.length > 0 ? (
              filteredTerms.map(term => (
                <TermCard key={term.id} term={term} />
              ))
            ) : (
              <div className="text-center text-muted-foreground py-10 md:col-span-2">
                <Search className="mx-auto h-12 w-12 mb-4" />
                <p className="text-lg">No terms found.</p>
                <p>Try adjusting your search or category selection.</p>
              </div>
            )}
          </main>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
