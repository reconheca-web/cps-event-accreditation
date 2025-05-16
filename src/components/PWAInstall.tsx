import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { setupPWAStartUrl } from '@/lib/pwaUtils';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const location = useLocation();
  
  // Detectar dispositivos móveis no momento da montagem do componente
  useEffect(() => {
    // Detectar se é um dispositivo móvel
    const mobileDevice = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(mobileDevice);
    
    // Detectar se é iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);
    
    // Detectar se é Android
    const isAndroidDevice = /Android/i.test(navigator.userAgent);
    setIsAndroid(isAndroidDevice);
    
    // Para dispositivos móveis, já marca como instalável
    if (mobileDevice) {
      setIsInstallable(true);
    }
    
    // Configurar a URL inicial do PWA
    // Chamamos essa função aqui para garantir que a URL seja configurada
    // mesmo que o usuário não clique no botão de instalação
    setupPWAStartUrl();
  }, []);
  
  // Não mostrar o botão na página de login
  const isLoginPage = location.pathname === '/login';
  
  // Forçar a exibição do botão em dispositivos móveis, exceto na página de login
  const shouldShowInstallButton = !isLoginPage && isMobile;

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

  // Remover o efeito específico para Safari no iOS, pois já estamos tratando isso no useEffect inicial

  const handleInstallClick = async () => {
    // Garantir que a URL inicial seja configurada antes da instalação
    setupPWAStartUrl();
    
    // Verificar se temos o evento beforeinstallprompt disponível (Android/Chrome)
    if (deferredPrompt) {
      try {
        // Registrar a URL atual antes de mostrar o prompt
        const currentPath = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.delete('source'); // Remover o parâmetro source se existir
        
        const queryString = searchParams.toString();
        const fullPath = currentPath + (queryString ? `?${queryString}` : '');
        
        // Armazenar a URL atual no localStorage
        localStorage.setItem('pwa_start_url', fullPath);
        console.log('PWA start URL configurada antes da instalação:', fullPath);
        
        // Para navegadores que suportam o evento beforeinstallprompt (Chrome, Edge, etc.)
        deferredPrompt.prompt();

        // Aguardar pela escolha do usuário
        const { outcome } = await deferredPrompt.userChoice;
        
        // Limpar o prompt armazenado, pois ele não pode ser usado novamente
        setDeferredPrompt(null);
        
        if (outcome === 'accepted') {
          setIsInstallable(false);
          console.log('Usuário aceitou a instalação do PWA');
          // Garantir que a URL inicial esteja corretamente configurada após a instalação
          localStorage.setItem('pwa_start_url', fullPath);
          console.log('PWA start URL confirmada após instalação:', fullPath);
        } else {
          console.log('Usuário recusou a instalação do PWA');
        }
      } catch (error) {
        console.error('Erro ao tentar instalar o PWA:', error);
        mostrarInstrucoesInstalacao();
      }
      return;
    }
    
    // Se não temos o evento beforeinstallprompt, mostrar instruções específicas para cada plataforma
    mostrarInstrucoesInstalacao();
  };
  
  // Função para mostrar instruções de instalação específicas para cada plataforma
  const mostrarInstrucoesInstalacao = () => {
    if (isIOS) {
      // Instruções para iOS
      alert('Para instalar o aplicativo no iOS:\n\n1. Toque no ícone de compartilhamento (quadrado com seta para cima)\n2. Role para baixo e toque em "Adicionar à Tela de Início"\n3. Toque em "Adicionar" no canto superior direito');
    } else if (isAndroid) {
      // Instruções para Android
      alert('Para instalar o aplicativo no Android:\n\n1. Toque no menu (três pontos) no canto superior direito\n2. Selecione "Instalar aplicativo" ou "Adicionar à tela inicial"');
    } else {
      // Instruções genéricas para outros dispositivos
      alert('Para instalar este aplicativo:\n\n1. Abra o menu do seu navegador\n2. Procure a opção "Instalar aplicativo" ou "Adicionar à tela inicial"');
    }
  };

  // Verificar se deve mostrar o botão de instalação
  // Mostrar o botão se:
  // 1. Não estiver na página de login E
  // 2. (Tiver um prompt de instalação disponível OU for um dispositivo iOS)
  if (isLoginPage || (!isInstallable && !deferredPrompt && !isIOS)) return null;

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
