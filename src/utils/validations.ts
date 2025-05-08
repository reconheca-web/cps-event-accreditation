
export interface FormErrors {
  nome?: string;
  email?: string;
  telefone?: string;
  tipoUnidade?: string;
  nomeUnidade?: string;
}

export const validateForm = (
  values: {
    nome: string;
    email: string;
    telefone: string;
    tipoUnidade: string;
    nomeUnidade: string;
  },
  existingEmails: string[],
  existingPhones: string[]
): FormErrors => {
  const errors: FormErrors = {};

  // Nome validation
  if (!values.nome.trim()) {
    errors.nome = "Nome completo é obrigatório";
  }

  // Email validation
  if (!values.email.trim()) {
    errors.email = "E-mail é obrigatório";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Formato de e-mail inválido";
  } else if (existingEmails.includes(values.email)) {
    errors.email = "Este e-mail já foi utilizado";
  }

  // Telefone validation
  if (!values.telefone.trim()) {
    errors.telefone = "Telefone (WhatsApp) é obrigatório";
  } else if (!/^\(\d{2}\)\s\d{5}-\d{4}$/.test(values.telefone)) {
    errors.telefone = "Formato inválido. Use (XX) XXXXX-XXXX";
  } else if (existingPhones.includes(values.telefone)) {
    errors.telefone = "Este telefone já foi utilizado";
  }

  // Tipo de Unidade validation
  if (!values.tipoUnidade) {
    errors.tipoUnidade = "Tipo de unidade é obrigatório";
  }

  // Nome da Unidade validation
  if (!values.nomeUnidade) {
    errors.nomeUnidade = "Nome da unidade é obrigatório";
  }

  return errors;
};

// Mask telefone input as (XX) XXXXX-XXXX
export const maskPhone = (value: string): string => {
  if (!value) return "";

  // Remove all non-numeric characters
  const numericValue = value.replace(/\D/g, "");
  
  // Format the phone number
  if (numericValue.length <= 2) {
    return numericValue;
  } else if (numericValue.length <= 7) {
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
  } else {
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(
      2,
      7
    )}-${numericValue.slice(7, 11)}`;
  }
};
