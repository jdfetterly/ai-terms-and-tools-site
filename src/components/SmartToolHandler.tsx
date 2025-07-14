'use client';

import type { InteractiveTool } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlaySquare, BookOpen, ExternalLink } from 'lucide-react';

interface SmartToolHandlerProps {
  tool: InteractiveTool;
  onOpenModal: (tool: InteractiveTool) => void;
  className?: string;
}

export default function SmartToolHandler({ tool, onOpenModal, className }: SmartToolHandlerProps) {

  const handleClick = () => {
    if (tool.type === 'interactive') {
      // Try to open in modal first
      onOpenModal(tool);
    } else {
      // Open guides and external links directly in new tab
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }

    // Track tool launch
    const payload = {
      tool_name: tool.name,
      button_type: tool.type,
      debug_mode: true
    };
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      console.log('[GA4] tool_launch_click', payload);
      window.gtag('event', 'tool_launch_click', payload);
    }
  };

  const getButtonContent = () => {
    switch (tool.type) {
      case 'interactive':
        return {
          icon: <PlaySquare className="h-3 w-3 flex-shrink-0" />,
          text: tool.name,
          prefix: 'Launch: ',
        };
      case 'guide':
        return {
          icon: <BookOpen className="h-3 w-3 flex-shrink-0" />,
          text: tool.name,
          prefix: 'Guide: ',
        };
      case 'external':
        return {
          icon: <ExternalLink className="h-3 w-3 flex-shrink-0" />,
          text: tool.name,
          prefix: 'Launch: ',
        };
      default:
        return {
          icon: <PlaySquare className="h-3 w-3 flex-shrink-0" />,
          text: tool.name,
          prefix: 'Launch: ',
        };
    }
  };

  const { icon, text, prefix } = getButtonContent();

  return (
    <Button 
      variant="outline"
      size="sm"
      onClick={handleClick}
      className={`w-full justify-start text-xs h-8 px-3 ${className || ''}`}
      title={`${prefix}${text}`}
    >
      <div className="flex items-center min-w-0 w-full">
        {icon}
        <span className="truncate ml-1">
          <span className="font-medium">{prefix}</span>
          {text}
        </span>
      </div>
    </Button>
  );
} 