import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Forçar a exibição do botão na página /admin em dispositivos móveis
  const shouldShowInstallButton = isAdminPage && isMobile;

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

  // Efeito para Safari no iOS
  useEffect(() => {
    // Verificar se é Safari no iOS
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    if (isIOS && isSafari && isAdminPage) {
      // No Safari iOS, não temos o evento beforeinstallprompt
      // Então vamos mostrar o botão de instalação de qualquer forma
      setIsInstallable(true);
    }
  }, [isAdminPage]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Para navegadores que suportam o evento beforeinstallprompt (Chrome, Edge, etc.)
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
    } else if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      // Para Safari no iOS, mostrar instruções de instalação
      alert('Para instalar o aplicativo no iOS:\n\n1. Toque no ícone de compartilhamento (quadrado com seta para cima)\n2. Role para baixo e toque em "Adicionar à Tela de Início"\n3. Toque em "Adicionar" no canto superior direito');
    }
  };

  // Se não estiver na página admin ou não for um dispositivo móvel, não mostrar o botão
  if (!shouldShowInstallButton && !isInstallable) return null;

  return (
    <Button 
      onClick={handleInstallClick} 
      variant="outline" 
      size="icon" 
      className="bg-cps-wine text-white hover:bg-cps-wine/90 hover:text-white rounded-full w-10 h-10 flex items-center justify-center" 
      title="Instalar App"
    >
      <Download size={16} />
    </Button>
  );
}
