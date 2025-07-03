'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { terms as allTermsData, categories as predefinedCategories } from '@/data/terms';
import TermCard from '@/components/TermCard';
import RequestTermDialog from '@/components/RequestTermDialog';
import AppleSearchBar from '@/components/AppleSearchBar';
import SegmentedControl from '@/components/SegmentedControl';
import CategoryPills from '@/components/CategoryPills';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ListChecks, Search, Sparkles, Puzzle, Lightbulb, Heart, PlaySquare, Globe, Linkedin, PenSquare } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import type { Term } from '@/lib/types';

type ViewMode = 'all' | 'interactive' | 'categories';

export default function AIPediaPage() {
  console.log("AIPediaPage is rendering");
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
    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  // Calculate term counts by category
  const termCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    predefinedCategories.forEach(category => {
      counts[category] = allTermsData.filter(term => term.category === category).length;
    });
    return counts;
  }, []);

  // Generate search suggestions
  const searchSuggestions = useMemo(() => {
    const allTermNames = allTermsData.map(term => term.name);
    const categoryNames = predefinedCategories;
    return [...allTermNames, ...categoryNames];
  }, []);

  const filteredTerms = useMemo(() => {
    let displayTerms = [...allTermsData];

    // Filter by view mode
    if (viewMode === 'interactive') {
      displayTerms = displayTerms.filter(term => term.interactiveTools && term.interactiveTools.length > 0);
    } else if (viewMode === 'categories' && selectedCategory) {
      displayTerms = displayTerms.filter(term => term.category === selectedCategory);
    }

    // Filter by search term
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

  console.log("Rendering main content, filteredTerms:", filteredTerms);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode !== 'categories') {
      setSelectedCategory(null);
    }
  };

  const interactiveTermsCount = useMemo(() => 
    allTermsData.filter(term => term.interactiveTools && term.interactiveTools.length > 0).length
  , []);

  const segmentedControlOptions = [
    {
      value: 'all',
      label: 'All Terms',
      icon: <ListChecks className="h-4 w-4" />,
      count: allTermsData.length
    },
    {
      value: 'interactive',
      label: 'Interactive',
      icon: <PlaySquare className="h-4 w-4" />,
      count: interactiveTermsCount
    },
    {
      value: 'categories',
      label: 'Categories',
      icon: <Puzzle className="h-4 w-4" />
    }
  ];

  const currentViewTitle = viewMode === 'interactive' 
    ? 'Interactive Tools' 
    : viewMode === 'categories' && selectedCategory
    ? selectedCategory 
    : 'All Terms';

  return (
    <SidebarProvider defaultOpen>
      <div className="bg-white min-h-screen !bg-white flex flex-row w-full">
        <Sidebar className="border-r-0 !bg-white overflow-y-auto" style={{ flex: "0 0 auto" }}>
          <SidebarHeader className="p-6 items-center border-b border-border/50 !bg-white">
            <a 
              href="https://www.chatbotlabs.io/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-2xl font-orbitron font-semibold brand-purple hover:text-purple-700 transition-colors"
            >
              ChatBotLabs.io
            </a>
          </SidebarHeader>
          
          <SidebarContent 
            className="p-6 space-y-6 !bg-white overflow-y-auto flex-1"
            onWheel={(e) => {
              // Prevent scroll events from bubbling to parent when sidebar is being scrolled
              e.stopPropagation();
            }}
          >
            {/* Apple Search Bar */}
            <AppleSearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              suggestions={searchSuggestions}
              placeholder="Search AI terms..."
            />

            {/* Segmented Control */}
            <div className="w-full">
              <SegmentedControl
                options={segmentedControlOptions}
                value={viewMode}
                onChange={(value) => handleViewModeChange(value as ViewMode)}
              />
            </div>

            {/* Category Pills - nested under Categories when selected */}
            {viewMode === 'categories' && (
              <div className="w-full pl-4 border-l-2 border-gray-200">
                <CategoryPills
                  categories={predefinedCategories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  termCounts={termCounts}
                />
              </div>
            )}
          </SidebarContent>

          <SidebarFooter className="p-6 border-t border-border/50 space-y-4 !bg-white">
            <Button 
              variant="outline" 
              className="w-full rounded-2xl h-12 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 border-gray-200 hover:border-purple-300 hover:bg-purple-50" 
              onClick={() => setIsRequestDialogOpen(true)}
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              Request New Term
            </Button>
            
            <div className="space-y-3">
              <p className="text-xs text-gray-600 text-center flex items-center justify-center gap-1">
                <span>Designed & Vibe Coded with</span>
                <Heart className="h-3 w-3 text-red-500" />
                <span>by JD</span>
              </p>
              <div className="flex items-center justify-center gap-4 text-gray-600">
                <a href="https://x.com/realJDFetterly" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
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
                <a href="https://www.linkedin.com/in/jdfetterly/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn Profile</span>
                </a>
                <a href="https://the-context-window.ghost.io/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                  <PenSquare className="h-4 w-4" />
                  <span className="sr-only">Blog</span>
                </a>
                <a href="https://www.chatbotlabs.io/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">Consulting Website</span>
                </a>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-col bg-white flex-1">
          {/* Main Header */}
          <div ref={staticHeaderRef} className="sticky top-0 z-30 bg-white border-b border-gray-200 p-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
              AI Terms & Interactive Tools
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Your plain-English guide to understanding Generative AI
            </p>
          </div>

          {/* Secondary Header */}
          <header
            className="sticky z-20 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-8"
            style={{ top: staticHeaderHeight }}
          >
            <div className="flex items-center gap-4 flex-1">
              <h2 className="text-xl font-semibold text-gray-900">All Terms</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {filteredTerms.length} {filteredTerms.length === 1 ? 'term' : 'terms'}
              </span>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-8 bg-gray-50">
            {/* Introduction Cards - only show when viewing All Terms */}
            {viewMode === 'all' && (
              <div className="grid gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Guide to GenAI</h3>
                      <p className="text-gray-600 leading-relaxed">
                        A plain-English guide for navigating Generative AI. Learn to speak the language of
                        Artificial Intelligence with clear definitions and real-world examples.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Explore & Understand</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Interactive tools and visual examples help you grasp complex AI concepts.
                        Experience the technology firsthand through carefully curated demonstrations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Terms Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTerms.map((term) => (
                <TermCard key={term.id} term={term} />
              ))}
            </div>
          </main>
        </SidebarInset>
        <RequestTermDialog isOpen={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen} />
      </div>
    </SidebarProvider>
  );
}
