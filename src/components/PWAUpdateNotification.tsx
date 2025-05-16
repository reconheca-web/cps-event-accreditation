import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

// Importar o tipo do updateSW
type UpdateSWFunction = (reloadPage?: boolean) => Promise<void>;

interface PWAUpdateNotificationProps {
  updateSW: UpdateSWFunction;
}

export function PWAUpdateNotification({ updateSW }: PWAUpdateNotificationProps) {
  const { toast } = useToast();
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    // Expor funções para o objeto window para que possam ser chamadas pelo service worker
    window.updateSWCallbacks = {
      onNeedRefresh: () => setNeedRefresh(true),
      onOfflineReady: () => {
        toast({
          title: "Aplicativo pronto para uso offline",
          description: "O aplicativo pode ser usado mesmo sem conexão com a internet.",
          duration: 5000,
        });
      }
    };

    return () => {
      // Limpar callbacks ao desmontar o componente
      delete window.updateSWCallbacks;
    };
  }, [toast]);

  const handleUpdate = () => {
    updateSW(true).catch(console.error);
  };

  useEffect(() => {
    if (needRefresh) {
      toast({
        title: "Nova versão disponível",
        description: "Uma nova versão do aplicativo está disponível.",
        action: (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleUpdate}
            className="flex items-center gap-2 bg-cps-wine text-white hover:bg-cps-wine/90 hover:text-white"
          >
            <RefreshCw size={16} />
            Atualizar
          </Button>
        ),
        duration: 0, // Não expira automaticamente
      });
    }
  }, [needRefresh, toast]);

  return null;
}

// Declarar os tipos para as callbacks do service worker no objeto window
declare global {
  interface Window {
    updateSWCallbacks?: {
      onNeedRefresh: () => void;
      onOfflineReady: () => void;
    };
  }
}
