
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RequestTermDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function RequestTermDialog({ isOpen, onOpenChange }: RequestTermDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termName, setTermName] = useState('');
  const [simpleDefinition, setSimpleDefinition] = useState('');
  const [elaboration, setElaboration] = useState('');
  const [whyItMatters, setWhyItMatters] = useState('');
  const [interactiveToolName, setInteractiveToolName] = useState('');
  const [interactiveToolUrl, setInteractiveToolUrl] = useState('');
  const [interactiveToolDescription, setInteractiveToolDescription] = useState('');

  const { toast } = useToast();

  const resetForm = () => {
    setTermName('');
    setSimpleDefinition('');
    setElaboration('');
    setWhyItMatters('');
    setInteractiveToolName('');
    setInteractiveToolUrl('');
    setInteractiveToolDescription('');
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  }

  const handleFormSubmit = () => {
    if (!termName.trim()) {
      toast({
        title: 'Error',
        description: 'Term name is required.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // IMPORTANT: Replace with your email address
    const recipientEmail = 'jd@chatbotlabs.io';

    const subject = `New AI Term Request: ${termName}`;
    const body = `
A new term has been requested for the AI Lexicon.

Term Name:
${termName}

Simple Definition:
${simpleDefinition || '(not provided)'}

Elaboration:
${elaboration || '(not provided)'}

Why it Matters:
${whyItMatters || '(not provided)'}

---
Interactive Tool Details (Optional)
---

Tool Name: ${interactiveToolName || '(not provided)'}
Tool URL: ${interactiveToolUrl || '(not provided)'}
Tool Description: ${interactiveToolDescription || '(not provided)'}
    `;

    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Give a moment for the UI to update before opening the mail client
    setTimeout(() => {
        window.location.href = mailtoLink;
        setIsSubmitting(false);
        handleOpenChange(false);
        toast({
          title: 'Success!',
          description: 'Your email client has been opened to send the request.',
        });
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Request a New Term</DialogTitle>
          <DialogDescription>
            Help expand the AI Lexicon! Fill in the details below. This will open your default email client to send the request.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 relative">
          <ScrollArea className="absolute inset-0">
            <div className="space-y-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="termName">Term Name <span className="text-destructive">*</span></Label>
                <Input id="termName" placeholder="e.g., Zero-shot Learning" value={termName} onChange={(e) => setTermName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="simpleDefinition">Simple Definition</Label>
                <Textarea id="simpleDefinition" placeholder="A concise explanation of the term." value={simpleDefinition} onChange={(e) => setSimpleDefinition(e.target.value)} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="elaboration">Elaboration</Label>
                <Textarea id="elaboration" placeholder="More detailed explanation, nuances, or context." value={elaboration} onChange={(e) => setElaboration(e.target.value)} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whyItMatters">Why it Matters</Label>
                <Textarea id="whyItMatters" placeholder="The significance or impact of this term." value={whyItMatters} onChange={(e) => setWhyItMatters(e.target.value)} rows={3} />
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-medium text-muted-foreground">Interactive Tool (Optional)</h3>
                <div className="space-y-2">
                  <Label htmlFor="interactiveToolName">Tool Name</Label>
                  <Input id="interactiveToolName" placeholder="e.g., Awesome Tool Visualizer" value={interactiveToolName} onChange={(e) => setInteractiveToolName(e.target.value)} />
                </div>
                <div className="space-y-2">
                   <Label htmlFor="interactiveToolUrl">Link to Interactive Tool</Label>
                   <Input id="interactiveToolUrl" placeholder="https://example.com/tool" value={interactiveToolUrl} onChange={(e) => setInteractiveToolUrl(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interactiveToolDescription">Tool Description</Label>
                  <Textarea id="interactiveToolDescription" placeholder="A brief description of the interactive tool." value={interactiveToolDescription} onChange={(e) => setInteractiveToolDescription(e.target.value)} rows={3} />
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="border-t pt-4">
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="button" onClick={handleFormSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
