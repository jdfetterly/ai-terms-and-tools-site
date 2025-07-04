'use client';

import type { InteractiveTool } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { ExternalLink } from 'lucide-react';

interface InteractiveToolModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tool: InteractiveTool;
}

export default function InteractiveToolModal({
  isOpen,
  onOpenChange,
  tool,
}: InteractiveToolModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[1600px] h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-xl">{tool.name}</DialogTitle>
          {tool.description && (
            <DialogDescription>{tool.description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <iframe
            src={tool.url}
            title={tool.name}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
        <div className="p-4 border-t flex justify-end">
            <Button asChild variant="link">
                <a 
                  href={tool.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => {
                    // Track tool launch in new tab
                    const toolLabel = tool.name.toLowerCase().replace(/\s+/g, '-');
                    if (typeof window !== 'undefined' && (window as any).trackToolLaunch) {
                      (window as any).trackToolLaunch(`${toolLabel}-new-tab`);
                    }
                  }}
                >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open in new tab
                </a>
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
