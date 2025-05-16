import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Impedir que o Chrome mostre automaticamente o prompt de instalação
      e.preventDefault();
      // Armazenar o evento para que possa ser acionado mais tarde
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Atualizar o estado da UI para mostrar o botão de instalação
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Mostrar o prompt de instalação
    deferredPrompt.prompt();

    // Aguardar pela escolha do usuário
    const { outcome } = await deferredPrompt.userChoice;
    
    // Limpar o prompt armazenado, pois ele não pode ser usado novamente
    setDeferredPrompt(null);
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
      console.log('Usuário aceitou a instalação do PWA');
    } else {
      console.log('Usuário recusou a instalação do PWA');
    }
  };

  if (!isInstallable) return null;

  return (
    <Button 
      onClick={handleInstallClick} 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-2 bg-cps-wine text-white hover:bg-cps-wine/90 hover:text-white"
    >
      <Download size={16} />
      Instalar App
    </Button>
  );
}
