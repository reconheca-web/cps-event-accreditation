
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-cps-blue-dark">
            Inscrição Realizada com Sucesso!
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center text-center py-6">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />

          <p className="text-gray-700 mb-6">
          Sua inscrição para o evento Encontro de Gestores CPS 2025 foi recebida com sucesso! 
          Em breve, confirmaremos sua inscrição através do WhatsApp.
          </p>
          
          <Button 
            className="bg-cps-blue-dark text-white hover:bg-cps-blue-dark/90 w-full md:w-auto"
            onClick={onClose}
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
