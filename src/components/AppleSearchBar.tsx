'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppleSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  className?: string;
}

export default function AppleSearchBar({
  value,
  onChange,
  placeholder = "Search terms...",
  suggestions = [],
  className
}: AppleSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for selection
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(value.toLowerCase()) && suggestion !== value
  ).slice(0, 5);

  useEffect(() => {
    if (value && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [value, filteredSuggestions.length]);

  return (
    <div className={cn("relative", className)}>
      {/* Search Container */}
      <div
        className={cn(
          "relative group transition-all duration-200 ease-out",
          "bg-white/80 backdrop-blur-apple border border-gray-200/50",
          "rounded-3xl shadow-sm",
          isFocused && "bg-white shadow-md border-purple-300/60 scale-[1.02] ring-2 ring-purple-500/20"
        )}
      >
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <Search 
            className={cn(
              "h-5 w-5 transition-colors duration-200",
              isFocused ? "text-purple-600" : "text-gray-500"
            )} 
          />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "w-full h-12 pl-12 pr-12 bg-transparent border-0 outline-none",
            "text-gray-900 placeholder:text-gray-500",
            "text-[16px] leading-none", // Prevent zoom on iOS
            "font-medium tracking-tight"
          )}
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={handleClear}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 z-10",
              "p-1.5 rounded-full bg-gray-100 hover:bg-gray-200",
              "transition-all duration-200 ease-out",
              "group-hover:scale-105 active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            )}
          >
            <X className="h-3.5 w-3.5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 mt-2 z-50",
            "bg-white/95 backdrop-blur-apple border border-gray-200/50",
            "rounded-3xl shadow-lg",
            "animate-scale-in origin-top"
          )}
        >
          <div className="p-2">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-2xl",
                  "text-gray-900 hover:bg-purple-50 hover:text-purple-700",
                  "transition-colors duration-150 ease-out",
                  "text-sm font-medium",
                  "flex items-center gap-3",
                  "focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                )}
              >
                  <Search className="h-4 w-4 text-gray-500" />
                  <span>{suggestion}</span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
} 