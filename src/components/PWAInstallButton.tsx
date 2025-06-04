import { useEffect, useState } from 'react';

const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    const promptEvent = deferredPrompt as any;
    promptEvent.prompt();

    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      console.log('PWA installation accepted');
    } else {
      console.log('PWA installation dismissed');
    }

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
     <button
    onClick={handleInstallClick}
    className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700 transition"
  >
    Install Farmvizion
  </button>
  );
};

export default PWAInstallButton;
