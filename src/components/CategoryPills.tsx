'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface CategoryPillsProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  termCounts: Record<string, number>;
  className?: string;
}

export default function CategoryPills({
  categories,
  selectedCategory,
  onCategoryChange,
  termCounts,
  className
}: CategoryPillsProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col gap-2 w-full">
        {/* All Categories Pill */}
        <button
          onClick={() => onCategoryChange(null)}
          className={cn(
            "flex items-center justify-between w-full px-4 py-3 rounded-xl",
            "text-sm font-medium",
            "transition-all duration-200 ease-out",
            "hover:scale-[1.01] active:scale-[0.99]",
            selectedCategory === null
              ? "bg-purple-100 text-purple-800 shadow-sm border border-purple-200"
              : "text-gray-600 hover:text-purple-700 hover:bg-purple-50 border border-transparent"
          )}
        >
          <span>All Categories</span>
          <span
            className={cn(
              "inline-flex items-center justify-center",
              "min-w-[1.5rem] h-6 px-2 rounded-full text-xs font-semibold",
              selectedCategory === null
                ? "bg-purple-200 text-purple-800"
                : "bg-gray-100 text-gray-600"
            )}
          >
            {Object.values(termCounts).reduce((a, b) => a + b, 0)}
          </span>
        </button>

        {/* Category Pills */}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "flex items-center justify-between w-full px-4 py-3 rounded-xl",
              "text-sm font-medium",
              "transition-all duration-200 ease-out",
              "hover:scale-[1.01] active:scale-[0.99]",
              selectedCategory === category
                ? "bg-purple-100 text-purple-800 shadow-sm border border-purple-200"
                : "text-gray-600 hover:text-purple-700 hover:bg-purple-50 border border-transparent"
            )}
          >
            <span>{category}</span>
            <span
              className={cn(
                "inline-flex items-center justify-center",
                "min-w-[1.5rem] h-6 px-2 rounded-full text-xs font-semibold",
                selectedCategory === category
                  ? "bg-purple-200 text-purple-800"
                  : "bg-gray-100 text-gray-600"
              )}
            >
              {termCounts[category] || 0}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
} 