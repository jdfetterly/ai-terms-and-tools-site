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
import { ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { useState, useEffect } from 'react';

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
  const [iframeError, setIframeError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset states when modal opens/closes or tool changes
  useEffect(() => {
    if (isOpen) {
      setIframeError(false);
      setIsLoading(true);
    }
  }, [isOpen, tool.url]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setIframeError(true);
  };

  const openInNewTab = () => {
    window.open(tool.url, '_blank', 'noopener,noreferrer');
    
    // Track tool launch in new tab
    const toolLabel = tool.name.toLowerCase().replace(/\s+/g, '-');
    if (typeof window !== 'undefined' && (window as any).trackToolLaunch) {
      (window as any).trackToolLaunch(`${toolLabel}-new-tab-fallback`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[1600px] h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-xl">{tool.name}</DialogTitle>
          {tool.description && (
            <DialogDescription>{tool.description}</DialogDescription>
          )}
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden relative">
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading {tool.name}...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {iframeError ? (
            <div className="p-6 flex flex-col items-center justify-center h-full space-y-4">
              <Alert className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This tool cannot be displayed in an embedded frame due to security restrictions. 
                  Please open it in a new tab to use it.
                </AlertDescription>
              </Alert>
              
              <Button onClick={openInNewTab} className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Open {tool.name} in New Tab
              </Button>
            </div>
          ) : (
            /* Iframe */
            <iframe
              src={tool.url}
              title={tool.name}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              // Add sandbox for security (can be customized per tool if needed)
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          )}
        </div>
        
        <div className="p-4 border-t flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {tool.type === 'interactive' ? 'Interactive Tool' : 'External Resource'}
          </div>
          <Button asChild variant="outline" size="sm">
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
