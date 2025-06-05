
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { requestNewTermAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { RequestNewTermInput } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

const requestTermSchema = z.object({
  termName: z.string().min(1, { message: 'Term name is required.' }),
  simpleDefinition: z.string().optional(),
  elaboration: z.string().optional(),
  whyItMatters: z.string().optional(),
  interactiveToolName: z.string().optional(),
  interactiveToolUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  interactiveToolDescription: z.string().optional(),
});

interface RequestTermDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function RequestTermDialog({ isOpen, onOpenChange }: RequestTermDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<RequestNewTermInput>({
    resolver: zodResolver(requestTermSchema),
    defaultValues: {
      termName: '',
      simpleDefinition: '',
      elaboration: '',
      whyItMatters: '',
      interactiveToolName: '',
      interactiveToolUrl: '',
      interactiveToolDescription: '',
    },
  });

  const onSubmit = async (data: RequestNewTermInput) => {
    setIsSubmitting(true);
    try {
      const result = await requestNewTermAction(data);
      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
        form.reset();
        onOpenChange(false);
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Request a New Term</DialogTitle>
          <DialogDescription>
            Help expand the AI Lexicon! Fill in the details for the term you&apos;d like to see added.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden space-y-4">
            <ScrollArea className="flex-1 pr-2">
              <div className="space-y-6 py-4 pr-4">
                <FormField
                  control={form.control}
                  name="termName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Term Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Zero-shot Learning" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="simpleDefinition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Simple Definition</FormLabel>
                      <FormControl>
                        <Textarea placeholder="A concise explanation of the term." {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="elaboration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Elaboration</FormLabel>
                      <FormControl>
                        <Textarea placeholder="More detailed explanation, nuances, or context." {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="whyItMatters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why it Matters</FormLabel>
                      <FormControl>
                        <Textarea placeholder="The significance or impact of this term." {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2 pt-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Interactive Tool (Optional)</h3>
                  <FormField
                    control={form.control}
                    name="interactiveToolName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tool Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Awesome Tool Visualizer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="interactiveToolUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link to Interactive Tool</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/tool" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="interactiveToolDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tool Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="A brief description of the interactive tool." {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="pt-4 border-t mt-auto">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
