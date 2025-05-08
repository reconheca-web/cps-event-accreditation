
import React, { useState } from 'react';
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
  const { toast } = useToast();
  
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
  
  const handleTipoUnidadeChange = (value: string) => {
    form.setValue("tipoUnidade", value);
    form.setValue("nomeUnidade", "");
    
    if (value === "ETEC" || value === "FATEC") {
      setUnidadeOptions(unidadesList[value]);
    } else {
      setUnidadeOptions([]);
    }
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskPhone(e.target.value);
    form.setValue("telefone", maskedValue);
  };
  
  const handleSubmit = (data: FormValues) => {
    // Validate the form data
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
    console.log("Form submitted:", data);
    
    // Show success modal
    setShowSuccessModal(true);
  };
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                      className={errors.nome ? "border-red-500" : ""}
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
                      className={errors.email ? "border-red-500" : ""}
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
                      className={errors.telefone ? "border-red-500" : ""}
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
                        className={errors.tipoUnidade ? "border-red-500" : ""}
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
                        className={errors.nomeUnidade ? "border-red-500" : ""}
                      />
                    </FormControl>
                  ) : (
                    <Select
                      onValueChange={(value) => form.setValue("nomeUnidade", value)}
                      defaultValue={field.value}
                      disabled={!form.watch("tipoUnidade") || unidadeOptions.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger 
                          className={errors.nomeUnidade ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {unidadeOptions.map((unidade) => (
                          <SelectItem key={unidade} value={unidade}>
                            {unidade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.nomeUnidade && <FormMessage>{errors.nomeUnidade}</FormMessage>}
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-cps-wine hover:bg-cps-wine/90 text-white"
            >
              Inscrever-se
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
