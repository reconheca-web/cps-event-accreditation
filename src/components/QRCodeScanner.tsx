import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { CameraIcon, XIcon, RefreshCwIcon, CheckCircleIcon, AlertCircleIcon, Download } from "lucide-react";
import { PWAInstall } from "./PWAInstall";

interface QRCodeScannerProps {
  onClose: () => void;
}

export function QRCodeScanner({ onClose }: QRCodeScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<"environment" | "user">("environment");
  const [lastCheckInResult, setLastCheckInResult] = useState<{success: boolean; message: string; nome?: string} | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Inicializa o scanner quando o componente é montado
    try {
      scannerRef.current = new Html5Qrcode("reader");
    } catch (error) {
      console.error("Erro ao inicializar o scanner:", error);
    }
    
    // Limpa o scanner quando o componente é desmontado
    return () => {
      if (scannerRef.current) {
        try {
          if (scanning) {
            scannerRef.current.stop().catch(error => {
              // Ignoramos erros de parada durante a desmontagem
            });
          }
        } catch (error) {
          // Ignoramos erros durante a desmontagem
        }
      }
    };
  }, []);
  
  // Efeito para garantir que o scanner seja parado quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (scannerRef.current && scanning) {
        try {
          scannerRef.current.stop().catch(() => {});
        } catch (error) {
          // Ignoramos erros durante a desmontagem
        }
      }
    };
  }, [scanning]);

  const startScanner = () => {
    // Limpa o elemento HTML antes de inicializar o scanner
    const readerElement = document.getElementById("reader");
    if (readerElement) {
      readerElement.innerHTML = "";
    }
    
    // Verifica se o scanner já existe
    if (!scannerRef.current) {
      try {
        // Tenta criar um novo scanner se não existir
        scannerRef.current = new Html5Qrcode("reader");
      } catch (error) {
        console.error("Erro ao inicializar o scanner:", error);
        toast({
          variant: "destructive",
          title: "Erro ao inicializar o scanner",
          description: "Não foi possível inicializar o scanner de QR Code.",
        });
        return;
      }
    }
    
    // Se o scanner já estiver ativo, para primeiro
    if (scanning) {
      try {
        stopScanner();
      } catch (error) {
        // Ignora erros ao parar o scanner
      }
    }
    
    // Configuração do scanner otimizada para dispositivos móveis
    const config = { 
      fps: 10, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      // Nota: Não especificamos formatos, o scanner detectará QR Codes automaticamente
      rememberLastUsedCamera: true, // Lembra da última câmera usada
      useBarCodeDetectorIfSupported: true // Usa a API nativa de detecção de código de barras quando disponível
    };
    
    // Atualiza o estado para escaneando
    setScanning(true);
    
    // Inicia o scanner com tratamento de erros adequado
    try {
      // Adiciona um pequeno atraso para garantir que o DOM esteja pronto
      setTimeout(() => {
        if (scannerRef.current) {
          scannerRef.current.start(
            { facingMode: cameraFacingMode },
            config,
            handleQRCodeSuccess,
            handleQRCodeError
          ).catch(error => {
            setScanning(false);
            toast({
              variant: "destructive",
              title: "Erro ao iniciar câmera",
              description: "Verifique se você concedeu permissão para acessar a câmera.",
            });
            console.error("Erro ao iniciar o scanner:", error);
          });
        }
      }, 300);
    } catch (error) {
      setScanning(false);
      toast({
        variant: "destructive",
        title: "Erro ao iniciar câmera",
        description: "Ocorreu um erro ao tentar acessar a câmera.",
      });
      console.error("Erro ao iniciar o scanner:", error);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current && scanning) {
      try {
        // Tentamos parar o scanner de forma segura
        scannerRef.current.stop().then(() => {
          setScanning(false);
        }).catch(error => {
          // Mesmo com erro, atualizamos o estado para não escaneando
          setScanning(false);
          console.error("Erro ao parar o scanner:", error);
        });
      } catch (error) {
        // Em caso de erro, garantimos que o estado seja atualizado
        setScanning(false);
        console.error("Erro ao parar o scanner:", error);
      }
    } else {
      // Garantimos que o estado esteja correto mesmo se o scanner não existir
      setScanning(false);
    }
  };
  
  const toggleCamera = () => {
    if (scanning) {
      // Para o scanner atual
      stopScanner();
      
      // Alterna o modo da câmera
      setCameraFacingMode(prev => prev === "environment" ? "user" : "environment");
      
      // Aumenta o tempo de espera para dispositivos Android
      // e adiciona tratamento de erro para evitar travamentos
      setTimeout(() => {
        try {
          // Limpa o elemento HTML antes de reiniciar o scanner
          const readerElement = document.getElementById("reader");
          if (readerElement) {
            readerElement.innerHTML = "";
          }
          
          // Reinicia o scanner com o novo modo de câmera
          startScanner();
        } catch (error) {
          console.error("Erro ao alternar câmera:", error);
          toast({
            variant: "destructive",
            title: "Erro ao alternar câmera",
            description: "Tente fechar e abrir o scanner novamente.",
          });
        }
      }, 1000); // Aumentado para 1000ms para dar mais tempo para a câmera alternar
    }
  };

  const handleQRCodeSuccess = async (decodedText: string) => {
    try {
      // Para o scanner após ler um QR code
      await stopScanner();
      
      // Verifica se o texto decodificado é um UUID válido
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (!uuidRegex.test(decodedText)) {
        setLastCheckInResult({
          success: false,
          message: "O QR Code não contém um ID de inscrição válido."
        });
        
        toast({
          variant: "destructive",
          title: "QR Code inválido",
          description: "O QR Code não contém um ID de inscrição válido.",
        });
        return;
      }
      
      // Primeiro, verifica se o usuário já realizou check-in
      const { data: checkData, error: checkError } = await supabase
        .from("inscricoes_evento_cps")
        .select("nome_completo, check_in")
        .eq("id", decodedText)
        .single();
      
      if (checkError) {
        throw checkError;
      }
      
      // Se não encontrou o inscrito
      if (!checkData) {
        setLastCheckInResult({
          success: false,
          message: "Não foi possível encontrar uma inscrição com este QR Code."
        });
        
        toast({
          variant: "destructive",
          title: "Inscrição não encontrada",
          description: "Não foi possível encontrar uma inscrição com este QR Code.",
        });
        return;
      }
      
      // Verifica se já fez check-in anteriormente
      if (checkData.check_in) {
        setLastCheckInResult({
          success: true,
          message: "Este participante já realizou o check-in anteriormente.",
          nome: checkData.nome_completo
        });
        
        toast({
          title: "Check-in já realizado",
          description: `${checkData.nome_completo} já realizou o check-in anteriormente.`,
          duration: 4000,
        });
        
        // Aguarda 2 segundos para exibir o resultado antes de fechar
        setTimeout(() => {
          if (window.location.pathname !== "/admin") {
            navigate("/admin");
          } else {
            onClose();
          }
        }, 2000);
        return;
      }
      
      // Se não fez check-in, atualiza o banco de dados
      const { data, error } = await supabase
        .from("inscricoes_evento_cps")
        .update({ check_in: new Date().toISOString() })
        .eq("id", decodedText)
        .select("nome_completo");
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Armazena o resultado do check-in para exibição
        setLastCheckInResult({
          success: true,
          message: `Check-in realizado com sucesso!`,
          nome: data[0].nome_completo
        });
        
        toast({
          title: "Check-in realizado com sucesso!",
          description: `Check-in de ${data[0].nome_completo} confirmado.`,
          duration: 4000,
        });
        
        // Aguarda 2 segundos para exibir o resultado antes de fechar
        setTimeout(() => {
          // Garantimos que estamos na rota /admin antes de fechar o modal
          // Usamos o hook de navegação do React Router para evitar problemas de renderização
          if (window.location.pathname !== "/admin") {
            navigate("/admin");
          } else {
            onClose();
          }
        }, 2000);
      } else {
        setLastCheckInResult({
          success: false,
          message: "Não foi possível encontrar uma inscrição com este QR Code."
        });
        
        toast({
          variant: "destructive",
          title: "Inscrição não encontrada",
          description: "Não foi possível encontrar uma inscrição com este QR Code.",
        });
      }
    } catch (error: any) {
      setLastCheckInResult({
        success: false,
        message: error.message
      });
      
      toast({
        variant: "destructive",
        title: "Erro ao realizar check-in",
        description: error.message,
      });
    }
  };

  const handleClose = () => {
    // Para o scanner se estiver ativo para evitar problemas
    if (scanning) {
      try {
        // Garantimos que o scanner seja completamente parado antes de fechar
        scannerRef.current?.stop().then(() => {
          setScanning(false);
          setLastCheckInResult(null);
          onClose();
        }).catch(error => {
          console.error("Erro ao parar o scanner:", error);
          // Mesmo com erro, tentamos fechar o modal
          setScanning(false);
          setLastCheckInResult(null);
          onClose();
        });
      } catch (error) {
        console.error("Erro ao parar o scanner:", error);
        // Mesmo com erro, tentamos fechar o modal
        setScanning(false);
        setLastCheckInResult(null);
        onClose();
      }
    } else {
      // Se não estiver escaneando, apenas fecha normalmente
      setLastCheckInResult(null);
      onClose();
    }
  };

  const handleQRCodeError = (error: any) => {
    // Apenas registra o erro no console, não interrompe o scanner
    console.error("Erro na leitura do QR Code:", error);
    // Não exibimos toast para evitar spam de mensagens durante o escaneamento
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Container do scanner com bordas e estilo visual alinhado com o site */}
      <div className="w-full flex flex-col items-center">
        {lastCheckInResult ? (
          <div className={`w-full max-w-md h-64 border-2 ${lastCheckInResult.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'} rounded-md overflow-hidden shadow-md flex flex-col items-center justify-center p-6 text-center`}>
            {lastCheckInResult.success ? (
              <>
                <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-green-700">{lastCheckInResult.message}</h3>
                {lastCheckInResult.nome && (
                  <p className="text-green-600 mt-2 text-lg">{lastCheckInResult.nome}</p>
                )}
                <p className="text-sm text-green-600 mt-4">Retornando à tela principal...</p>
              </>
            ) : (
              <>
                <AlertCircleIcon className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-red-700">Erro no Check-in</h3>
                <p className="text-red-600 mt-2">{lastCheckInResult.message}</p>
                <Button 
                  onClick={() => {
                    setLastCheckInResult(null);
                    startScanner();
                  }} 
                  className="mt-4 bg-cps-wine hover:bg-cps-wine/90"
                >
                  Tentar Novamente
                </Button>
              </>
            )}
          </div>
        ) : (
          <>
            <div 
              id="reader" 
              className="w-full max-w-md h-64 border-2 border-cps-wine/30 rounded-md overflow-hidden shadow-md"
            ></div>
            
            {/* Status do scanner */}
            <div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${scanning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {scanning ? 'Scanner ativo' : 'Scanner inativo'}
            </div>
          </>
        )}
      </div>
      
      {/* Botões de ação */}
      <div className="flex flex-wrap justify-center gap-2 w-full max-w-md">
        {!lastCheckInResult && (
          <>
            {!scanning ? (
              <Button 
                onClick={startScanner} 
                className="bg-cps-wine hover:bg-cps-wine/90 flex items-center gap-2 flex-1 min-w-[120px]"
              >
                <CameraIcon size={18} />
                Iniciar Scanner
              </Button>
            ) : (
              <Button 
                onClick={stopScanner} 
                variant="outline"
                className="flex items-center gap-2 flex-1 min-w-[120px] border-red-300 text-red-700 hover:bg-red-50"
              >
                <XIcon size={18} />
                Parar Scanner
              </Button>
            )}
            
            {scanning && (
              <Button 
                onClick={toggleCamera} 
                variant="outline"
                className="flex items-center gap-2 flex-1 min-w-[120px] border-cps-wine/30 text-cps-wine hover:bg-cps-wine/10"
                title={cameraFacingMode === "environment" ? "Mudar para câmera frontal" : "Mudar para câmera traseira"}
              >
                <RefreshCwIcon size={18} />
                {cameraFacingMode === "environment" ? "Câmera Frontal" : "Câmera Traseira"}
              </Button>
            )}
          </>
        )}
        
        <Button 
          onClick={handleClose} 
          variant="outline"
          className="flex items-center gap-2 flex-1 min-w-[120px]"
        >
          <XIcon size={18} />
          Fechar
        </Button>
        
        {/* Botão de instalação do PWA */}
        <div className="absolute bottom-4 right-4">
          <PWAInstall />
        </div>
      </div>
      
      {/* Instruções */}
      {!lastCheckInResult && (
        <div className="text-sm text-gray-600 text-center mt-2 space-y-1 w-full max-w-md bg-gray-50 p-3 rounded-md border border-gray-200">
          <p className="font-medium">Posicione o QR Code do participante na frente da câmera para realizar o check-in.</p>
          {scanning && (
            <p className="text-xs">
              Usando {cameraFacingMode === "environment" ? "câmera traseira" : "câmera frontal"}. 
              Clique em "{cameraFacingMode === "environment" ? "Câmera Frontal" : "Câmera Traseira"}" para alternar.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
