
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import { toast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PwaInstallBanner() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      const promptEvent = e as BeforeInstallPromptEvent;
      setInstallPrompt(promptEvent);
      // Check if user has already dismissed it this session
      const dismissed = sessionStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    // Show the install prompt
    installPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;

    if (outcome === 'accepted') {
      toast({ title: t('pwa.install.success') });
    }
    
    setIsVisible(false);
    setInstallPrompt(null);
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pwa-install-dismissed', 'true');
    setIsVisible(false);
    toast({ description: t('pwa.install.dismissed') });
  };

  return (
    <AnimatePresence>
      {isVisible && installPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-[100] sm:left-auto sm:right-4 sm:max-w-sm"
        >
          <div className="bg-white rounded-3xl p-5 app-shadow border border-border/50 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Download size={20} />
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-black">
                  {t('pwa.install.title')}
                </h5>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1 font-medium">
                  {t('pwa.install.description')}
                </p>
              </div>
              <button onClick={handleDismiss} className="text-muted-foreground/40 hover:text-foreground">
                <X size={14} />
              </button>
            </div>
            <div className="flex gap-2">
                <Button
                    onClick={handleDismiss}
                    variant="outline"
                    className="w-full h-9 rounded-xl font-black text-[9px] tracking-widest"
                >
                    {t('pwa.install.cancel')}
                </Button>
                <Button 
                    onClick={handleInstall}
                    className="w-full h-9 rounded-xl gradient-bg text-white font-black uppercase text-[9px] tracking-widest border-0 shadow-lg shadow-primary/20"
                >
                    {t('pwa.install.button')}
                </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
