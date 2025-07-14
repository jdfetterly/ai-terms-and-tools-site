import type { InteractiveTool } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface InteractiveToolEmbedProps {
  tool: InteractiveTool;
}

export default function InteractiveToolEmbed({ tool }: InteractiveToolEmbedProps) {
  return (
    <Card className="mt-4 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">{tool.name}</CardTitle>
        {tool.description && <CardDescription>{tool.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <iframe
          src={tool.url}
          title={tool.name}
          className="w-full h-96 border-0 rounded-md shadow-inner"
          allowFullScreen
          loading="lazy"
        ></iframe>
        <p className="text-xs text-muted-foreground mt-2">
          <a 
            href={tool.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:underline font-medium"
            onClick={() => {
              // Track tool launch in new tab
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
            }}
          >
            Open {tool.name} in a new tab
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
