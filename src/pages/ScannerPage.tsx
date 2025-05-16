import { useEffect, useState } from "react";
import { QRCodeScanner } from "@/components/QRCodeScanner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PWAInstall } from "@/components/PWAInstall";

export default function ScannerPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/login", { state: { returnUrl: "/scanner" } });
    } else {
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  };

  const handleClose = () => {
    navigate("/admin");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cps-wine"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirecionando para login
  }

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="flex items-center gap-1 text-cps-wine hover:text-cps-wine/90"
          >
            <ArrowLeft size={16} />
            Voltar
          </Button>
          
          <div className="absolute top-4 right-4">
            <PWAInstall />
          </div>
        </div>
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-cps-wine">Scanner de QR Code</h1>
          <div className="w-16 h-1 bg-cps-wine rounded-full mx-auto my-2"></div>
          <p className="text-sm text-gray-500">
            Escaneie o QR Code do participante para registrar o check-in no evento
          </p>
        </div>
        
        <QRCodeScanner onClose={handleClose} />
      </div>
    </div>
  );
}
