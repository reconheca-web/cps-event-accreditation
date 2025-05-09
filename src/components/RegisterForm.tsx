
import React, { useState, useRef, useEffect } from 'react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { FormErrors, validateForm, maskPhone } from "@/utils/validations";
import { unidadesList } from "@/data/locations";
import { useToast } from "@/hooks/use-toast";
import SuccessModal from './SuccessModal';
import { useCreateInscricao } from '@/hooks/useMutations/useCreateInscricao';
import { InscricaoInput } from '@/types/supabase';

interface FormValues {
  nome: string;
  email: string;
  telefone: string;
  tipoUnidade: string;
  nomeUnidade: string;
}

// Mock database of existing emails and phones for validation
const EXISTING_EMAILS = ["teste@cps.sp.gov.br"];
const EXISTING_PHONES = ["(11) 99999-9999"];

const RegisterForm: React.FC = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [unidadeOptions, setUnidadeOptions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const createInscricaoMutation = useCreateInscricao();
  
  const form = useForm<FormValues>({
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      tipoUnidade: "",
      nomeUnidade: "",
    }
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const isSubmitting = createInscricaoMutation.isPending;
  
  const handleTipoUnidadeChange = (value: string) => {
    form.setValue("tipoUnidade", value);
    form.setValue("nomeUnidade", "");
    setSearchTerm("");
    
    if (value === "ETEC" || value === "FATEC") {
      setUnidadeOptions(unidadesList[value]);
    } else {
      setUnidadeOptions([]);
    }
  };
  
  // Filtra as unidades com base no termo de busca
  const filteredUnidades = unidadeOptions.filter(unidade => 
    unidade.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Foca no campo de busca quando o Select é aberto (apenas em dispositivos desktop)
  useEffect(() => {
    // Verifica se é um dispositivo móvel (tela sensível ao toque)
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || ('ontouchstart' in window);
    
    if (isSelectOpen && searchInputRef.current && !isMobileDevice) {
      // Apenas foca automaticamente em dispositivos não-móveis
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSelectOpen]);
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskPhone(e.target.value);
    form.setValue("telefone", maskedValue);
  };
  
  const handleSubmit = (data: FormValues) => {
    // Validate the form data localmente
    const validationErrors = validateForm(data, EXISTING_EMAILS, EXISTING_PHONES);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Show toast for the first error
      const firstError = Object.values(validationErrors)[0];
      toast({
        title: "Erro no formulário",
        description: firstError,
        variant: "destructive",
      });
      
      return;
    }
    
    setErrors({});
    
    // Preparar dados para o Supabase
    const inscricaoData: InscricaoInput = {
      nome_completo: data.nome,
      email: data.email,
      telefone: data.telefone,
      tipo_unidade: data.tipoUnidade,
      nome_unidade: data.nomeUnidade
    };
    
    // Enviar dados para o Supabase via mutation
    createInscricaoMutation.mutate(inscricaoData, {
      onSuccess: () => {
        console.log("Inscrição registrada com sucesso!");
        // Limpar formulário
        form.reset();
        // Mostrar modal de sucesso
        setShowSuccessModal(true);
      },
      onError: (error: Error) => {
        console.error("Erro ao enviar inscrição:", error);
        toast({
          title: "Erro ao processar inscrição",
          description: error.message || "Ocorreu um erro ao processar sua inscrição. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    });
  };
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Nome Completo*</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite seu nome completo" 
                      {...field} 
                      className={errors.nome ? "border-red-500 w-full" : "w-full"}
                    />
                  </FormControl>
                  {errors.nome && <FormMessage>{errors.nome}</FormMessage>}
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">E-mail*</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="seu.email@exemplo.com" 
                      {...field} 
                      className={errors.email ? "border-red-500 w-full" : "w-full"}
                    />
                  </FormControl>
                  {errors.email && <FormMessage>{errors.email}</FormMessage>}
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Telefone (WhatsApp)*</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(XX) XXXXX-XXXX" 
                      {...field}
                      onChange={(e) => handlePhoneChange(e)} 
                      className={errors.telefone ? "border-red-500 w-full" : "w-full"}
                    />
                  </FormControl>
                  {errors.telefone && <FormMessage>{errors.telefone}</FormMessage>}
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tipoUnidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Tipo de Unidade*</FormLabel>
                  <Select 
                    onValueChange={handleTipoUnidadeChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger 
                        className={errors.tipoUnidade ? "border-red-500 w-full" : "w-full"}
                      >
                        <SelectValue placeholder="Selecione o tipo de unidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ETEC">ETEC</SelectItem>
                      <SelectItem value="FATEC">FATEC</SelectItem>
                      <SelectItem value="Coordenadoria">Coordenadoria</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipoUnidade && <FormMessage>{errors.tipoUnidade}</FormMessage>}
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nomeUnidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Nome da Unidade*</FormLabel>
                  {form.watch("tipoUnidade") === "Coordenadoria" ? (
                    <FormControl>
                      <Input 
                        placeholder="Digite o nome da coordenadoria" 
                        {...field} 
                        className={errors.nomeUnidade ? "border-red-500 w-full" : "w-full"}
                      />
                    </FormControl>
                  ) : (
                    <div className="space-y-0 w-full">
                      <Select
                        onValueChange={(value) => form.setValue("nomeUnidade", value)}
                        value={field.value}
                        disabled={!form.watch("tipoUnidade") || unidadeOptions.length === 0}
                        onOpenChange={setIsSelectOpen}
                        open={isSelectOpen}
                      >
                        <FormControl>
                          <SelectTrigger 
                            className={errors.nomeUnidade ? "border-red-500 w-full" : "w-full"}
                          >
                            <SelectValue placeholder="Selecione a unidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent 
                          className="max-h-[400px] overflow-auto" 
                          position="popper"
                        >
                          <div className="px-2 py-2 sticky top-0 bg-white z-10 border-b">
                            <Input
                              ref={searchInputRef}
                              placeholder="Digite para buscar..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full"
                              // Previne propagação de eventos para evitar fechamento em dispositivos móveis
                              onClick={(e) => e.stopPropagation()}
                              onTouchStart={(e) => e.stopPropagation()}
                            />
                          </div>
                          
                          {filteredUnidades.length === 0 ? (
                            <div className="p-2 text-center text-sm text-gray-500">
                              Nenhuma unidade encontrada
                            </div>
                          ) : (
                            filteredUnidades.map((unidade) => (
                              <SelectItem key={unidade} value={unidade}>
                                {unidade}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {errors.nomeUnidade && <FormMessage>{errors.nomeUnidade}</FormMessage>}
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-cps-wine hover:bg-cps-wine/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processando...' : 'Inscrever-se'}
            </Button>
          </form>
        </Form>
      </div>
      
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
    </>
  );
};

export default RegisterForm;
