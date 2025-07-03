'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SegmentedControl({
  options,
  value,
  onChange,
  className
}: SegmentedControlProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative flex flex-col w-full",
        "bg-gray-50 border border-gray-200",
        "rounded-2xl p-1 space-y-1",
        "shadow-sm",
        className
      )}
    >
      {/* Options */}
      {options.map((option, index) => (
        <button
          key={option.value}
          ref={(el) => {
            optionRefs.current[index] = el;
          }}
          onClick={() => onChange(option.value)}
          className={cn(
            "relative z-20 flex items-center justify-between w-full",
            "px-4 py-3 rounded-xl",
            "text-sm font-medium transition-all duration-200 ease-out",
            "hover:scale-[1.01] active:scale-[0.99]",
            "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50",
            value === option.value
              ? "bg-purple-100 text-purple-800 shadow-sm border border-purple-200"
              : "text-gray-600 hover:text-purple-700 hover:bg-purple-50 border border-transparent"
          )}
        >
          <div className="flex items-center gap-3">
            {option.icon && (
              <span className="flex-shrink-0">
                {option.icon}
              </span>
            )}
            <span>{option.label}</span>
          </div>
          {option.count !== undefined && (
            <span
              className={cn(
                "inline-flex items-center justify-center",
                "min-w-[1.5rem] h-6 px-2 rounded-full text-xs font-semibold",
                value === option.value
                  ? "bg-purple-200 text-purple-800"
                  : "bg-gray-100 text-gray-600"
              )}
            >
              {option.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
} 