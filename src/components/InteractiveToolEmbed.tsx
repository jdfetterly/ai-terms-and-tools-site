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
          Interacting with this tool will take you to an external website: <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-accent-foreground hover:underline">{tool.url}</a>
        </p>
      </CardContent>
    </Card>
  );
}
