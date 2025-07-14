import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SubscribeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubscribeDialog({ isOpen, onOpenChange }: SubscribeDialogProps) {
  const hubspotScriptId = 'hubspot-subscribe-form-script';
  const HUBSPOT_FORM_CONTAINER_ID = 'hubspot-modal-form';
  const createdRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    const loadAndCreateForm = () => {
      // @ts-ignore
      const hbspt = (window as any).hbspt;
      if (hbspt && !createdRef.current) {
        hbspt.forms.create({
          region: 'na2',
          portalId: '242480293',
          formId: 'c218420e-b1ff-4019-89c4-46dbb92f1317',
          target: `#${HUBSPOT_FORM_CONTAINER_ID}`,
        });
        createdRef.current = true;
      }
    };

    if (!document.getElementById(hubspotScriptId)) {
      const script = document.createElement('script');
      script.src = 'https://js-na2.hsforms.net/forms/v2.js';
      script.defer = true;
      script.id = hubspotScriptId;
      script.onload = loadAndCreateForm;
      document.body.appendChild(script);
    } else {
      loadAndCreateForm();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] sm:max-w-[560px] max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-headline text-primary">Sign up for our newsletter</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Get occasional insights and updates on Generative AI straight to your inbox.
        </p>
        <div id={HUBSPOT_FORM_CONTAINER_ID} className="modal-subscribe-form"></div>
      </DialogContent>
    </Dialog>
  );
} 