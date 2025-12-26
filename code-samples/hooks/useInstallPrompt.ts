/**
 * useInstallPrompt Hook
 * 
 * Custom React hook for handling Progressive Web App (PWA) installation prompts.
 * Captures the browser's beforeinstallprompt event and provides a method to
 * trigger the installation dialog programmatically.
 * 
 * @example
 * ```tsx
 * function InstallButton() {
 *   const { isInstallable, promptToInstall } = useInstallPrompt();
 *   
 *   if (!isInstallable) return null;
 *   
 *   return (
 *     <button onClick={promptToInstall}>
 *       Install App
 *     </button>
 *   );
 * }
 * ```
 */

import { useState, useEffect } from 'react';

// Type definition for the BeforeInstallPromptEvent
// This is not yet standardized, so we define it ourselves
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const useInstallPrompt = () => {
  // Store the deferred prompt event
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  
  // Track whether installation is available
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  /**
   * Programmatically trigger the installation prompt.
   * Can only be called once - after the user responds, the prompt is consumed.
   */
  const promptToInstall = async () => {
    if (!deferredPrompt) {
      return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // Log the outcome for analytics (optional)
    console.log(`Install prompt outcome: ${outcome}`);
    
    // We've used the prompt and can't use it again, so clear it
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return { 
    /** Whether the app can be installed (prompt is available) */
    isInstallable, 
    
    /** Function to trigger the install prompt */
    promptToInstall 
  };
};
